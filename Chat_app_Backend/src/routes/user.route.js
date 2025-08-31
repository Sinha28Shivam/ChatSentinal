import express from 'express';
import { getUserDetails, getUsersDetails, getUsersWithPublicKeys } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Special routes should come before dynamic parameter routes
// Get all users that have public keys
router.get('/with-public-keys', protectRoute, getUsersWithPublicKeys);

// Get a specific user with their public key
router.get('/:userId', protectRoute, getUserDetails);

// Get multiple users with their public keys
router.post('/batch', protectRoute, getUsersDetails);

export default router;
