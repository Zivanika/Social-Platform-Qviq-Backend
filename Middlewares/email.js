"use strict";
//install nodemailer npm i nodemailer

//import nodemailer
const nodemailer = require("nodemailer");
const path = require("path");
const VerificationEmailTemplate = require("../utils/verifyEmail");

//1. create an email transporter
//SMTP helps transporter send emails
const transporter = nodemailer.createTransport({
    service:"gmail",
    // host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
        user: '21052646@kiit.ac.in',
        pass: 'bpbnyvhjzsvugatm' //got the password from google account itself inside App Passwords 
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // send mail with defined transport object
    
    //2. Configure email content and send email
    const result = await transporter.sendMail({
        from: '"✨ Akshat Jaiswal ✨" <21052646@kiit.ac.in>', // sender address
        to: "ekansha13@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "This email is sent using nodemailer", // plain text body
        html: VerificationEmailTemplate(), // html body
        attachments: [
            {
              filename: 'email.png',
              path: path.join(__dirname, "../utils/images/email.png"),
              cid: 'uniq-email.png' 
            },
            {
              filename: 'image-5.png',
              path: path.join(__dirname, "../utils/images/image-5.png"),
              cid: 'uniq-image-5.png' 
            },
            {
              filename: 'image-7.png',
              path: path.join(__dirname, "../utils/images/image-7.png"),
              cid: 'uniq-image-7.png' 
            },
            {
              filename: 'image-8.png',
              path: path.join(__dirname, "../utils/images/image-8.png"),
              cid: 'uniq-image-8.png' 
            }
          ]
    });

    console.log("Email sent successfully:")
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}

main().catch(console.error);
