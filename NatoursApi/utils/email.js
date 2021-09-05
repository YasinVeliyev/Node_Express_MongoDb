const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = "Vəliyev Yasin admin@yasin.site";
    }
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return;
        }
        console.log("f");
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
        });
    }

    async send(template, subject) {
        const html = await pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
        });
        console.log(__dirname);
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            // text: htmlToText.fromString(html),
            html,
        };
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        console.log("Blalalla");
        await this.send("welcome", "Welcome to the Natours family");
    }

    async sendPasswordReset() {
        await this.send("passwordreset", "Your password reset token (valid for only 10 minutes)");
    }
}
// let newUser = {
//     photo: "default.jpg",
//     role: "admin",
//     active: true,
//     _id: "612fd781f9b152889b25ba04",
//     name: "Yasin",
//     email: "veliyev.yasin@gmail.com",
// };
// let url = "http://localhost:3000";

// new Email(newUser, url)
//     .sendWelcome()
//     .then(console.log)
//     .catch((err) => console.log(err));

module.exports = Email;
