const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
    });
    const mailOptions = {
        from: "Vəliyev Yasin admin@yasin.site",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
