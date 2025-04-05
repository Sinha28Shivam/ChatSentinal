import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from "helmet";
import path from 'path';


import {connectDB} from './src/lib/db.js';

import authRoute from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js'
import { app, server } from './src/lib/socket.js';



dotenv.config();


// Constants
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();


app.use(helmet(
  {
    contentSecurityPolicy: false,
  }

));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
  origin: "http://localhost:5173",
  credentials: true
  })
);

// Routes
app.use("/api/v0/auth", authRoute);
app.use("/api/v0/messages", messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../Chat_app_Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Chat_app_Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log('Server is running on PORT:', `https://localhost:${PORT}`);
  connectDB();
});