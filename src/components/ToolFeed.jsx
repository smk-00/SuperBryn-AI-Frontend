import { useState, useEffect } from 'react';
import { useRoomContext } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToolFeed() {
    const room = useRoomContext();
    const [tools, setTools] = useState([]);

    useEffect(() => {
        if (!room) return;

        const handleData = (payload) => {
            const str = new TextDecoder().decode(payload);
            try {
                const data = JSON.parse(str);

                if (data.type === "tool_start") {
                    setTools(prev => [{
                        id: Date.now(), // Simple unique ID
                        ...data,
                        status: 'running',
                        timestamp: new Date().toISOString()
                    }, ...prev]);
                }
                else if (data.type === "tool_end") {
                    setTools(prev => {
                        // Find the most recent running tool with the same name
                        const index = prev.findIndex(t => t.name === data.name && t.status === 'running');
                        if (index === -1) return prev;

                        const newTools = [...prev];
                        newTools[index] = {
                            ...newTools[index],
                            status: 'completed',
                            result: data.message
                        };
                        return newTools;
                    });
                }
            } catch (e) {
                console.error("Invalid data message", e);
            }
        };

        room.on("dataReceived", handleData);
        return () => room.off("dataReceived", handleData);
    }, [room]);

    return (
        <div className="space-y-4 pr-1">
            <AnimatePresence initial={false}>
                {tools.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 border border-dashed border-slate-300 rounded-xl text-center bg-slate-50/50"
                    >
                        <p className="text-slate-400 text-sm italic">Waiting for agent activity...</p>
                    </motion.div>
                )}

                {tools.map((tool) => (
                    <motion.div
                        key={tool.id || `${tool.name}-${tool.timestamp}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        layout
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tool.status === 'running' ? 'bg-teal-500 animate-pulse' : 'bg-emerald-500'}`} />
                                <h3 className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                                    {tool.name.replace(/_/g, ' ')}
                                </h3>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(tool.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>

                        <div className="pl-4 border-l-2 border-slate-100">
                            <p className={`text-xs leading-relaxed ${tool.status === 'running' ? 'text-slate-500 italic' : 'text-slate-600'}`}>
                                {tool.status === 'running' ? "Processing request..." : (tool.result || "Action completed.")}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
