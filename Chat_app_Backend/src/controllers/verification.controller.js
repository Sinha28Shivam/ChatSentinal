import User from '../models/user.model.js';
import { generateVerificationToken } from '../lib/generateVerificationToken.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../lib/emailService.js';
import { generateToken } from '../lib/utils.js';

export const verifyEmail = async (req, res) => {
    const { userId, token, publicKey } = req.body;
    
    try {
        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        
        // Check if token exists and is valid
        if (!user.verificationToken || user.verificationToken !== token) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        
        // Check if token has expired
        if (user.verificationTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }
        
        // Mark user as verified and clear the token
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        
        // Save public key if provided
        if (publicKey) {
            user.publicKey = publicKey;
        }
        
        await user.save();
        
        // Send welcome email
        await sendWelcomeEmail(user.email, user.fullName);
        
        // Generate auth token
        await generateToken(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            publicKey: user.publicKey,
            isVerified: true,
            message: 'Email successfully verified'
        });
        
    } catch (error) {
        console.log('Error in verifyEmail:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        
        // Generate new token
        const verificationToken = generateVerificationToken();
        
        // Set expiry for token (30 minutes)
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setMinutes(verificationTokenExpiry.getMinutes() + 30);
        
        // Update user with new token and expiry
        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = verificationTokenExpiry;
        
        await user.save();
        
        // Send verification email
        await sendVerificationEmail(user.email, verificationToken, user.fullName);
        
        res.status(200).json({
            message: 'Verification email resent successfully'
        });
        
    } catch (error) {
        console.log('Error in resendVerificationEmail:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
