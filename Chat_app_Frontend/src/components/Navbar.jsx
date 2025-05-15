import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">ChatSentinel</h1>
        </Link>

        {/* Nav Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/settings"
            className="text-white hover:text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="text-white hover:text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;