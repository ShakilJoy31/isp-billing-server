const nodemailer = require('nodemailer');

// Email configuration for cPanel
const emailConfig = {
  host: process.env.MAIL_HOST || 'admin.billisp.com',
  port: process.env.MAIL_PORT || 465, // Usually 465 for SSL, 587 for TLS
  secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;