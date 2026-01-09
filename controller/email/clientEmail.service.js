const nodemailer = require('nodemailer');

//! Create transporter with your Gmail configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "shakidul31@gmail.com",
        pass: "svozchfcqhuqefcx",
    },
});

//! Basic email sending function
const sendEmail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: "shakidul31@gmail.com",
            ...mailOptions,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEmail,
};