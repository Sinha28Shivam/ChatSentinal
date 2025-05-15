import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Mail, Lock, User, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SignUpPages = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
    if (!formData.password || formData.password.length < 6)
      return toast.error('Password must be at least 6 characters');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-white"
      >
        <div className="mb-6 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm text-white/70 mt-2">
            Join and explore a new way to chat with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
          <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="peer w-full bg-transparent border-b border-white/40 text-white placeholder-transparent focus:outline-none focus:border-white transition-all pt-6 pb-2"
              placeholder="Full Name"
            />
            <label
              htmlFor="fullName"
              className="absolute left-0 top-1.5 text-white/70 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-white"
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               className="peer w-full bg-transparent border-b border-white/40 text-white placeholder-transparent focus:outline-none focus:border-white transition-all pt-6 pb-2"
              placeholder="you@example.com"
            />
            <label
              htmlFor="email"
              className="absolute left-0 text-sm text-white/60 top-2.5 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-white"
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
               className="peer w-full bg-transparent border-b border-white/40 text-white placeholder-transparent focus:outline-none focus:border-white transition-all pt-6 pb-2"
              placeholder="••••••"
            />
            <label
              htmlFor="password"
              className="absolute left-0 text-sm text-white/60 top-2.5 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-white"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-0 top-2.5 text-white/60 hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="animate-spin size-5" />
                Creating...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        {/* Link */}
        <div className="text-center mt-6 text-sm text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="text-white underline hover:text-blue-200">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPages;
