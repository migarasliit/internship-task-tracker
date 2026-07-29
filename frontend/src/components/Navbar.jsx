import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        Welcome back, {user?.fullName || 'User'}
      </h2>
      
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 px-3 sm:px-4 py-2 rounded-full border border-gray-200">
        <UserCircle className="text-gray-500 hidden sm:block" size={24} />
        <div className="text-xs sm:text-sm">
          <p className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{user?.fullName}</p>
          <p className="text-xs text-gray-500">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Intern'}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;