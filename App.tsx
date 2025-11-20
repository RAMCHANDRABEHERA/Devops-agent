
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, MockFile } from './types';
import { analyzeLegacyCode } from './services/geminiService';
import { saveRefactoringPlan } from './services/firestoreService';
import { LEGACY_FILES, DEMO_REPO_URL } from './constants';
import RepoInput from './components/RepoInput';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [repoUrl, setRepoUrl] = useState<string>(DEMO_REPO_URL);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState<string | null>(null);

  const handleStartAnalysis = useCallback(async (useMock: boolean) => {
    setErrorMsg(null);
    setAppState(AppState.CLONING);

    try {
      // Simulate Cloud Run "Cloning" latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAppState(AppState.ANALYZING);
      
      // In a real app, we would fetch the files from the backend here.
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

  const handleMerge = useCallback(async () => {
    if (!analysisResult) return;
    setIsMerging(true);
    try {
      const id = await saveRefactoringPlan(repoUrl, analysisResult);
      setMergeSuccess(id);
      setTimeout(() => {
        setMergeSuccess(null);
        handleReset();
      }, 3000);
    } catch (e) {
      console.error("Failed to save to Firestore", e);
    } finally {
      setIsMerging(false);
    }
  }, [analysisResult, repoUrl]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setErrorMsg(null);
    setMergeSuccess(null);
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
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
              {appState === AppState.ANALYZING && (
                <div className="absolute inset-0 border-l-4 border-cyan-500 rounded-full animate-spin-slow" style={{animationDuration: '3s'}}></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                {appState === AppState.CLONING ? (
                   <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                   </svg>
                ) : (
                   <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                   </svg>
                )}
              </div>
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-white mb-2">
                {appState === AppState.CLONING ? "Initializing Cloud Run Instance..." : "Deep Code Analysis in Progress"}
              </h2>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">
                  {appState === AppState.CLONING 
                    ? "Cloning repository to ephemeral container storage." 
                    : "Gemini 3.0 Pro is ingesting 50+ files (2M Context Window)."}
                </p>
                {appState === AppState.ANALYZING && (
                  <p className="text-amber-500/80 text-xs font-mono animate-pulse">
                    Identifying global dependencies & vulnerability patterns...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {appState === AppState.COMPLETE && analysisResult && (
          <>
             <Dashboard 
               result={analysisResult} 
               onReset={handleReset} 
               onMerge={handleMerge}
               isMerging={isMerging}
             />
             {mergeSuccess && (
               <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 <div>
                   <p className="font-bold">Pull Request Merged!</p>
                   <p className="text-xs opacity-90">Refactoring plan saved to Firestore ID: {mergeSuccess}</p>
                 </div>
               </div>
             )}
          </>
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

      <footer className="p-6 border-t border-slate-800 text-center text-slate-600 text-xs flex justify-between px-12">
        <span>© {new Date().getFullYear()} Legacy Code Archaeologist</span>
        <span className="font-mono">Powered by Google Cloud Run • Firestore • Gemini 3.0 Pro</span>
      </footer>
    </div>
  );
};

export default App;
