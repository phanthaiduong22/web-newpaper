const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nguyenvitieubao021700@gmail.com",
      pass: "Bao0949478619",
    },
  });

  let mailOptions = {
    from: "nguyenvitieubao021700@gmail.com",
    to: "nguyenvitieubao021700@gmail.com",
    subject: "Testing and testing",
    text: "it worked",
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent!!!");
    }
  });
};

module.exports = sendEmail;
