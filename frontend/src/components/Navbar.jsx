// components/Navbar.jsx
// Sidebar navigation component

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',            label: 'Dashboard',   icon: '◈' },
  { to: '/complaints',  label: 'Complaints',  icon: '◉' },
  { to: '/submit',      label: 'Submit',      icon: '⊕' },
  { to: '/ai-analysis', label: 'AI Analysis', icon: '◎' },
  { to: '/analytics',   label: 'Analytics',   icon: '◑' }, // ✅ Analytics link
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-950 flex flex-col z-50 border-r border-brand-900">
      {/* Logo */}
      <div className="p-6 border-b border-brand-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-sm leading-tight">Smart Complaint</h1>
            <p className="text-brand-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
                  : 'text-brand-300 hover:bg-brand-900 hover:text-white'
              }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-brand-900/50">
        {user ? (
          <div>
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user.username}</p>
                <p className="text-brand-400 text-xs capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-brand-400 hover:text-white hover:bg-brand-900 rounded-lg transition-all"
            >
              Sign out →
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <NavLink to="/login" className="block px-3 py-2 text-sm text-brand-300 hover:text-white hover:bg-brand-900 rounded-lg transition-all">
              Sign in
            </NavLink>
            <NavLink to="/register" className="block px-3 py-2 text-sm text-brand-300 hover:text-white hover:bg-brand-900 rounded-lg transition-all">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
