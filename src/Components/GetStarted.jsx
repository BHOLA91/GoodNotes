import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function GetStarted({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (!response.ok) {
        
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

     
      console.log('Registered:', data);

     
      navigate('/dashboard');

    } catch (err) {
      // Network error — backend not running, wrong port, etc.
      setError('Could not connect to server. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans relative flex items-center justify-center p-6 overflow-hidden">


      <div className="absolute top-12 left-12 text-[9vw] font-extrabold tracking-widest select-none pointer-events-none text-gray-200 dark:text-gray-900 font-heading animate-fade-in opacity-60">
        THINK
      </div>
      <div className="absolute bottom-12 right-12 text-[9vw] font-extrabold tracking-widest select-none pointer-events-none text-gray-200 dark:text-gray-900 font-heading animate-fade-in opacity-60" style={{ animationDelay: '0.2s' }}>
        CREATE
      </div>


      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/8 blur-3xl pointer-events-none animate-glow" style={{ animationDelay: '-5s' }} />


      <header className="absolute top-0 left-0 w-full px-6 sm:px-8 h-20 flex justify-between items-center z-20">
        <div className="flex-1" />


        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 p-1.5 flex items-center justify-center transition-all duration-300 group-hover:rotate-3 shadow-sm">
            <img className="w-full h-full object-contain" src="/Icon.png" alt="Good Notes Logo" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            Good Notes
          </span>
        </div>


        <div className="flex-1 flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-950/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 cursor-pointer border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-800/50 relative overflow-hidden active:scale-90"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
            ) : (
              <Moon className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
            )}
          </button>
        </div>
      </header>


      <div className="relative z-10 w-full max-w-[420px] bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-850 p-8 rounded-2xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-slide-up">


        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-normal">
            Refined space for your brilliant thoughts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-red-500 text-xs text-center mb-2">{error}</p>
          )}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Example name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="bg-neutral-100/50 dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-lg px-3.5 py-2.5 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all duration-200 text-neutral-900 dark:text-neutral-100"
            />
          </div>


          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-neutral-100/50 dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-lg px-3.5 py-2.5 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all duration-200 text-neutral-900 dark:text-neutral-100"
            />
          </div>


          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                Password
              </label>

            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="bg-neutral-100/50 dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-lg px-3.5 py-2.5 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all duration-200 text-neutral-900 dark:text-neutral-100 pr-10"
              />


              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 text-sm hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>


        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
            Sign In
          </Link>
        </div>


        <div className="flex items-center gap-3 text-[9px] tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold my-6 w-full">
          <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <span>OR CONTINUE WITH</span>
          <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
        </div>


        <div className="flex gap-4">


          =
          <button
            type="button"
            className="flex-1 py-2.5 bg-neutral-100/50 dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-900/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >

            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.58 0-6.49-2.91-6.49-6.49s2.91-6.49 6.49-6.49c1.58 0 3.02.57 4.14 1.53l3.02-3.02C18.66 1.83 15.62 1 12.24 1 6.17 1 1.25 5.92 1.25 12s4.92 11 10.99 11c5.78 0 10.7-4.14 10.7-11 0-.74-.08-1.45-.2-2.115H12.24z" />
            </svg>
            Google
          </button>
        </div>

      </div>
    </div>
  );
}
