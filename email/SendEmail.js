const nodemailer = require("nodemailer");

const SendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Graphics View" ${process.env.MAIL_USER}`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
  }
};

module.exports = SendEmail;
