import { motion } from "framer-motion";

export default function CallSummary({ data, onRestart }) {
    return (
        <div className="ml-[100px] mr-[100px] mt-[30px] flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white max-w-3xl w-full rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden relative"
            >
                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500" />

                <div className="m-[20px] p-12 space-y-10">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 mb-4 shadow-sm border border-teal-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Consultation Complete</h2>
                        <p className="text-slate-500 text-lg">Your session summary is ready.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Patient</span>
                                <span className="font-semibold text-slate-900 text-lg">Guest User</span>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 text-lg">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Processed
                                </span>
                            </div>
                        </div>

                        {/* Main Summary Content */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide ml-1">Clinical Notes</h3>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/60 leading-relaxed text-slate-700 shadow-inner">
                                {data ? (
                                    <p className="p-[20px] whitespace-pre-wrap">{data}</p>
                                ) : (
                                    <div className="p-[20px] flex flex-col items-center justify-center py-8 text-slate-400 opacity-60">
                                        <p>No summary generated.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            onClick={onRestart}
                            className="m-[20px] p-[20px] w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-transform active:scale-[0.98] shadow-lg hover:shadow-xl"
                        >
                            Start New Consultation
                        </button>
                    </div>
                </div>
            </motion.div>

            <p className="mt-8 text-slate-400 text-xs font-medium tracking-widest opacity-60">
                SuperBryn AI Assistant • V2.0
            </p>
        </div>
    );
}
