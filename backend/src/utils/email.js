import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: `"TatkalSync" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code - TatkalSync",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Welcome to TatkalSync!</h2>
          <p>You requested an account creation. Please use the following complete code to verify your email address:</p>
          <div style="margin: 20px 0; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #F3F4F6; border-radius: 5px; display: inline-block; letter-spacing: 2px;">
            ${code}
          </div>
          <p>If you did not make this request, please ignore this email.</p>
          <p>Thank you.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
