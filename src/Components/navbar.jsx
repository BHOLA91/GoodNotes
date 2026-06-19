


import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ darkMode, toggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#030303]/70 glass-nav border-b border-neutral-200/50 dark:border-neutral-900/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-18">
          
          <Link to="/" className="flex items-center gap-3 group cursor-pointer decoration-transparent">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
              <img
                className="w-full h-full object-contain"
                src="/Icon.png"
                alt="Good Notes Logo"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white font-heading transition-all duration-300">
              Good Notes
            </span>
          </Link>

          
          <div className="flex items-center gap-5 sm:gap-6">
            <Link to="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 cursor-pointer decoration-transparent">
              Login
            </Link>
            
          
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-950/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 cursor-pointer border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-800/50 relative overflow-hidden group active:scale-90"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5 transition-transform duration-500 rotate-0 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
              )}
            </button>
            
           
            <Link
              to="/get-started"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-[0.97] decoration-transparent"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
