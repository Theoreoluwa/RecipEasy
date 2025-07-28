const nodemailer = require('nodemailer');

//email configuration
exports.transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: +(process.env.EMAIL_PORT || ''),
  secure: false, // Set to true if using port 46
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
