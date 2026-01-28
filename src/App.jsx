import { useState } from 'react';
import VoiceAgent from './components/VoiceAgent';
import CallSummary from './components/CallSummary';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [view, setView] = useState('start'); // 'start' | 'session' | 'summary'
  const [error, setError] = useState(null);
  const [callSummary, setCallSummary] = useState(null);

  const startCall = async () => {
    setError(null);
    setCallSummary(null);
    try {
      const resp = await fetch("http://localhost:8000/token");
      if (!resp.ok) throw new Error("Backend unreachable");
      const data = await resp.json();
      setToken(data.token);
      setUrl(data.url);
      setView('session');
    } catch (e) {
      console.error("Failed to fetch token", e);
      setError("Unable to connect to the clinic system. Is the backend running?");
    }
  };

  const handleDisconnect = () => {
    setView('summary');
  };

  const handleSummaryReceived = (summaryData) => {
    setCallSummary(summaryData);
    // Auto-switch to summary view immediately when summary is received
    setView('summary');
  };

  const handleRestart = () => {
    setView('start');
    setToken("");
    setUrl("");
    setCallSummary(null);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence mode='wait'>
        {view === 'start' && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full"
          >
            {/* Left Sidebar - Clinic Branding */}
            <div className="w-96 bg-white border-r border-slate-100 flex flex-col p-8 z-10 shadow-sm">
              <div className="flex items-center gap-3 mb-10">

                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-none">SuperBryn</h1>
                  <span className="text-xs text-teal-600 font-semibold tracking-wider uppercase">Clinic AI System</span>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-xs text-slate-400 mb-4">© 2025 SuperBryn Assignment</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Designed and Developed by</p>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Manoj Kumar S</p>
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/smk-00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      GitHub
                    </a>
                    |
                    <a
                      href="https://www.linkedin.com/in/smk2000/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      LinkedIn
                    </a>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Background Decor */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-transparent to-transparent opacity-50" />

              <div className="max-w-md w-full text-center z-10">
                <h2 className="text-4xl font-light text-slate-800 mb-4">Good Morning.</h2>
                <p className="text-slate-500 mb-10">Ready to start the conversation with AI Appointment Assistant?</p>

                <button
                  onClick={startCall}
                  className="group relative px-10 py-5 from-teal-500 to-teal-600 text-white font-semibold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Conversation
                </button>

                {error && (
                  <div className="mt-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'session' && (
          <motion.div
            key="session-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Smooth transition out
            className="w-full h-full"
          >
            {/* End Call Button Overlay */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur border border-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                End Session
              </button>
            </div>

            <VoiceAgent
              token={token}
              serverUrl={url}
              onDisconnect={handleDisconnect}
              onSummaryReceived={handleSummaryReceived}
            />
          </motion.div>
        )}

        {view === 'summary' && (
          <motion.div key="summary-screen" className="relative z-50">
            <CallSummary data={callSummary} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
