import React from 'react';

export function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full h-full min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      {text && <p className="text-slate-600 font-medium animate-pulse">{text}</p>}
    </div>
  );
}
