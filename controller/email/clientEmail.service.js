// enhancedEmail.service.js
const nodemailer = require("nodemailer");
const Email = require("../../models/email/email.model");

const getActiveEmailConfig = async () => {
  try {
    // First, check environment variables (for production)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      return {
        email: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        appName: process.env.SMTP_USER.split("@")[0],
      };
    }

    // Fallback to database config
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

        const info = await transporter.sendMail({
          from: `"${activeEmailConfig.appName || "BillISP"}" <${activeEmailConfig.email}>`,
          ...mailOptions,
        });
        
        return {
          success: true,
          messageId: info.messageId,
          usedConfig: config.name,
        };
      } catch (error) {
        continue; // Try next config
      }
    }

    throw new Error("All SMTP configurations failed");

  } catch (error) {
    // Retry logic
    if (retryCount < maxRetries) {
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