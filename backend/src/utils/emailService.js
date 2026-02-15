import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link - DynamiteVisuals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666;">Hello,</p>
          <p style="color: #666;">We received a request to reset your password. Click the link below to reset it:</p>
          
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666;">Or copy and paste this link in your browser:</p>
          <p style="color: #007bff; word-break: break-all;">${resetLink}</p>
          
          <p style="color: #666;">This link will expire in 1 hour.</p>
          
          <p style="color: #666;">If you didn't request a password reset, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2026 DynamiteVisuals. All rights reserved.</p>
        </div>
      `,
      text: `Password Reset Link\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const sendPasswordConfirmationEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed Successfully - DynamiteVisuals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Changed Successfully</h2>
          <p style="color: #666;">Hello ${userName},</p>
          <p style="color: #666;">Your password has been changed successfully.</p>
          
          <p style="color: #666;">If you didn't make this change, please contact support immediately.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2026 DynamiteVisuals. All rights reserved.</p>
        </div>
      `,
      text: `Your password has been changed successfully. If you didn't make this change, please contact support.`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending password confirmation email:", error);
    throw error;
  }
};
