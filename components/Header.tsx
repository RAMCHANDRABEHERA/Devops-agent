import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-50 bg-opacity-90 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
           <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">
            Legacy Code <span className="text-amber-500">Archaeologist</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">DevOps Refactoring Agent v1.0</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
         <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-400">System: ONLINE</span>
         </div>
         <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Model: Gemini 3.0 Pro</span>
         </div>
      </div>
    </header>
  );
};

export default Header;
