require("dotenv").config();
const nodemailer = require("nodemailer");

function email() {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "DSE Web Scraping Error!!",
    //text: "There was an error while web scraping COVID19 Data. Please check your JavaScript running @ RPi4",
    html: "<body><p style='text-align: center'><img src='https://bpng.subpng.com/dy/9fa71abb2995bdf411553a97a4d94f44/L0KzQYm3U8IxN5R8iZH0aYP2gLBuTfVzepD3RdV4bYD4hLb5Tflkd594RdH7YX7qdX7skwJwel5ue9H3LUXkcoK7UBQ0OpU2S9MBLkizQomAVcYyOWY3SacBNka6RYKBVMYveJ9s/kisspng-error-computer-icons-orange-error-icon-5ab143d32d13a6.8028756115215666751846.png' height='150' width='150'/></p><h1 style='color: red; text-align: center'>There was an error while scraping stock prices from DSE.<br /> Please check your JavaScript files running @ RPi4</h1></body>",
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response + "\n");
    }
  });
}

module.exports.emailTrigger = function () {
  if (true) email();
};
