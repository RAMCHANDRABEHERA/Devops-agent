
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
      
      <div className="relative z-10 max-w-3xl w-full space-y-10 text-center">
        <div className="space-y-4">
           <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono mb-2">
             DEV_OPS_AGENT_V1.0 :: RUNNING_ON_CLOUD_RUN
           </div>
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
             Modernize Legacy Code <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">At Scale</span>
           </h2>
           <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
             Connect your repositories to our <strong>Cloud Run</strong> refactoring service. 
             We leverage <strong>Gemini's 2 Million Token Context Window</strong> to digest entire projects, 
             understand global dependencies, and generate production-ready Pull Requests.
           </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col gap-4">
            <label className="text-left text-sm font-bold text-slate-300 ml-1 flex justify-between">
              <span>GitHub Repository URL</span>
              <span className="text-xs font-normal text-slate-500">Supports Python 2.7, PHP 5, Java 8</span>
            </label>
            <div className="flex gap-3 flex-col md:flex-row">
              <input 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/legacy-corp/vulnerable-app"
                className="flex-grow bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-sm"
              />
              <button 
                onClick={onAnalyze}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Deploy Agent</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              <span>Secure Sandboxed Execution</span>
              <span className="text-slate-700">|</span>
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0111.293 2.707L17.293 8.707A2 2 0 0117.586 10H12V4H6v10h10v-1.586c.5-.5 1-1 1.5-1.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
              <span>Results saved to Firestore</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <FeatureCard 
             icon="🔍" 
             title="Whole-Repo Analysis" 
             desc="Unlike chat bots that see one file, we load thousands of files into the 2M context window to trace global data flows." 
           />
           <FeatureCard 
             icon="🛡️" 
             title="Security First" 
             desc="Detects OWASP Top 10 vulnerabilities (SQLi, XSS, Deserialization) and patches them automatically." 
           />
           <FeatureCard 
             icon="🔄" 
             title="Automated PRs" 
             desc="Generates ready-to-merge Pull Requests with detailed descriptions, ready for your CI/CD pipeline." 
           />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, title: string, desc: string}> = ({ icon, title, desc }) => (
  <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition group">
    <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition">{icon}</div>
    <h3 className="font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
)

export default RepoInput;
