
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, MockFile } from './types';
import { analyzeLegacyCode } from './services/geminiService';
import { LEGACY_FILES, DEMO_REPO_URL } from './constants';
import RepoInput from './components/RepoInput';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [repoUrl, setRepoUrl] = useState<string>(DEMO_REPO_URL);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartAnalysis = useCallback(async (useMock: boolean) => {
    setErrorMsg(null);
    setAppState(AppState.CLONING);

    try {
      // Simulate Cloud Run "Cloning" latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAppState(AppState.ANALYZING);
      
      // In a real app, we would fetch the files from the backend here.
      // For this demo, we use the mock legacy files if useMock is true, 
      // or just fail/warn if they try a real URL (since we can't CORS fetch).
      // To make the demo robust, we ALWAYS use the mock files for the AI analysis 
      // but pretend it came from the URL provided.
      
      const filesToAnalyze: MockFile[] = LEGACY_FILES;
      
      const result = await analyzeLegacyCode(filesToAnalyze);
      setAnalysisResult(result);
      setAppState(AppState.COMPLETE);
      
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "An unexpected error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setErrorMsg(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {appState === AppState.IDLE && (
          <RepoInput 
            repoUrl={repoUrl} 
            setRepoUrl={setRepoUrl} 
            onAnalyze={() => handleStartAnalysis(true)} 
          />
        )}

        {(appState === AppState.CLONING || appState === AppState.ANALYZING) && (
          <div className="flex flex-col items-center justify-center flex-grow space-y-8 animate-fade-in p-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-white mb-2">
                {appState === AppState.CLONING ? "Cloning Repository to Cloud Run..." : "Digging through the artifacts..."}
              </h2>
              <p className="text-slate-400 mb-4">
                {appState === AppState.CLONING 
                  ? "Deploying ephemeral container for secure analysis." 
                  : "Gemini 1.5 Pro is processing the entire codebase (simulating 2M context window) to identify global dependencies."}
              </p>
              
              {appState === AppState.ANALYZING && (
                 <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-cyan-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
                 </div>
              )}
            </div>
          </div>
        )}

        {appState === AppState.COMPLETE && analysisResult && (
          <Dashboard result={analysisResult} onReset={handleReset} />
        )}

        {appState === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center flex-grow p-6">
             <div className="bg-red-900/20 border border-red-500 p-8 rounded-xl max-w-lg text-center">
               <h3 className="text-xl font-bold text-red-500 mb-2">Analysis Failed</h3>
               <p className="text-slate-300 mb-6">{errorMsg}</p>
               <button 
                 onClick={handleReset}
                 className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition"
               >
                 Try Again
               </button>
             </div>
           </div>
        )}
      </main>

      <footer className="p-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Legacy Code Archaeologist. Powered by Google Gemini & Cloud Run.</p>
      </footer>
    </div>
  );
};

export default App;
