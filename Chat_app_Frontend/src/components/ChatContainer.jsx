import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { CornerUpRight, Image as ImageIcon } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        <AnimatePresence>
          {messages.map((message) => {
            const isMe = message.senderId === authUser._id;
            const isImageMessage = !!message.image;

            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar (only shown for received messages) */}
                {!isMe && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg"
                  >
                    <img
                      src={selectedUser?.profilePic || "/avatar.png"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Message Bubble */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`relative rounded-2xl px-4 py-3 max-w-xs lg:max-w-md shadow-lg ${
                    isMe 
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                      : "bg-gray-800 text-white border border-gray-700"
                  }`}
                >
                  {/* Image attachment */}
                  {isImageMessage && (
                    <div className="mb-2 relative group">
                      <img
                        src={message.image}
                        alt="attachment"
                        className="rounded-lg w-full h-auto max-h-60 object-cover border border-gray-700"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                        <ImageIcon className="size-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Text content */}
                  {message.text && (
                    <p className={`${isImageMessage ? 'mt-2' : ''}`}>
                      {message.text}
                    </p>
                  )}

                  {/* Message metadata */}
                  <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    <span className="text-xs">
                      {formatMessageTime(message.createdAt)}
                    </span>
                    {isMe && (
                      <span className={message.read ? "text-blue-300" : "text-gray-400"}>
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Decorative corner */}
                  {!isMe && (
                    <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-gray-800 border-l border-b border-gray-700 transform rotate-45"></div>
                  )}
                </motion.div>

                {/* Avatar (only shown for sent messages) */}
                {isMe && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg"
                  >
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;