import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/navbar";
import Landing from "./Components/Landing";
import GetStarted from "./Components/GetStarted";
import Login from "./Components/Login";
import Recovery from "./Components/Recovery";
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 font-sans relative overflow-hidden">
             
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-70 dark:opacity-100">
                <div className="absolute inset-0 bg-radial-glow dark:bg-radial-glow transition-opacity duration-500" />
              </div>

              <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
              
              <main className="relative z-10">
                <Landing />
              </main>
            </div>
          }
        />

        
        <Route
          path="/get-started"
          element={
            <GetStarted darkMode={darkMode} toggleTheme={toggleTheme} />
          }
        />
        <Route
          path="/login"
          element={
            <Login darkMode={darkMode} toggleTheme={toggleTheme} />
          }
        />
        <Route
          path="/recovery"
          element={
            <Recovery darkMode={darkMode} toggleTheme={toggleTheme} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard darkMode={darkMode} toggleTheme={toggleTheme} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;