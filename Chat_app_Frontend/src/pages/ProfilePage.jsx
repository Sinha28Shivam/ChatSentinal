import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10"
    >
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 space-y-8 border border-white/10 shadow-xl"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="mt-2 text-white/70">Manage your account information</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="relative group"
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-white/20 shadow-lg group-hover:border-purple-400/50 transition-all duration-300"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute -bottom-2 -right-2 
                  bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700
                  p-2 rounded-full cursor-pointer shadow-lg
                  transition-all duration-300
                  ${isUpdatingProfile ? "animate-pulse" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </motion.div>
            <p className="text-sm text-white/60">
              {isUpdatingProfile ? (
                <motion.span 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Uploading your photo...
                </motion.span>
              ) : (
                "Click the camera to update your profile photo"
              )}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            <motion.div 
              whileHover={{ x: 5 }}
              className="space-y-2"
            >
              <div className="text-sm text-white/70 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Full Name
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-white">{authUser?.fullName}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="space-y-2"
            >
              <div className="text-sm text-white/70 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email Address
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-white">{authUser?.email}</p>
              </div>
            </motion.div>
          </div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Account Details
              </span>
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Member Since</span>
                </div>
                <span className="text-white">
                  {new Date(authUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-white/70">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Account Status</span>
                </div>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Active
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;