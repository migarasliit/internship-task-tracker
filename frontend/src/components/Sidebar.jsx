import { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, FileText, LogOut, Menu, X, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Interns', path: '/admin/interns', icon: Users },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Work Logs', path: '/admin/logs', icon: FileText },
  ];

  const internLinks = [
    { name: 'Dashboard', path: '/intern/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/intern/tasks', icon: CheckSquare },
    { name: 'Daily Logs', path: '/intern/logs', icon: FileText },
    { name: 'My Profile', path: '/intern/profile', icon: UserCircle }, // Updated to UserCircle icon
  ];

  const links = user?.role === 'ROLE_ADMIN' ? adminLinks : internLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40
        w-64 lg:w-64
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <CheckSquare className="text-primary" />
            TaskTracker
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
            {user?.role === 'ROLE_ADMIN' ? 'Admin Portal' : 'Intern Portal'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)} // Close menu on mobile when clicking link
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-danger rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;