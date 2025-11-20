
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import DiffView from './DiffView';
import VulnerabilityList from './VulnerabilityList';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onMerge: () => void;
  isMerging: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ result, onReset, onMerge, isMerging }) => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'files'>('conversation');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9]">
      {/* GitHub-style Header */}
      <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
        <div className="max-w-6xl mx-auto">
           <div className="flex items-start justify-between">
             <div>
               <h2 className="text-xl font-semibold text-white mb-1">
                 {result.prTitle} <span className="text-slate-500 font-light">#142</span>
               </h2>
               <div className="flex items-center gap-2 text-sm">
                 <span className="bg-[#238636] text-white px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)] font-medium flex items-center gap-1">
                   <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8.22 2.97a.75.75 0 01.76 1.06l-1.859 4.828 1.859 4.828a.75.75 0 01-1.42.548l-2.25-5.842a.75.75 0 010-.548l2.25-5.842a.75.75 0 01.66-.434zM11.75 7.25a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5a.75.75 0 01.75-.75zm-8 1.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V9.5a.75.75 0 01.75-.75z"></path></svg>
                   Open
                 </span>
                 <span className="text-slate-400">
                   <strong className="text-white">LegacyArcheologist</strong> wants to merge {result.files.length} commits into <code className="bg-slate-800 px-1 rounded">main</code> from <code className="bg-slate-800 px-1 rounded">fix/modernize-stack</code>
                 </span>
               </div>
             </div>
             <button 
               onClick={onReset}
               className="text-xs text-slate-400 hover:text-blue-400 underline"
             >
               Analyze Different Repo
             </button>
           </div>
           
           {/* Navigation Tabs */}
           <div className="flex gap-8 mt-6 border-b border-transparent">
              <button 
                onClick={() => setActiveTab('conversation')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'conversation' ? 'border-[#f78166] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Conversation <span className="bg-[#30363d] text-white rounded-full px-1.5 py-0.5 text-xs ml-1">1</span>
              </button>
              <button 
                onClick={() => setActiveTab('files')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'files' ? 'border-[#f78166] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Files Changed <span className="bg-[#30363d] text-white rounded-full px-1.5 py-0.5 text-xs ml-1">{result.files.length}</span>
              </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
           
           {/* Left Column / Main */}
           <div className="flex-grow space-y-6">
              {activeTab === 'conversation' ? (
                <div className="space-y-6">
                  {/* PR Description Card */}
                  <div className="border border-[#30363d] rounded-md bg-[#0d1117]">
                    <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex justify-between items-center rounded-t-md">
                       <span className="text-sm font-bold text-slate-300">LegacyArcheologist <span className="font-normal text-slate-500">commented now</span></span>
                       <span className="text-xs text-slate-500 border border-slate-700 rounded px-1">Member</span>
                    </div>
                    <div className="p-4 text-sm text-slate-300 space-y-4">
                       <div className="prose prose-invert prose-sm max-w-none">
                         <h3 className="text-white font-bold text-lg">Summary of Changes</h3>
                         <p className="whitespace-pre-wrap">{result.prDescription}</p>
                       </div>
                       
                       {/* In-line Vulnerability Report */}
                       <div className="mt-6">
                         <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                           <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" /></svg>
                           Security Scan Report
                         </h4>
                         <VulnerabilityList vulnerabilities={result.vulnerabilities} />
                       </div>
                    </div>
                  </div>

                  {/* Merge Box */}
                  <div className="border border-[#30363d] rounded-md bg-[#161b22] p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-900/30 rounded-full border border-green-500/30">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="flex-grow">
                         <h3 className="text-white font-bold">This branch has no conflicts with the base branch</h3>
                         <p className="text-sm text-slate-400 mb-3">Merging can be performed automatically.</p>
                         
                         <button 
                           onClick={onMerge}
                           disabled={isMerging}
                           className={`px-4 py-1.5 rounded-md font-bold text-sm transition flex items-center gap-2 ${isMerging ? 'bg-green-700 cursor-not-allowed' : 'bg-[#238636] hover:bg-[#2ea043] text-white'}`}
                         >
                           {isMerging ? 'Merging...' : 'Merge pull request'}
                           {!isMerging && <span className="bg-green-800 text-green-100 text-[10px] px-1 rounded">PRO</span>}
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Explorer for Diff */}
                   <div className="flex gap-4">
                      <div className="w-64 flex-shrink-0 space-y-1">
                        {result.files.map((file, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedFileIndex(idx)}
                            className={`w-full text-left px-3 py-2 rounded text-sm truncate transition ${selectedFileIndex === idx ? 'bg-[#1f6feb] text-white' : 'text-slate-400 hover:bg-[#161b22]'}`}
                          >
                            {file.filename}
                          </button>
                        ))}
                      </div>
                      <div className="flex-grow border border-[#30363d] rounded-md overflow-hidden">
                        <div className="bg-[#161b22] px-3 py-2 border-b border-[#30363d] text-xs text-slate-400 font-mono flex justify-between">
                          <span>{result.files[selectedFileIndex].filename}</span>
                          <span className="text-green-400">Verified Safe</span>
                        </div>
                        <DiffView 
                          original={result.files[selectedFileIndex].originalContent} 
                          modified={result.files[selectedFileIndex].newContent} 
                        />
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Right Sidebar */}
           <div className="w-full md:w-72 flex-shrink-0 space-y-6">
              <div className="border-b border-[#30363d] pb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 hover:text-blue-400 cursor-pointer flex justify-between">
                  Reviewers 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-black font-bold">AI</div>
                  <span>Gemini 3.0 Pro</span>
                  <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              
              <div className="border-b border-[#30363d] pb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Labels</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#d73a49] text-white text-xs font-medium border border-transparent">security</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#a2eeef] text-[#1a7f37] text-xs font-medium border border-transparent">refactor</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#7057ff] text-white text-xs font-medium border border-transparent">python3</span>
                </div>
              </div>

              <div className="border-b border-[#30363d] pb-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Cloud Run Stats</h4>
                 <div className="text-sm text-slate-300 space-y-1 font-mono">
                   <div className="flex justify-between">
                     <span>Tokens:</span>
                     <span className="text-slate-500">{result.tokensUsed.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Duration:</span>
                     <span className="text-slate-500">1.4s</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Files:</span>
                     <span className="text-slate-500">{result.files.length}</span>
                   </div>
                 </div>
              </div>
           </div>

         </div>
      </div>
    </div>
  );
};

export default Dashboard;
