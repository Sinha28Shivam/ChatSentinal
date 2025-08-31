import { useRef } from "react";
import { Camera, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function AvatarSection({
  image,
  onImageChange,
  onResetDefault,
  isUploading = false,
}) {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div whileHover={{ scale: 1.03 }} className="relative group">
        <img
          src={image || "/avatar.png"}
          alt="Profile"
          className="size-32 rounded-full object-cover border-4 border-white/20 shadow-lg group-hover:border-purple-400/50 transition-all duration-300"
        />

        {/* Upload Button */}
        <button
          onClick={handleClick}
          disabled={isUploading}
          className={`
            absolute -bottom-2 -right-2 
            bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700
            p-2 rounded-full cursor-pointer shadow-lg
            transition-all duration-300
            ${isUploading ? "animate-pulse" : ""}
          `}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
          disabled={isUploading}
        />
      </motion.div>

      {/* Info & Reset Option */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-white/60">
          {isUploading ? (
            <motion.span 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Uploading your photo...
            </motion.span>
          ) : (
            "Click the camera to upload a profile photo"
          )}
        </p>

        {/* Reset Button */}
        <button
          onClick={onResetDefault}
          disabled={isUploading}
          className="text-xs text-purple-300 hover:text-purple-500 mt-1 flex items-center gap-1"
        >
          <RefreshCcw className="w-3 h-3" />
          Use Default Avatar
        </button>
      </div>
    </div>
  );
}
