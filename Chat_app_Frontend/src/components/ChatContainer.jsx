import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

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
      <div className="flex-1 flex flex-col bg-gray-900 text-white">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((message) => {
          const isMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
                <img
                  src={
                    isMe
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bubble */}
              <div
                className={`rounded-2xl px-4 py-2 max-w-xs shadow-md transform transition-all hover:scale-105 ${
                  isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="rounded-md mb-2 max-w-full"
                  />
                )}
                {message.text && <p>{message.text}</p>}
                <p className="text-xs mt-1 opacity-60">
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
