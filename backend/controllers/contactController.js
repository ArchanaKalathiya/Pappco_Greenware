const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, sent_from, reply_to, user_name, user_email) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Include user's name and email in the email body and format it using HTML
  const emailBody = `
    <p><strong>Message from:</strong> ${user_name} (<a href="mailto:${user_email}">${user_email}</a>)</p>
    <hr>
    <p>${message}</p>
  `;

  const mailOptions = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: `${subject} - From ${user_name}`, // Include user's name in the subject
    html: emailBody, // Use HTML for the email body
  };

  await transporter.sendMail(mailOptions);
};

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);

  // User doesn't exist
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  // Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
  }

  const send_to = process.env.EMAIL_USER; // Admin email
  const sent_from = user.email; // User's email
  const reply_to = user.email;

  try {
    await sendEmail(subject, message, send_to, sent_from, reply_to, user.name, user.email);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

module.exports = {
  sendEmail,
  contactUs,
};
