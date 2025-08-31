import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, ChevronRight, Wifi, WifiOff, Lock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const [showingNoKeyUsers, setShowingNoKeyUsers] = useState(false);
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : showingNoKeyUsers 
      ? users 
      : users.filter((user) => user.publicKey);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-20 lg:w-80 border-r border-base-300/50 flex flex-col bg-gradient-to-b from-base-100 to-base-200 transition-all duration-200 shadow-lg"
    >
      {/* Header */}
      <div className="border-b border-base-300/30 w-full p-5 bg-base-200/50">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2"
        >
          <Users className="size-6 text-primary" />
          <span className="font-medium hidden lg:block text-lg">Contacts</span>
        </motion.div>
        
        {/* Online filter toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 hidden lg:flex items-center gap-2"
        >
          <motion.label 
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-sm toggle-primary"
            />
            <span className="text-sm flex items-center gap-1">
              {showOnlineOnly ? (
                <Wifi className="size-4 text-green-500" />
              ) : (
                <WifiOff className="size-4 text-zinc-500" />
              )}
              Show online only
            </span>
          </motion.label>
          <span className="text-xs text-zinc-500 bg-base-300 px-2 py-1 rounded-full">
            {onlineUsers.length-1} online
          </span>
          <motion.label 
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer flex items-center gap-2 mt-2"
          >
            <input
              type="checkbox"
              checked={showingNoKeyUsers}
              onChange={(e) => setShowingNoKeyUsers(e.target.checked)}
              className="toggle toggle-xs toggle-warning"
            />
            <span className="text-xs flex items-center gap-1">
              {showingNoKeyUsers ? (
                <AlertTriangle className="size-3 text-amber-500" />
              ) : (
                <Lock className="size-3 text-green-500" />
              )}
              {showingNoKeyUsers ? "Show all users" : "Only secure users"}
            </span>
          </motion.label>
        </motion.div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3 space-y-1 px-2">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.button
              key={user._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (!user.publicKey) {
                  toast.error(
                    "This user hasn't set up secure messaging yet. They need to log out and log back in.",
                    { id: "missing-key-" + user._id, duration: 3000 }
                  );
                  
                  // Still select the user but warn about limitations
                  setSelectedUser(user);
                  
                  // Show a toast with additional info
                  setTimeout(() => {
                    toast("You can chat, but messages won't be encrypted", 
                      { icon: "⚠️", id: "encryption-warning-" + user._id, duration: 5000 }
                    );
                  }, 1000);
                } else {
                  setSelectedUser(user);
                }
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full p-3 flex items-center gap-3 rounded-lg
                hover:bg-base-300/50 transition-all
                ${selectedUser?._id === user._id ? 
                  "bg-primary/10 ring-1 ring-primary/20" : ""}
                ${!user.publicKey ? "opacity-70" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <motion.img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full border-2 border-base-300"
                  whileHover={{ scale: 1.05 }}
                />
                {onlineUsers.includes(user._id) ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-base-100"
                  />
                ) : (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 size-3 bg-zinc-500 
                    rounded-full ring-2 ring-base-100"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:flex flex-col text-left min-w-0 flex-1">
                <div className="font-medium truncate flex items-center justify-between">
                  <span>{user.fullName}</span>
                  <div className="flex items-center gap-1">
                    {user.publicKey ? (
                      <Lock className="size-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="size-3 text-amber-500" />
                    )}
                    <ChevronRight className="size-4 text-zinc-400" />
                  </div>
                </div>
                <div className="text-sm flex items-center gap-1">
                  <span className={`inline-block size-2 rounded-full ${onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-zinc-500'}`} />
                  <span className="text-zinc-400 flex items-center gap-1">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    {!user.publicKey && (
                      <span className="text-xs text-amber-500">(No encryption)</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-zinc-500 py-8 flex flex-col items-center"
          >
            <WifiOff className="size-8 mb-2 text-zinc-600" />
            <p>No online users</p>
            <p className="text-xs mt-1">Try disabling the online filter</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;