import express from 'express';
import { login, signup, logout, updateProfile, checkAuth, deleteAccount, updatePublicKey } from '../controllers/auth.controller.js';
import { verifyEmail, resendVerificationEmail } from '../controllers/verification.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// user signup route
router.post('/signup', signup);

// user login route
router.post('/login', login);

// user logout route
router.post('/logout', protectRoute, logout); 

// user Update profile
router.put('/update-profile', protectRoute, updateProfile);

// update public key
router.post('/update-public-key', protectRoute, updatePublicKey);

router.get("/check", protectRoute, checkAuth);

// delete account route
router.delete('/delete-account', protectRoute, deleteAccount);

// email verification routes
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

export default router;