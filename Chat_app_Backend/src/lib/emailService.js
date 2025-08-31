import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send a verification email to the user
 * @param {string} to - Recipient's email address
 * @param {string} token - Verification token
 * @param {string} userName - User's full name
 */
export const sendVerificationEmail = async (to, token, userName) => {
    try {
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Chat Sentinel - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Chat Sentinel Email Verification</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for registering with Chat Sentinel. Please verify your email address to complete your registration.</p>
                    <p>Your verification code is:</p>
                    <div style="text-align: center; padding: 15px; background-color: #f5f5f5; border-radius: 5px; margin: 20px 0; font-size: 24px; font-weight: bold;">
                        ${token}
                    </div>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Best regards,<br>Chat Sentinel Team</p>
                </div>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send a welcome email after successful verification
 * @param {string} to - Recipient's email address
 * @param {string} userName - User's full name
 */
export const sendWelcomeEmail = async (to, userName) => {
    try {
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Welcome to Chat Sentinel!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Welcome to Chat Sentinel!</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for verifying your email address. Your account is now active, and you can start using Chat Sentinel.</p>
                    <p>Enjoy secure and private conversations with your friends and colleagues.</p>
                    <p>Best regards,<br>Chat Sentinel Team</p>
                </div>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};
