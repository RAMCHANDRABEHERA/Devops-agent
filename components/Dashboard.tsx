
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import DiffView from './DiffView';
import VulnerabilityList from './VulnerabilityList';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'files'>('summary');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Analysis Report</h2>
          <div className="flex gap-4 text-xs text-slate-400 mt-1">
             <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Analyzed {result.files.length} files
             </span>
             <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {result.vulnerabilities.length} Vulnerabilities Found
             </span>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-sm text-slate-400 hover:text-white transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Analyze Another
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto flex-shrink-0">
           <div className="p-4 border-b border-slate-800">
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Overview</h3>
             <button 
               onClick={() => setActiveTab('summary')}
               className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-1 ${activeTab === 'summary' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-400 hover:bg-slate-900'}`}
             >
               Mission Report
             </button>
           </div>
           
           <div className="p-4">
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Refactored Files</h3>
             <div className="space-y-1">
               {result.files.map((file, idx) => (
                 <button
                   key={idx}
                   onClick={() => {
                     setActiveTab('files');
                     setSelectedFileIndex(idx);
                   }}
                   className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${activeTab === 'files' && selectedFileIndex === idx ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900'}`}
                 >
                   <span className="truncate">{file.filename}</span>
                   <span className="text-xs opacity-50">py</span>
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow bg-slate-900/50 overflow-y-auto p-6 md:p-8">
           {activeTab === 'summary' ? (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-3">Executive Summary</h3>
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Identified Vulnerabilities
                  </h3>
                  <VulnerabilityList vulnerabilities={result.vulnerabilities} />
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col animate-fade-in">
                <div className="mb-4 flex items-center justify-between">
                   <h3 className="text-lg font-bold text-white font-mono">{result.files[selectedFileIndex].filename}</h3>
                   <span className="px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-mono border border-cyan-800">
                     Python 3.12 Compatible
                   </span>
                </div>
                
                {/* Changes Summary for this file */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {result.files[selectedFileIndex].changesSummary.map((change, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                      {change}
                    </span>
                  ))}
                </div>

                <div className="flex-grow border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
                   <DiffView 
                     original={result.files[selectedFileIndex].originalContent} 
                     modified={result.files[selectedFileIndex].newContent} 
                   />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
