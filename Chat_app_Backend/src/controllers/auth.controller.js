import { generateToken } from '../lib/utils.js';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js"
import { getRedisClient } from "../redisClient/redisClient.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }  

        const user = await User.findOne({ email })
        if(user){ 
            return res.status(400).json({message: 'Email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        await newUser.save();
        await generateToken(newUser._id, res);

        if(newUser){
            // Generate token
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            return res.status(400).json({message: 'Invalid user data'});
        }

    } catch (error) {
        console.log("error in signup", error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isPassword = await bcrypt.compare(password, user.password)
        if(!isPassword){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        await generateToken(user._id, res); // changes, now async

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

export const logout = async (req, res) => {    
    try {
        const token = req.cookies.jwt;
        // const userId = req.user._id;

        if(!token){
         return res.status(400).json({message: 'No token found'});   
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

     
            const RedisClient = await getRedisClient();
            await RedisClient.del(`tokens:${userId}`);
 
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development'
        });
        
        res.status(200).json({message: 'Logged out successfully'});
          
    } catch (error) {
        console.log("error in logout", error.message);
        res.status(500).json({message: 'Server Error'});
        
    }
};


// This will update the user profile
export const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({ message: "Profile pic is required" });
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url },
            { new: true} 
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
};

export const checkAuth = (req, res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export const deleteAccount = async(req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }
        await User.findByIdAndDelete(userId)
        res.clearCookie("jwt")
        res.status(200).json({message: 'Account deleted successfully'});
        
    } catch (error) {
        console.log("Error in delete account", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}