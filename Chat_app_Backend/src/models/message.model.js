import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Message text (can be encrypted or plain)
    text: {
      type: String,
      required: true
    },
    
    // Flag to indicate if the message is encrypted
    isEncrypted: {
      type: Boolean,
      default: false
    },

    // AES key encrypted with receiver's RSA public key (base64 string)
    encryptedAesKey: {
      type: String,
      required: false
    },

    // AES IV (base64 string)
    iv: {
      type: String,
      required: false
    },

    // Optional image/file URL (encrypted or not)
    image: {
      type: String
    }
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
