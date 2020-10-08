const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

require("dotenv").config();

function sendEmail(data) {
  var options = {
    auth: {
      api_user: process.env.EMAIL_USER,
      api_key: process.env.EMAIL_PASS
    }
  }
  
  const transporter = nodemailer.createTransport(sgTransport(options));
  
  const email = {
    from: data.sender,
    to: data.receiver,
    subject: data.subject,
    text: 'Hello world',
    html: data.message
  };
  
  transporter.sendMail(email, function(err, info){
      if (err ){
        console.log(err);
      }
      else {
        console.log('Message sent: ' + info);
      }
  });
}

exports.sendEmail = sendEmail;