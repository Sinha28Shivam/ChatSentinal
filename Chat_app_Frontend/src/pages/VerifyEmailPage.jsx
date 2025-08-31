import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { verifyEmail, resendVerification } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      toast.error('Something went wrong. Please try logging in again.');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      return toast.error('Please enter the verification code');
    }
    
    // Get the public key from session storage
    const publicKey = sessionStorage.getItem("publicKey");
    
    setIsSubmitting(true);
    const success = await verifyEmail(userId, verificationCode, publicKey);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/');
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    await resendVerification(userId);
    setIsResending(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-white">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="text-sm text-white/70 mt-2">
            We've sent a verification code to your email address.
            <br />Please enter the 6-digit code below to verify your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label
              htmlFor="verificationCode"
              className="text-white/70 text-sm mb-2 self-start"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
              className="text-center tracking-widest text-2xl font-semibold w-full bg-white/10 border border-white/30 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all"
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <p className="text-xs text-white/60 mt-2">Enter the 6-digit verification code sent to your email</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-5" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-white/70 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-white underline hover:text-blue-200 text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="animate-spin size-4 inline mr-1" />
                Resending...
              </>
            ) : (
              'Resend Code'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
