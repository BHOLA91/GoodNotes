import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function Login({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        return;
      }

      // Save token and user details to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // If "Remember Me" is checked, save a flag or email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      console.log('Logged in successfully:', data.user);
      
      // Redirect to homepage or user dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to server. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans relative flex flex-col justify-between overflow-hidden">
      
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/80 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-950/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 cursor-pointer border border-neutral-200/50 dark:hover:border-neutral-800/50 relative overflow-hidden active:scale-90 shadow-sm"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
          ) : (
            <Moon className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
          )}
        </button>
      </div>

      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-3xl pointer-events-none animate-glow" style={{ animationDelay: '-5s' }} />

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 relative z-10">
        
        {/* Left Side: Galaxy Orb Swirl (Visible on Large Screens) */}
        <div className="hidden lg:flex lg:col-span-5 justify-center items-center h-full relative pr-8">
          
        </div>

        {/* Right Side: Login Form */}
        <div className="col-span-1 lg:col-span-7 flex  items-center lg:items-start justify-center">
          
          <div className="w-full max-w-[440px] flex flex-col">
            
            

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading mb-8 leading-tight text-center lg:text-left">
              Welcome back to your<br />workspace.
            </h1>

            {/* Login Card */}
            <div className="w-full bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border border-neutral-250 dark:border-neutral-900 p-8 rounded-2xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up">
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs px-4 py-2.5 rounded-lg text-center font-medium">
                    {error}
                  </div>
                )}

               
                <div>
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-neutral-50/50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">
                      Password
                    </label>
                    <Link 
                      to="/recovery" 
                      className="text-xs text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors font-semibold"
                    >
                      Forgot?
                    </Link>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-neutral-50/50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 text-neutral-900 dark:text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <label className="relative flex items-center cursor-pointer select-none text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2.5 rounded border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-[#161616] text-indigo-650 focus:ring-indigo-500/40 focus:ring-offset-0 w-4.5 h-4.5 cursor-pointer accent-indigo-650"
                    />
                    Remember me for 30 days
                  </label>
                </div>

                {/* Login Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-lg font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 text-sm hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 text-[10px] tracking-wider text-neutral-400 dark:text-neutral-650 font-bold my-6 w-full select-none">
                <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-900" />
                <span>OR</span>
                <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-900" />
              </div>

              
              <div className="space-y-3">
               
                <button
                  type="button"
                  className="w-full py-2.5 bg-neutral-55 hover:bg-neutral-100 dark:bg-[#161616] dark:hover:bg-[#1f1f1f] border border-neutral-250 dark:border-neutral-800/80 rounded-lg text-sm font-semibold flex items-center justify-center gap-3 text-neutral-800 dark:text-neutral-200 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {/* Google SVG Icon */}
                  <span> 
                    <img src="/google-logo.png" alt="logo"  className="h-[20px] w-auto" />
                  </span>
                  Continue with Google
                </button>

                {/* Apple Button */}
              </div>

            </div>

            {/* Bottom Footer Signup text */}
            <div className="text-sm text-neutral-500 mt-6 text-center">
              Don't have an account?{' '}
              <Link 
                to="/get-started" 
                className="font-semibold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </div>

          </div>

        </div>

      </div>

      

    </div>
  );
}
