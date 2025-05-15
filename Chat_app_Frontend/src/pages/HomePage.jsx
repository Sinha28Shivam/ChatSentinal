import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

export const HomePage = () => {
  const { selectedUser } = useChatStore();
  
  return (
    <div className="h-screen pt-16 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 overflow-hidden">
      <div className="flex items-center justify-center h-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-100/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] border border-white/10 flex"
        >
          {/* Sidebar - fixed width */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full w-20 lg:w-80 flex-shrink-0"
          >
            <Sidebar />
          </motion.div>

          {/* Main content area - flexible */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/80 to-gray-800/80">
            <AnimatePresence mode="wait">
              {!selectedUser ? (
                <motion.div
                  key="no-chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <NoChatSelected />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <ChatContainer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"></div>
      </div>
    </div>
  ); 
}

export default HomePage;