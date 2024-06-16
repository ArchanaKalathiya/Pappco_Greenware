const nodemailer = require("nodemailer");

// create email transporter using SMTP
const sendEmail = async (subject, message, send_to, sent_from, reply_to, attachmentPath) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // use Gmail as the service
        auth: {
            user: process.env.EMAIL_USER, // your Gmail username
            pass: process.env.EMAIL_PASS, // your Gmail password or app-specific password
        },
        tls: {
            rejectUnauthorized: false, // allow TLS usage
        },
    });

    // options for sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
        attachments: [
            {
                filename: attachmentPath.split('/').pop(),
                path: attachmentPath,
            },
        ],
    };

    // send email
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Message sent:", info.messageId);
        }
    });
};

module.exports = sendEmail;
