import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Shield, Zap, Fingerprint } from 'lucide-react';

export default function Recovery() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans flex flex-col justify-between overflow-hidden relative">
      
    
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-3xl pointer-events-none animate-glow" />

      
      <header className="w-full px-6 sm:px-12 md:px-16 lg:px-24 h-20 flex justify-between items-center z-25 border-b border-neutral-200/40 dark:border-neutral-900/50 bg-white/40 dark:bg-[#030303]/40 backdrop-blur-md">
        
        
        <div className="flex items-center gap-4 select-none">
          <button 
            type="button" 
            className="p-1.5 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Menu"
          >
            
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/" className="flex items-center gap-3 cursor-pointer decoration-transparent">
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
              Good Notes
            </span>
          </Link>
        </div>

        
        <div className="flex items-center gap-5 sm:gap-6">
          <Link 
            to="#" 
            className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors duration-200"
          >
            Support
          </Link>
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          
          
          <div className="w-full bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-900 p-8 rounded-2xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up">
            
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading mb-3">
              Recovery
            </h1>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mb-6">
              Lost your way? Enter your email address below and we'll send you a secure link to reset your account credentials.
            </p>

            {success ? (
              <div className="space-y-6 text-center py-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-3 rounded-lg font-medium leading-relaxed">
                  Reset link sent! Please check your email inbox at <span className="font-bold underline">{email}</span> for details.
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs px-4 py-2.5 rounded-lg text-center font-medium">
                    {error}
                  </div>
                )}

                {/* Email Address Input */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 block">
                    Email address
                  </label>
                  
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-neutral-50/50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-lg pl-10 pr-4 py-3 w-full text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-lg font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                {/* Back to Login Link */}
                <div className="flex justify-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </Link>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      {/* Badges Footer */}
      <footer className="w-full py-8 flex flex-col items-center justify-center relative z-10 select-none bg-neutral-100/30 dark:bg-[#030303]/10 border-t border-neutral-200/40 dark:border-neutral-900/50">
        <div className="flex items-center justify-center gap-10 sm:gap-14 text-xs font-semibold text-neutral-450 dark:text-neutral-500">
          
          <div className="flex flex-col items-center gap-1.5 group cursor-default">
            <div className="p-2 rounded-full bg-neutral-200/50 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 group-hover:scale-110">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span>Secure</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-default">
            <div className="p-2 rounded-full bg-neutral-200/50 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 group-hover:scale-110">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <span>Instant</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-default">
            <div className="p-2 rounded-full bg-neutral-200/50 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 group-hover:scale-110">
              <Fingerprint className="w-4.5 h-4.5" />
            </div>
            <span>Private</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
