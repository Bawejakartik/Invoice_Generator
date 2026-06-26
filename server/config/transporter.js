const nodemailer = require("nodemailer");
require("dotenv").config()
// const transporter = nodemailer.createTransport({
// service: "gmail",

// auth: {
// user: process.env.GMAIL_USER,
// pass: process.env.GMAIL_APP_PASSWORD,
// },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
module.exports = transporter;
