import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

import { io } from "socket.io-client";
import { use } from "react";

const BASE_URL = import.meta.env.MODE == "development" ? "http://localhost:3002" : "https://chatsentinal.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isDeletingAccount: false,

  checkAuth: async () => {
    try{
        const res = await axiosInstance.get("/auth/check");
        set({authUser: res.data});
        get().connectSocket();

    }catch(error){
        console.log("Error in checking Auth", error);
        set({authUser: null});

    }finally{
        set({isCheckingAuth: false});
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // With email verification, user isn't automatically logged in
      // We should show a message to check email instead
      toast.success(res.data.message || "Account created successfully! Please check your email for verification.");
      console.log(res.data);
      // Don't connect socket or set authUser here since we need verification first
      return {
        success: true,
        userId: res.data._id
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Signup error:", error);
      return { success: false };
    }finally{
        set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true});
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      // Check if email is verified
      if (res.data.isVerified === false) {
        toast.error("Please verify your email before logging in");
        // Return userId so it can be used for verification or resending verification email
        return { verified: false, userId: res.data.userId };
      }
      
      set({ authUser: res.data});
      toast.success("Logged in successfully!");
      get().connectSocket();
      return { verified: true };

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Login error:", error);
      return { error: true };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      // console.log("Logged out successfully!");
      get().disconnectSocket();
      
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
       console.log("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
      // console.log("Error in updating profile", error);
      
    }finally{
      set({ isUpdatingProfile: false });
    }
  },

  DeleteAccount: async () => {
    set({ isDeletingAccount: true });
    try {
      await axiosInstance.delete("/auth/delete-account");
      set({ authUser: null });
      toast.success("Account deleted successfully!");
      console.log("Account deleted successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
      console.log("Error in deleting account", error);
    }
    finally{
      set({ isDeletingAccount: false });
    }
    

  },

  connectSocket: () => {
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;
    console.log("Connecting to socket...");
    
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect(); 
    set({ socket: socket });

    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });

    });

  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
  
  verifyEmail: async (userId, token, publicKey) => {
    try {
      const res = await axiosInstance.post("/auth/verify-email", { userId, token, publicKey });
      set({ authUser: res.data });
      toast.success("Email verified successfully!");
      get().connectSocket();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
      console.error("Verification error:", error);
      return false;
    }
  },

  resendVerification: async (userId) => {
    try {
      await axiosInstance.post("/auth/resend-verification", { userId });
      toast.success("Verification email resent successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend verification email.");
      console.error("Resend verification error:", error);
      return false;
    }
  }

}));