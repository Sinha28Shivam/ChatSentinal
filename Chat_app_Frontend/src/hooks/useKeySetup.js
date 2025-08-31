// src/hooks/useKeySetup.js
import { generateRSAKeyPair, exportPublicKeyToPEM, exportPrivateKeyToPEM } from "../utils/rsaUtils";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export function useKeySetup() {
  const { authUser } = useAuthStore();

  useEffect(() => {
    async function initKeys() {
      try {
        // Check if we already have keys for this session
        const existingPrivateKey = sessionStorage.getItem("privateKey");
        if (existingPrivateKey && authUser) {
          console.log("Keys already initialized");
          return;
        }

        // Generate new key pair
        const keyPair = await generateRSAKeyPair();
        const publicKey = await exportPublicKeyToPEM(keyPair.publicKey);
        const privateKey = await exportPrivateKeyToPEM(keyPair.privateKey);

        // Save keys
        sessionStorage.setItem("privateKey", privateKey);
        sessionStorage.setItem("publicKey", publicKey);

        console.log("RSA keys generated successfully");
        
        // If user is authenticated, update their public key in the backend
        if (authUser) {
          try {
            await axiosInstance.post("/auth/update-public-key", { publicKey });
            console.log("Public key updated in backend");
          } catch (error) {
            console.error("Failed to update public key:", error);
          }
        }
      } catch (error) {
        console.error("Error generating RSA keys:", error);
        toast.error("Failed to set up encryption. Some features may not work.");
      }
    }

    initKeys();
  }, [authUser]); // Re-run when authUser changes
}
