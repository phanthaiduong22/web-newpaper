const resetModel = require("../models/reset.model");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (email, data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nguyenvitieubao021700@gmail.com",
      pass: "Bao0949478619",
    },
  });
  const info = {
    email,
    otp: data.otp,
    created_at: new Date().getTime(),
    expiresin: data.expiresIn,
  };
  await resetModel.add(info);

  let text = "";
  text += `<h2>Reset Your Password</h2>
  To change your password, please use the following One Time Password (OTP):
  <h2>${data.otp}</h2>
  This code will expire <b>three hours</b> after this email was sent.<br>
  Do not share this OTP with anyone. We takes your account security very
  seriously.<br>
  
  We hope to see you again soon.`;

  let mailOptions = {
    from: "nguyenvitieubao021700@gmail.com",
    to: email,
    subject: "Bietdoibancuoi - Reset Password",
    html: text,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    console.log(err);
  });
};
// abc
module.exports = sendEmail;
