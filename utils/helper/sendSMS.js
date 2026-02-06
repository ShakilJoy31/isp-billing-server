const { default: axios } = require("axios");
const SMS = require("../../models/email/sms.model");

const sendSMSHelper = async (service, phoneNumber, customMessage = null, customVariables = {}) => {
  try {
    // Find the SMS configuration by service type
    const smsConfig = await SMS.findOne({ 
      where: { service } 
    });

    if (!smsConfig) {
      throw new Error(`No SMS configuration found for service: ${service}`);
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      throw new Error('Phone number is required');
    }

    // Use custom message if provided, otherwise use saved message
    let messageToSend = customMessage || smsConfig.message;

    // Replace variables in the message
    if (customVariables && Object.keys(customVariables).length > 0) {
      Object.keys(customVariables).forEach(key => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        messageToSend = messageToSend.replace(regex, customVariables[key]);
      });
    }

    // Construct the SMS API URL
    const baseUrl = smsConfig.baseUrl || "https://msg.mram.com.bd/smsapi";
    const apiUrl = `${baseUrl}?api_key=${encodeURIComponent(smsConfig.apiKey)}&type=${encodeURIComponent(smsConfig.type)}&contacts=${encodeURIComponent(phoneNumber)}&senderid=${encodeURIComponent(smsConfig.senderId)}&msg=${encodeURIComponent(messageToSend)}`;

    // Send the actual SMS via API
    const response = await axios.post(apiUrl, {
      timeout: 10000, // 10 second timeout
    });

    // Parse the response from SMS gateway
    let smsResponse = {
      success: false,
      message: '',
      data: null,
      apiResponse: response.data
    };

    // Try to parse the response based on common SMS gateway formats
    if (typeof response.data === 'string') {
      // Check for common success indicators
      if (response.data.includes('SMS SUBMITTED') || 
          response.data.includes('SUCCESS') || 
          response.data.includes('SENT') ||
          response.data.includes('100')) {
        smsResponse.success = true;
        smsResponse.message = 'SMS sent successfully';
      } else if (response.data.includes('ERROR') || 
                 response.data.includes('FAILED') ||
                 response.data.includes('INVALID')) {
        smsResponse.message = `SMS sending failed: ${response.data}`;
      } else {
        // If we can't determine, assume success for now
        smsResponse.success = true;
        smsResponse.message = 'SMS sent successfully';
      }
    } else if (typeof response.data === 'object') {
      // Handle JSON response
      if (response.data.status === 'SUCCESS' || 
          response.data.success === true || 
          response.data.error_code === '100') {
        smsResponse.success = true;
        smsResponse.message = response.data.message || 'SMS sent successfully';
      } else {
        smsResponse.message = response.data.message || 'SMS sending failed';
      }
      smsResponse.data = response.data;
    }

    // Return comprehensive response
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
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    // Handle errors gracefully
    let errorMessage = 'Failed to send SMS';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      errorMessage = `SMS gateway error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from SMS gateway';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'SMS gateway request timeout';
    } else if (error.message.includes('No SMS configuration')) {
      errorMessage = error.message;
    } else {
      // Something happened in setting up the request
      errorMessage = `Error setting up SMS request: ${error.message}`;
    }

    return {
      success: false,
      message: errorMessage,
      details: {
        error: error.message,
        service,
        to: phoneNumber,
        timestamp: new Date().toISOString()
      }
    };
  }
};



module.exports = {
  sendSMSHelper
};