import React from 'react';

interface RepoInputProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  onAnalyze: () => void;
}

const RepoInput: React.FC<RepoInputProps> = ({ repoUrl, setRepoUrl, onAnalyze }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
             Resurrect <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Legacy Code</span>
           </h2>
           <p className="text-lg text-slate-400 leading-relaxed">
             Don't let old Python 2.7 projects rot. <br/>
             Leverage <strong>Gemini's 2 Million Token Context</strong> to analyze, secure, and upgrade entire repositories in seconds.
           </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col gap-4">
            <label className="text-left text-sm font-bold text-slate-300 ml-1">GitHub Repository URL</label>
            <div className="flex gap-3 flex-col md:flex-row">
              <input 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="flex-grow bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-sm"
              />
              <button 
                onClick={onAnalyze}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Analyze Repo</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-500 text-left">
              * This demo simulates a Cloud Run environment. The repository will be "cloned" to a temporary sandboxed container.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
           <FeatureCard 
             icon="🛡️" 
             title="Security Scan" 
             desc="Identifies OWASP vulnerabilities like SQL Injection & Insecure Deserialization." 
           />
           <FeatureCard 
             icon="⚡" 
             title="Auto-Refactor" 
             desc="Converts Python 2.7 to 3.12 with type hinting and modern patterns." 
           />
           <FeatureCard 
             icon="🧠" 
             title="Deep Context" 
             desc="Understands cross-file dependencies unlike standard LLM chats." 
           />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, title: string, desc: string}> = ({ icon, title, desc }) => (
  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="font-bold text-white mb-1">{title}</h3>
    <p className="text-xs text-slate-400">{desc}</p>
  </div>
)

export default RepoInput;
