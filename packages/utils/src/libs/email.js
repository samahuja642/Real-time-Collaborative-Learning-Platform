const nodemailer = require("nodemailer");

let transporter;

function initEmail() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER_EMAIL,
                pass: process.env.SMTP_USER_PASSWORD,
            }
        });
    }
    return transporter;
}

async function sendOtpEmail(to, otp) {
    const transporter = initEmail();
    await transporter.sendMail({
        from: `"My App" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
}

async function sendEmailVerificationMail(to, link, expiry) {
    const transporter = initEmail();
    await transporter.sendMail({
        from: `"My App" <${process.env.SMTP_USER}>`,
        to,
        subject: "Email Verification Link",
        text: `Please verify your email address by clicking the link below:
        ${link} 
        This link will expire in ${expiry} minutes. If you didn’t request this, you can ignore this email.
        Thanks, The My App Team
        `,
    });
}

module.exports = {
    sendOtpEmail,
    sendEmailVerificationMail,
};
