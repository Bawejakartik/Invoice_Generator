const nodemailer = require("nodemailer");
require("dotenv").config()
// const transporter = nodemailer.createTransport({
// service: "gmail",

// auth: {
// user: process.env.GMAIL_USER,
// pass: process.env.GMAIL_APP_PASSWORD,
// },
// });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   family: 4,
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });



const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_PASSWORD,
    },
});


transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP Verify:", err);
    } else {
        console.log("SMTP Connected");
    }
});
module.exports = transporter;

