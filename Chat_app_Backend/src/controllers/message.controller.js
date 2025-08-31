import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        // Make sure we include the public key in the returned data
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("_id username fullName profilePic publicKey isVerified");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getMessages = async(req, res) => {
    try {
        const { id:userToChatId} = req.params
        const myId = req.user._id;
        
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { encryptedMessage, encryptedAesKey, iv, image, text } = req.body;
    
    console.log("Received message request:", {
      senderId,
      receiverId,
      hasEncryptedMessage: !!encryptedMessage,
      hasPlainText: !!text,
      hasImage: !!image
    });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Handle both encrypted and plain text messages
    const messageContent = encryptedMessage || text || "";
    const isEncrypted = !!encryptedMessage;
    
    const newMessage = new Message({
      senderId,
      receiverId,
      text: messageContent,            // can be encrypted or plain text
      isEncrypted,                     // flag to indicate if message is encrypted
      image: imageUrl,
      encryptedAesKey,                 // only present for encrypted messages
      iv                               // only present for encrypted messages
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log(`Emitting message to socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


