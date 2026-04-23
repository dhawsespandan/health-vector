import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, ChevronDown, Menu, X, LayoutGrid, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="mac-glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shadow-sm">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-zinc-900 tracking-tight">
              Health Vector
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Area */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white shadow-sm text-zinc-700 hover:text-zinc-900 transition-colors text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-700">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  {user?.name?.split(' ')[0]}
                  <ChevronDown size={14} className="text-zinc-400" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 mac-panel p-2 shadow-lg z-[200]">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-900 truncate">{user?.email}</p>
                    </div>
                    <div className="h-px bg-zinc-100 my-1"></div>
                    
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="menu-item"><LayoutGrid size={15} /> Dashboard</Link>
                    <Link to="/assessment" onClick={() => setUserMenuOpen(false)} className="menu-item"><Activity size={15} /> Take Assessment</Link>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="menu-item"><User size={15} /> Profile</Link>
                    
                    {(user?.role === 'org_admin' || user?.role === 'admin') && (
                      <Link to="/org/dashboard" onClick={() => setUserMenuOpen(false)} className="menu-item"><Settings size={15} /> Org Dashboard</Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="menu-item"><Settings size={15} /> Admin Panel</Link>
                    )}
                    
                    <div className="h-px bg-zinc-100 my-1"></div>
                    <button onClick={handleLogout} className="menu-item text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="mac-btn-secondary text-sm">Log in</Link>
                <Link to="/register" className="mac-btn-primary text-sm">Get Started</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-zinc-500 hover:text-zinc-900">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-200/50 p-4 absolute w-full shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-100">
                <Link to="/login" className="mac-btn-secondary w-full justify-center" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/register" className="mac-btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
