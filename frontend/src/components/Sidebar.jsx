import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, FileText, LogOut, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

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
    { name: 'My Profile', path: '/intern/profile', icon: UserCircle },

  ];

  const links = user?.role === 'ROLE_ADMIN' ? adminLinks : internLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <CheckSquare className="text-primary" />
          TaskTracker
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{user?.role === 'ROLE_ADMIN' ? 'Admin Portal' : 'Intern Portal'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-danger rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;