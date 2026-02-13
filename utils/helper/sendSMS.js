const { default: axios } = require("axios");
const SMS = require("../../models/email/sms.model");
const ClientInformation = require("../../models/Authentication/client.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Package = require("../../models/package/package.model");

const sendSMSHelper = async (
  service,
  phoneNumber,
  userId,
  customMessage = null,
  customVariables = {},
) => {
  console.log("Sending SMS for service:", service, "to:", phoneNumber, userId);

  try {
    // Find the SMS configuration by service type
    const smsConfig = await SMS.findOne({
      where: { service },
    });

    if (!smsConfig) {
      throw new Error(`No SMS configuration found for service: ${service}`);
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === "") {
      throw new Error("Phone number is required");
    }

    // Get user information if userId is provided
    let userData = {};

    if (service === "Salary receive") {
      if (userId) {
        const theUser = await AuthorityInformation.findByPk(userId);
        if (theUser) {
          userData = theUser.toJSON();
        }
      }
    } else {
      const theUser = await ClientInformation.findByPk(userId);
      if (theUser) {
        userData = theUser.toJSON();
      }
    }

    let packageInfo = {};

    if (userId && service !== 'Salary receive') {
      const thePackage = await Package.findOne({
        where: { id: userData.package },
      });
      if (thePackage) {
        packageInfo = thePackage.toJSON();
      }
    }

    // Use custom message if provided, otherwise use saved message
    let messageToSend = customMessage || smsConfig.message;

    // Prepare all variables for replacement
    const allVariables = {
      // User information
      userId: userData.userId || "",
      fullName: userData.fullName || "",
      mobileNo: userData.mobileNo || "",
      email: userData.email || "",
      package: packageInfo.packageName || "",
      password: userData.password || "",
      status: userData.status || "",

      // Custom variables from controller (override user data if same key)
      ...customVariables,
    };

    // Replace all variables in the message
    Object.keys(allVariables).forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      messageToSend = messageToSend.replace(regex, allVariables[key] || "");
    });

    // Remove any remaining unreplaced variables
    messageToSend = messageToSend.replace(/\{[^}]+\}/g, "");

    // Construct the SMS API URL
    const baseUrl = smsConfig.baseUrl || "https://msg.mram.com.bd/smsapi";
    const apiUrl = `${baseUrl}?api_key=${encodeURIComponent(smsConfig.apiKey)}&type=${encodeURIComponent(smsConfig.type)}&contacts=${encodeURIComponent(phoneNumber)}&senderid=${encodeURIComponent(smsConfig.senderId)}&msg=${encodeURIComponent(messageToSend)}`;

    // Send the actual SMS via API
    const response = await axios.post(apiUrl, null, {
      timeout: 10000, // 10 second timeout
    });

    // Parse the response from SMS gateway
    let smsResponse = {
      success: false,
      message: "",
      data: null,
      apiResponse: response.data,
    };

    // Try to parse the response based on common SMS gateway formats
    if (typeof response.data === "string") {
      if (
        response.data.includes("SMS SUBMITTED") ||
        response.data.includes("SUCCESS") ||
        response.data.includes("SENT") ||
        response.data.includes("100")
      ) {
        smsResponse.success = true;
        smsResponse.message = "SMS sent successfully";
      } else {
        smsResponse.message = `SMS sending failed: ${response.data}`;
      }
    } else if (typeof response.data === "object") {
      if (
        response.data.status === "SUCCESS" ||
        response.data.success === true ||
        response.data.error_code === "100"
      ) {
        smsResponse.success = true;
        smsResponse.message = response.data.message || "SMS sent successfully";
      } else {
        smsResponse.message = response.data.message || "SMS sending failed";
      }
      smsResponse.data = response.data;
    }

    return {
      success: smsResponse.success,
      message: smsResponse.message,
      details: {
        service: smsConfig.service,
        to: phoneNumber,
        message: messageToSend,
        messageLength: messageToSend.length,
        type: smsConfig.type,
        senderId: smsConfig.senderId,
        smsGatewayResponse: smsResponse.apiResponse,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("SMS sending error:", error);

    let errorMessage = "Failed to send SMS";
    if (error.response) {
      errorMessage = `SMS gateway error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      errorMessage = "No response from SMS gateway";
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "SMS gateway request timeout";
    } else {
      errorMessage = `Error setting up SMS request: ${error.message}`;
    }

    return {
      success: false,
      message: errorMessage,
      details: {
        error: error.message,
        service,
        to: phoneNumber,
        timestamp: new Date().toISOString(),
      },
    };
  }
};

module.exports = {
  sendSMSHelper,
};
