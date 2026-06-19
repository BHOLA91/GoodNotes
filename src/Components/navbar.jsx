


import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 glass-nav border-b border-neutral-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-18">
          
          <Link to="/" className="flex items-center gap-3 group cursor-pointer decoration-transparent">
            <div className="relative flex items-center justify-center w-[30px] h-auto rounded-lg bg-white   transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ">
              <img
                className="w-full h-full object-cover"
                src="/Icon.png"
                alt="Good Notes Logo"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 font-heading transition-all duration-300">
              Good Notes
            </span>
          </Link>

          
          <div className="flex items-center gap-5 sm:gap-6">
            <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200 cursor-pointer decoration-transparent">
              Login
            </Link>
            
           
            <Link
              to="/get-started"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:scale-[1.03] active:scale-[0.97] decoration-transparent"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
