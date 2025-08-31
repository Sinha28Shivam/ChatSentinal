import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import {
    generateAESKey,
    encryptAESKeyWithRSA,
    encryptWithAES,
    importRSAPrivateKey,
    decryptAESKeyWithRSA,
    decryptWithAES,
} from "../lib/encryption";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    iseUserLoading: false,
    isMessageLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            
            // Check for users without public keys and mark them
            const usersWithKeyStatus = res.data.map(user => ({
                ...user,
                hasPublicKey: !!user.publicKey
            }));
            
            set({ users: usersWithKeyStatus });

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
            console.log(error.response?.data?.message || error.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    
    setUsers: (users) => {
        set({ users });
    },

  getMessages: async (userId) => {
	set({ isMessageLoading: true });
	try {
		const res = await axiosInstance.get(`/messages/${userId}`);
		const fetchedMessages = res.data;

		const privateKeyPem = sessionStorage.getItem("privateKey");
		if (!privateKeyPem) {
			const messagesWithFallback = fetchedMessages.map(msg => 
				msg.isEncrypted ? { ...msg, text: "[Decryption key not found in session]" } : msg
			);
			set({ messages: messagesWithFallback });
			return;
		}

		const privateKey = await importRSAPrivateKey(privateKeyPem);

		const decryptedMessages = await Promise.all(
			fetchedMessages.map(async (message) => {
				if (message.isEncrypted && message.encryptedAesKey) {
					try {
						const aesKey = await decryptAESKeyWithRSA(message.encryptedAesKey, privateKey);
						const decryptedText = await decryptWithAES(message.text, aesKey, message.iv);
						return { ...message, text: decryptedText, isEncrypted: false };
					} catch (error) {
						console.error("Failed to decrypt historical message:", message._id, error);
						return { ...message, text: "[Message could not be decrypted]" };
					}
				}
				return message;
			})
		);

		set({ messages: decryptedMessages });
	} catch (error) {
		toast.error(error.response?.data?.message || "Failed to fetch messages.");
		console.error("Error in getMessages:", error);
	} finally {
		set({ isMessageLoading: false });
	}
},
    
// src/store/useChatStore.js

sendMessage: async (plainText) => {
	const { selectedUser, messages, users } = get();
	const socket = useAuthStore.getState().socket;

	try {
		if (!selectedUser) throw new Error("No chat selected.");

		const userRes = await axiosInstance.get(`/users/${selectedUser._id}`);
		const freshPublicKey = userRes.data?.publicKey;

		const updatedUsers = users.map(u => 
			u._id === selectedUser._id ? { ...u, publicKey: freshPublicKey } : u
		);
		set({ users: updatedUsers, selectedUser: { ...selectedUser, publicKey: freshPublicKey } });

		let payload;
		if (!freshPublicKey) {
			console.warn("Sending unencrypted message.");
			payload = { text: plainText };
		} else {
			const aesKey = await generateAESKey();
			const iv = window.crypto.getRandomValues(new Uint8Array(12));
			const encryptedMessage = await encryptWithAES(plainText, aesKey, iv);
			const encryptedAesKey = await encryptAESKeyWithRSA(aesKey, freshPublicKey);
			const ivBase64 = Buffer.from(iv).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
			payload = { encryptedMessage, encryptedAesKey, iv: ivBase64 };
		}

		const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
		
		// FIX: Update UI with the plain text version of the sent message
		const sentMessage = {
			...res.data,
			text: plainText,
			isEncrypted: false,
		};
		set({ messages: [...messages, sentMessage] });

		if (socket) {
			socket.emit("chat-message", { to: selectedUser._id, ...payload });
		}
	} catch (error) {
		toast.error("Failed to send message.");
		console.error("Error sending message:", error);
	}
},


    // src/store/useChatStore.js

subscribeToMessages: () => {
	const socket = useAuthStore.getState().socket;
	if (!socket) return;

	socket.on("receiveMessage", async (newMessage) => {
		const { selectedUser } = get();
		// console.log("Received message via socket:", newMessage);
		
		if (newMessage.senderId !== selectedUser?._id) return;

		if (newMessage.isEncrypted) {
			try {
				const privateKeyPem = sessionStorage.getItem("privateKey");
				if (!privateKeyPem) {
					throw new Error("Your private key is not available in this session. Please log in again.");
				}

				const privateKey = await importRSAPrivateKey(privateKeyPem);
				const aesKey = await decryptAESKeyWithRSA(newMessage.encryptedAesKey, privateKey);
				const decryptedText = await decryptWithAES(newMessage.text, aesKey, newMessage.iv);
				
				newMessage.text = decryptedText;
				newMessage.isEncrypted = false; 
			} catch (error) {
				console.error("Failed to decrypt message:", error);
				newMessage.text = "[Message could not be decrypted]";
				// Optionally notify the user about the failure
				toast.error("Failed to decrypt a message.", { id: `decryption-error-${newMessage._id}` });
			}
		}
		
		set({ messages: [...get().messages, newMessage] });
	});
},

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        // Update to use the correct event name
        socket.off("receiveMessage");
    },

    
    setSelectedUser: (selectedUser) => set({ selectedUser }),

}));
