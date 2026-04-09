import React, { useContext } from 'react';
import Navbar from './Navbar';

// I will make layout expand fully without rigid max-w-7xl paddings so the Home hero can stretch full width.
// We can apply max-w-7xl safely ONLY on non-home pages, or let individual pages handle it.
// To keep things simple, Layout will just wrap Navbar and let children define their container limits.
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
