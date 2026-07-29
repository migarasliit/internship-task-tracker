import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // <-- ADD THIS
import { UserCircle, Sun, Moon } from 'lucide-react'; // <-- ADD Sun, Moon

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext); // <-- ADD THIS

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 transition-colors duration-300">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
        Welcome back, {user?.fullName || 'User'}
      </h2>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 transition-colors">
          <UserCircle className="text-gray-500 dark:text-gray-300 hidden sm:block" size={24} />
          <div className="text-xs sm:text-sm">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px] sm:max-w-none">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Intern'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;