import express from 'express';
import { login, signup, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// user signup route
router.post('/signup', signup);


// user login route
router.post('/login', login);


// user logout route
router.post('/logout', logout); 

// user Update profile
router.put('/update-profile', protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth);

export default router;