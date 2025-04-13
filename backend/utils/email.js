const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("📩 Sending email to:", options.to); // Debugging log

  if (!options.to) {
    throw new Error("Recipient email is not defined!");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Your Name <your-email@example.com>",
    to: options.to, // ✅ FIXED: Now correctly using `to`
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
