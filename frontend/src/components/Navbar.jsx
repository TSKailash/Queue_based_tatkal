import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/queue')}>
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Tatkal<span className="text-indigo-600">Sync</span>
            </span>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/history')}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              My Bookings
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Subtle brand gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400"></div>
    </nav>
  );
}
