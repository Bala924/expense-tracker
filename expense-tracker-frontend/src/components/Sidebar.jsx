import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, History, PieChart,
  DollarSign, LogOut, TrendingUp
} from 'lucide-react';
import { getUser, removeUser } from '../utils/auth';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: CreditCard },
  { to: '/history', label: 'History', icon: History },
  { to: '/summary', label: 'Summary', icon: PieChart },
  { to: '/salary', label: 'Salary', icon: DollarSign },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    removeUser();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">ExpenseTracker</p>
          <p className="text-xs text-gray-400">Financial Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-indigo-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
