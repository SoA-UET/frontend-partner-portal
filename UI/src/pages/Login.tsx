import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      // Navigate to dashboard on successful login
      navigate('/');
    } catch (err: any) {
      setLoginAttempts((prev) => prev + 1);
      
      // Handle specific error codes from API
      if (err.response?.data?.error_code === 'INVALID_CREDENTIALS') {
        setError('Sai tên đăng nhập hoặc mật khẩu');
      } else if (err.response?.data?.error_code === 'ACCOUNT_LOCKED') {
        setError('Tài khoản bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau 30 phút.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    alert('Chức năng "Quên mật khẩu" sẽ được triển khai sau');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-card mb-4">
            <span className="text-3xl text-white font-bold">TC</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main">TelCenter</h1>
          <p className="text-text-muted mt-2">Partner Portal</p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text-main mb-6">Đăng nhập</h2>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-button flex items-start gap-2">
              <AlertCircle className="text-status-error flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm text-status-error">{error}</p>
                {loginAttempts >= 3 && loginAttempts < 5 && (
                  <p className="text-xs text-status-error mt-1">
                    Cảnh báo: Tài khoản sẽ bị khóa sau {5 - loginAttempts} lần thử không thành công.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-main mb-1">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Nhập tên đăng nhập"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-main"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          © 2025 TelCenter. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
