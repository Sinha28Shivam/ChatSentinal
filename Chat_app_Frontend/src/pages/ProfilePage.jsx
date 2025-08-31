
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, CheckCircle, Shield, RefreshCw, Lock } from "lucide-react";
import AvatarSection from "../components/skeletons/avatar";
import { usePublicKeyManager } from "../hooks/usePublicKeyManager";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isRegeneratingKeys, setIsRegeneratingKeys] = useState(false);
  const { regenerateAndUpdateKeys } = usePublicKeyManager();

  // ✅ Upload Image Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // ✅ Reset to Default Avatar
  const handleResetToDefault = async () => {
    setSelectedImg(null); // Optional: reset local preview
    await updateProfile({ profilePic: null }); // Or "/avatar.png" based on your backend
  };
  
  // Handle regenerating encryption keys
  const handleRegenerateKeys = async () => {
    try {
      setIsRegeneratingKeys(true);
      toast.loading("Regenerating encryption keys...", { id: "regen-keys" });
      
      const success = await regenerateAndUpdateKeys();
      
      if (success) {
        toast.success("Encryption keys regenerated successfully!", { id: "regen-keys" });
      } else {
        toast.error("Failed to regenerate encryption keys", { id: "regen-keys" });
      }
    } catch (error) {
      console.error("Error regenerating keys:", error);
      toast.error("An error occurred while regenerating keys", { id: "regen-keys" });
    } finally {
      setIsRegeneratingKeys(false);
    }
  };

return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center"
  >
    <div className="max-w-sm w-full px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 space-y-5 border border-white/10 shadow-xl"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-sm mt-1 text-white/70">Manage your account info</p>
        </div>

        {/* Avatar */}
        <AvatarSection 
          image={selectedImg || authUser.profilePic}
          onImageChange={handleImageUpload}
          onResetDefault={handleResetToDefault}
          isUploading={isUpdatingProfile}
        />

        {/* Profile Info */}
        <div className="space-y-3">
          <div>
            <div className="text-sm text-white/70 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              Full Name
            </div>
            <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white text-sm">{authUser?.fullName}</p>
            </div>
          </div>

          <div>
            <div className="text-sm text-white/70 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Email
            </div>
            <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white text-sm">{authUser?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Encryption Section */}
        <div>
          <div className="text-sm text-white/70 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Encryption
          </div>
          <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <p className="text-white text-sm">End-to-End Encryption</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${authUser?.publicKey ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {authUser?.publicKey ? 'Active' : 'Not Setup'}
                </span>
              </div>
              <button 
                className="btn btn-sm btn-outline btn-accent w-full mt-2"
                onClick={handleRegenerateKeys}
                disabled={isRegeneratingKeys}
              >
                <RefreshCw className={`w-4 h-4 ${isRegeneratingKeys ? 'animate-spin' : ''}`} />
                Regenerate Encryption Keys
              </button>
              <p className="text-xs text-white/50 mt-1">
                Regenerating keys will reset your encryption. Only do this if you're experiencing issues.
              </p>
            </div>
          </div>
        </div>

        {/* Inline Footer Info */}
        <div className="flex items-center justify-between text-xs text-white/70 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Member Since:{" "}
            <span className="text-white">
              {new Date(authUser.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle className="w-4 h-4" />
            Active
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);


};

export default ProfilePage;
