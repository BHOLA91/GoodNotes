import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] px-6 sm:px-8 py-12 sm:py-20 relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none animate-glow" style={{ animationDelay: '-5s' }} />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        
       
        <div className="animate-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading leading-[1.1] sm:leading-[1.05]">
            Your Thoughts,
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mt-2 sm:mt-3 bg-blue-600 bg-clip-text text-transparent font-heading leading-[1.1] sm:leading-[1.05]">
            Beautifully Organized.
          </h2>
        </div>

     
        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed animate-slide-up-delay-1 opacity-0">
          A premium workspace designed for high-output thinkers. Capture ideas with structural precision and visual elegance.
        </p>

        
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto animate-slide-up-delay-2 opacity-0">
          
           <Link
              to="/get-started"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] text-center cursor-pointer"
            >
              Get Started
            </Link>

         

        </div>

      </div>
    </section>
  );
};

export default Landing;