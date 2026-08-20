const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// exports.sendEmail = async({to,subject,otp}) =>{

//     const mailGenerator = new mailgen({
//          theme: "default",
//     product: {
//       name: "Invoice Generator",
//       link: "http://genuine.com",
//     },
//     })

//       const email = {
//     body: {
//       name: to.split("@")[0],
//       intro: "You requested a password reset.",
//       action: {
//         instructions:
//           "Use this OTP to reset your password. It will expire in 10 minutes.",
//         button: {
//           color: "#22BC66",
//           text: `OTP: ${otp}`,
//         },
//       },
//       outro: "If you did not request this, please ignore this email.",
//     },
//   };
//    const emailBody = mailGenerator.generate(email);
  
//      const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user:process.env.GMAIL_USER,
//       pass:process.env.GMAIL_APP_PASSWORD,
//     },
//   });
    
//   const info = await transporter.sendMail({
//     from: `"Invoice Generator" <${process.env.GMAIL_USER}>`,
//     to,
//     subject,
//     html: emailBody,
//   });

//   console.log(`Email sent: ${to}`);
// };



const transporter = require("./transporter");


 
exports.sendEmail = async ({ to, subject, otp }) => {
const mailGenerator = new Mailgen({
theme: "default",
product: {
name: "Invoice Generator",
link: "http://genuine.com",
},
});

const email = {
body: {
name: to.split("@")[0],
intro: "You requested a password reset.",
action: {
instructions:
"Use this OTP to reset your password. It will expire in 10 minutes.",
button: {
color: "#22BC66",
text: `OTP: ${otp}`,
},
},
outro: "If you did not request this, please ignore this email.",
},
};

const emailBody = mailGenerator.generate(email);

await transporter.sendMail({
from: `"Invoice Generator" <${process.env.SENDER_EMAIL}>`,
to,
subject,
html: emailBody,
});

console.log(`OTP Email sent to ${to}`);
};


exports.sendInvoiceEmail = async ({
to,
clientName,
invoiceNumber,
totalAmount,
pdfBuffer,
}) => {
const mailGenerator = new Mailgen({
theme: "default",
product: {
name: "Invoice Generator",
link: "http://genuine.com",
},
});

const email = {
body: {
name: clientName,


  intro: "A new invoice has been generated for you.",

  table: {
    data: [
      {
        Invoice: invoiceNumber,
        Amount: `₹${totalAmount}`,
      },
    ],
  },

  outro:
    "Please find the attached invoice PDF. Thank you for your business.",
},


};

const emailBody = mailGenerator.generate(email);

await transporter.sendMail({
from: `"Invoice Generator" <${process.env.SENDER_EMAIL}>`,
to,
subject: `Invoice ${invoiceNumber}`,
html: emailBody,


attachments: [
  {
    filename: `${invoiceNumber}.pdf`,
    content: pdfBuffer,
  },
],


});

console.log(`Invoice Email sent to ${to}`);
};
