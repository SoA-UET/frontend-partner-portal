import { useState } from 'react';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-surface border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
            size={18}
          />
          <input
            type="text"
            placeholder="Search customers, consultations, knowledge..."
            className="input pl-10 pr-4"
          />
        </div>
      </div>

      {/* Right Side - Notifications & User */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-button transition-colors">
          <Bell size={20} className="text-text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-button transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-text-main">{user?.full_name || 'User'}</p>
              <p className="text-xs text-text-muted">{user?.role || 'Staff'}</p>
            </div>
            <ChevronDown size={16} className="text-text-muted" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-button shadow-card border border-gray-200 py-2 z-20">
              <a href="#profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Hồ sơ cá nhân
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Cài đặt
              </a>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-status-error hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
