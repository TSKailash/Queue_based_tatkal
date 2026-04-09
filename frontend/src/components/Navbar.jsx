import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`px-4 py-5 text-sm font-bold uppercase tracking-widest border-l border-slate-700 transition-none ${
        isActive(to)
          ? 'bg-emerald-600 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="w-full bg-slate-900 border-b-4 border-emerald-600">
      <div className="w-full mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-stretch">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col justify-center py-4 pr-6 border-r border-slate-700">
              <span className="font-black text-2xl tracking-tighter text-white uppercase leading-none">
                Tatkal
              </span>
              <span className="font-bold text-xs tracking-[0.2em] text-emerald-500 uppercase mt-1">
                Systems
              </span>
            </Link>

            {/* Links Block */}
            <div className="hidden md:flex h-full items-stretch ml-4">
              <NavLink to="/" label="Dashboard" />
              <NavLink to="/history" label="Records" />
              {token && <NavLink to="/masterlist" label="Manifest" />}
            </div>
          </div>

          {/* User Block */}
          <div className="flex border-l border-slate-700">
            {token ? (
              <div className="flex items-stretch">
                <div className="hidden sm:flex flex-col justify-center px-6 border-r border-slate-700">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Operator Auth</span>
                  <span className="text-sm font-black text-white">ACTIVE</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 bg-slate-800 hover:bg-emerald-600 text-white text-sm font-bold uppercase tracking-widest transition-none"
                >
                  Terminate
                </button>
              </div>
            ) : (
              <div className="flex items-stretch">
                <Link to="/login" className="flex items-center px-6 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-none uppercase tracking-widest border-r border-slate-700">
                  Access Portal
                </Link>
                <Link to="/register" className="flex items-center px-6 bg-emerald-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-none">
                  Onboard
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
