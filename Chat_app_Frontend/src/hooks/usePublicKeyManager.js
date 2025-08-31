// src/hooks/usePublicKeyManager.js
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { exportPublicKeyToPEM, generateRSAKeyPair, exportPrivateKeyToPEM } from "../utils/rsaUtils";

export function usePublicKeyManager() {
  const { setUsers } = useChatStore();

  // Function to regenerate keys and update them on the server
  async function regenerateAndUpdateKeys() {
    try {
      // Generate new key pair
      const keyPair = await generateRSAKeyPair();
      const publicKey = await exportPublicKeyToPEM(keyPair.publicKey);
      const privateKey = await exportPrivateKeyToPEM(keyPair.privateKey);

      // Save keys
      sessionStorage.setItem("privateKey", privateKey);
      sessionStorage.setItem("publicKey", publicKey);
      
      // Update on server
      await axiosInstance.post("/auth/update-public-key", { publicKey });
      toast.success("Encryption keys regenerated successfully");
      return true;
    } catch (error) {
      console.error("Failed to regenerate keys:", error);
      toast.error("Failed to regenerate encryption keys");
      return false;
    }
  }

  // Function to fetch a user's public key
  async function fetchUserPublicKey(userId) {
    try {
      console.log(`Fetching public key for user ${userId}`);
      const response = await axiosInstance.get(`/users/${userId}`);
      
      if (!response.data || !response.data.publicKey) {
        console.warn(`No public key found for user ${userId}:`, response.data);
        return null;
      }
      
      console.log(`Successfully retrieved public key for user ${userId}`);
      return response.data.publicKey;
    } catch (error) {
      console.error(`Failed to fetch public key for user ${userId}:`, error);
      return null;
    }
  }

  // Function to refresh users list with updated public keys
  async function refreshUsersWithPublicKeys() {
    try {
      const response = await axiosInstance.get("/messages/users");
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh users:", error);
      return null;
    }
  }

  return {
    regenerateAndUpdateKeys,
    fetchUserPublicKey,
    refreshUsersWithPublicKeys
  };
}
