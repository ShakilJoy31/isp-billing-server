// enhancedEmail.service.js
const nodemailer = require("nodemailer");
const Email = require("../../models/email/email.model");

const getActiveEmailConfig = async () => {
  try {
    // First, check environment variables (for production)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log("Using environment variables for email config");
      return {
        email: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        appName: process.env.SMTP_USER.split("@")[0],
      };
    }

    // Fallback to database config
    console.log("Using database email config");
    const activeEmail = await Email.findOne({
      where: { isActive: true },
      attributes: ["email", "emailAppPassword", "appName"],
    });

    if (!activeEmail) {
      throw new Error("No active email configuration found");
    }

    return {
      email: activeEmail.email,
      password: activeEmail.emailAppPassword,
      appName: activeEmail.appName,
    };
  } catch (error) {
    console.error("Error fetching active email config:", error);
    throw error;
  }
};

const sendEmail = async (mailOptions, retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    const activeEmailConfig = await getActiveEmailConfig();
    
    // Try different configurations
    const configs = [
      {
        name: "Port 587 (TLS)",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
      },
      {
        name: "Port 465 (SSL)",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
      },
      {
        name: "Port 25",
        host: "smtp.gmail.com",
        port: 25,
        secure: false,
      },
    ];

    for (const config of configs) {
      try {
        console.log(`Trying ${config.name}...`);
        
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          requireTLS: config.requireTLS,
          auth: {
            user: activeEmailConfig.email,
            pass: activeEmailConfig.password,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
        });

        await transporter.verify();
        console.log(`✓ ${config.name} connection successful`);

        const info = await transporter.sendMail({
          from: `"${activeEmailConfig.appName || "BillISP"}" <${activeEmailConfig.email}>`,
          ...mailOptions,
        });

        console.log(`Email sent via ${config.name}:`, info.messageId);
        
        return {
          success: true,
          messageId: info.messageId,
          usedConfig: config.name,
        };
      } catch (error) {
        console.log(`✗ ${config.name} failed:`, error.message);
        continue; // Try next config
      }
    }

    throw new Error("All SMTP configurations failed");

  } catch (error) {
    console.error("Email sending failed:", error.message);
    
    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`Retrying... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return sendEmail(mailOptions, retryCount + 1);
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendEmail,
  getActiveEmailConfig,
};