import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../application/use-cases/LoginUser';
import { AuthRepositoryImpl } from '../infrastructure/repositories/AuthRepositoryImpl';
import { useAuth } from '../contexts/AuthContext';
import CONFIG from '../config';

const Login = () => {
  const loginHero = '/assets/backgroynd_login.png';
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize use case
  const authRepository = new AuthRepositoryImpl(CONFIG.API_BASE_URL);
  const loginUserUseCase = new LoginUser(authRepository);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginUserUseCase.execute(email, password);
      
      // Use AuthContext to login
      login(result.user, result.token);
      
      // Store remember me preference if checked
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('remember_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Illustration & Quote */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#1e4db7] to-[#0a1f5c] p-12 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Decorative Background Element (matching the image's lighter blue area) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg flex flex-col items-center gap-12"
        >
          {/* Main Illustration Area */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            <img
              src={loginHero}
              alt="Login Illustration"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <p className="text-white text-2xl md:text-3xl font-medium text-center leading-normal max-w-md">
            "Access your account and manage everything with ease."
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form Content */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          {/* Header Section - Centered as per image */}
          <div className="mb-14 text-center">
            <h1 className="text-4xl md:text-[2.75rem] font-bold text-[#2d346b] mb-4 tracking-tight">
              Welcome to Laporkan!
            </h1>
            <p className="text-[#6b7280] text-xl font-medium">
              Let's get started! Sign in and explore.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignIn} className="w-full space-y-7">
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#374151] ml-1">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-xl border border-[#e5e7eb] focus:border-[#2b59ac] focus:ring-4 focus:ring-[#2b59ac]/5 outline-none transition-all placeholder:text-[#9ca3af] text-lg disabled:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-2.5 relative">
              <label className="text-sm font-bold text-[#374151] ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-6 py-4 rounded-xl border border-[#e5e7eb] focus:border-[#2b59ac] focus:ring-4 focus:ring-[#2b59ac]/5 outline-none transition-all placeholder:text-[#9ca3af] text-lg pr-14 disabled:bg-gray-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                />
                <div className={`w-5 h-5 rounded border ${rememberMe ? 'bg-[#2b59ac] border-[#2b59ac]' : 'bg-white border-[#d1d5db]'} flex items-center justify-center transition-all`}>
                  {rememberMe && <Check size={14} className="text-white stroke-[3]" />}
                </div>
                <span className="text-sm font-semibold text-[#1e40af]">Remember me</span>
              </label>

              <a href="#" className="text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1d4ed8] text-white py-4.5 rounded-xl font-bold text-lg hover:bg-[#1e40af] hover:shadow-2xl hover:shadow-blue-600/20 transition-all active:scale-[0.99] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Centered */}
          <p className="mt-14 text-center text-[#4b5563] text-lg">
            Are you new? <a onClick={() => navigate('/register')} className="text-[#3b82f6] font-bold hover:underline ml-1 cursor-pointer">Create an Account</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
