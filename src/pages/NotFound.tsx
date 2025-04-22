import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : ''}`}>404</h1>
        <p className={`text-xl mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Oops! Page not found</p>
        <a 
          href="/" 
          className={`underline hover:opacity-80 transition-opacity ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
