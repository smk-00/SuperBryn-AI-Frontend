import { motion } from "framer-motion";

export default function Summary({ summary }) {
    if (!summary) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="bg-slate-900/90 border border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

                <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6">Conversation Summary</h3>

                <div className="bg-white/5 rounded-xl p-6 border border-white/5 mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-200">{summary}</p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all transform hover:scale-105"
                    >
                        Start New Consultation
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
