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

  let mailOptions = {
    from: "nguyenvitieubao021700@gmail.com",
    to: email,
    subject: "Bietdoibancuoi - Reset Password",
    text: "" + data.otp,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent!!!");
    }
  });
};
// abc
module.exports = sendEmail;
