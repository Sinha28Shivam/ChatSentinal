import User from '../models/user.model.js';

// Get a specific user's details including their public key
export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log(`Getting details for user: ${userId}`);
        const user = await User.findById(userId).select('_id fullName username profilePic publicKey');
        
        if (!user) {
            console.log(`User not found with ID: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }

        // Log if public key is missing
        if (!user.publicKey) {
            console.log(`User ${userId} (${user.fullName}) does not have a public key`);
        } else {
            console.log(`Found public key for user ${userId} (${user.fullName})`);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get multiple users' details with their public keys
export const getUsersDetails = async (req, res) => {
    try {
        const { userIds } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "User IDs are required" });
        }

        const users = await User.find({ _id: { $in: userIds } })
            .select('_id fullName username profilePic publicKey');
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all users with public keys
export const getUsersWithPublicKeys = async (req, res) => {
    try {
        const users = await User.find({ publicKey: { $exists: true, $ne: null } })
            .select('_id fullName username profilePic');
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersWithPublicKeys:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
