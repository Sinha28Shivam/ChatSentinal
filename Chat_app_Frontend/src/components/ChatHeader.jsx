import { X, RefreshCw, Lock, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { usePublicKeyManager } from "../hooks/usePublicKeyManager";
import toast from "react-hot-toast";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, getUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { fetchUserPublicKey } = usePublicKeyManager();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshPublicKey = async () => {
    try {
      setIsRefreshing(true);
      toast.loading("Checking for encryption keys...", { id: "refresh-key" });
      
      // First try to get the user's details directly
      const publicKey = await fetchUserPublicKey(selectedUser._id);
      
      if (publicKey) {
        // Success! We found a public key
        await getUsers(); // Refresh the entire user list
        toast.success("Encryption keys found and updated!", { id: "refresh-key" });
      } else {
        // No key found - let the user know this person hasn't set up encryption
        toast.error(
          "This user hasn't set up encryption keys yet. They need to log in to complete setup.", 
          { id: "refresh-key", duration: 5000 }
        );
        
        // Still refresh the users list in case something else changed
        await getUsers();
      }
    } catch (error) {
      console.error("Error refreshing keys:", error);
      toast.error(`Failed to refresh keys: ${error.message || "Unknown error"}`, { id: "refresh-key" });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium flex items-center gap-2">
              {selectedUser.fullName}
              {selectedUser.publicKey ? (
                <Lock className="size-3 text-green-500" title="End-to-end encrypted" />
              ) : (
                <AlertTriangle className="size-3 text-amber-500" title="Not encrypted" />
              )}
            </h3>
            <p className="text-sm text-base-content/70 flex items-center gap-2">
              <span>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</span>
              
              {!selectedUser.publicKey && (
                <span className="text-xs text-amber-500">(Not encrypted)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh encryption key button */}
          {!selectedUser.publicKey && (
            <>
              <button 
                onClick={refreshPublicKey}
                disabled={isRefreshing}
                className="btn btn-xs btn-outline btn-warning"
                title="Try to refresh encryption keys"
              >
                <RefreshCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Keys
              </button>
              <button
                onClick={() => {
                  toast.success("Encryption notice sent to user", { id: "encryption-notice" });
                  toast("They'll be prompted to log out and back in", { id: "encryption-notice-2", duration: 4000 });
                }}
                className="btn btn-xs btn-outline btn-info"
                title="Notify this user they need to set up encryption"
              >
                Notify User
              </button>
            </>
          )}
          
          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;