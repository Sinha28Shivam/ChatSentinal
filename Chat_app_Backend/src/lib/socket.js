// src/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io =  new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}   


// used to store the online users or sockets id u
const userSocketMap = {}; //{userId: socketId}


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    // io.emit to use to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("chat-message", async (data) => {
        try{
            const {
                to,
                encryptedMessage,
                encryptedAesKey,
                iv,
                image,
                text
            } = data;
            
            if(!userId || !to) {
                console.error("Missing required fields for message: userId or recipient");
                return;
            }

            // Determine if this is an encrypted or plain message
            const isEncrypted = !!encryptedMessage;
            const messageContent = encryptedMessage || text || "";
            
            if (isEncrypted && (!encryptedAesKey || !iv)) {
                console.error("Missing required fields for encrypted message");
                return;
            }
            
            if (!isEncrypted && !messageContent) {
                console.error("Missing message content for unencrypted message");
                return;
            }
            
            console.log(`Received ${isEncrypted ? 'encrypted' : 'unencrypted'} message via socket`);

            // Create a new message
            const newMessage = await Message.create({
                senderId: userId,
                receiverId: to,
                text: messageContent,
                isEncrypted,
                encryptedAesKey,
                iv,
                image
            });

            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                // FIX: Send the complete 'newMessage' object that was saved to the DB
                io.to(receiverSocketId).emit("receiveMessage", newMessage);
            } else {
                console.log(`User ${to} is not online`);
            }
        }catch (error) {
            console.error("Error handling message:", error);
        }
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        // Remove the user from the userSocketMap
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

});

export { io, app, server };