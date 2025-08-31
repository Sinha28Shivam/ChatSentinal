import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    
    if (result && result.verified === false && result.userId) {
      // Redirect to verification page with userId
      navigate('/verify-email', { state: { userId: result.userId } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-white/60">Login to continue chatting</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="peer w-full bg-white/10 text-white border border-white/30 rounded-xl pt-6 pb-2 px-10 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/60 transition-all"
              placeholder="Email"
              required
            />
            <Mail className="absolute left-3 top-1/2 text-white/40 peer-placeholder-shown:translate-y-0 -translate-y-3 transition-transform" />
            <label
              htmlFor="email"
              className="absolute left-10 top-2 text-white/60 text-xs transition-all 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-0"
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
              className="peer w-full bg-white/10 text-white border border-white/30 rounded-xl pt-6 pb-2 px-10 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/60 transition-all"
              placeholder="Password"
              required
            />
            <Lock className="absolute left-3 top-1/2 text-white/40 peer-placeholder-shown:translate-y-0 -translate-y-3 transition-transform" />
            <label
              htmlFor="password"
              className="absolute left-10 top-2 text-white/60 text-xs transition-all 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-0"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-white/40 peer-placeholder-shown:translate-y-0 -translate-y-3 transition-transform"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-white/90 transition flex justify-center items-center gap-2"
          >
            {isLoggingIn ? <><Loader2 className="animate-spin h-5 w-5" /> Logging In...</> : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-white/70 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="underline text-white hover:text-white/90">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;