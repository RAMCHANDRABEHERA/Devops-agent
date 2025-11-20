import React from 'react';

interface DiffViewProps {
  original: string;
  modified: string;
}

const DiffView: React.FC<DiffViewProps> = ({ original, modified }) => {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  
  // A very naive diff implementation for visual purpose.
  // In production, use 'diff' package.
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  return (
    <div className="grid grid-cols-2 h-full bg-[#1e1e1e] font-mono text-sm overflow-hidden">
      {/* Original Side */}
      <div className="border-r border-slate-700 overflow-auto">
         <div className="sticky top-0 bg-[#252526] text-slate-400 px-4 py-2 text-xs border-b border-slate-700 font-sans">
           Legacy (Python 2.7)
         </div>
         <div className="p-4">
           {originalLines.map((line, i) => (
             <div key={i} className="flex">
               <span className="w-8 text-slate-600 text-right mr-4 select-none">{i + 1}</span>
               <pre className="text-slate-300 whitespace-pre-wrap break-all">{line}</pre>
             </div>
           ))}
         </div>
      </div>

      {/* Modified Side */}
      <div className="overflow-auto">
         <div className="sticky top-0 bg-[#252526] text-cyan-400 px-4 py-2 text-xs border-b border-slate-700 font-sans flex justify-between">
           <span>Modernized (Python 3.12)</span>
         </div>
         <div className="p-4">
           {modifiedLines.map((line, i) => (
             <div key={i} className="flex group hover:bg-slate-800/50">
               <span className="w-8 text-slate-600 text-right mr-4 select-none">{i + 1}</span>
               <pre className="text-green-300 whitespace-pre-wrap break-all">{line}</pre>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default DiffView;
