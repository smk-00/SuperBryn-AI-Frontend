import { LiveKitRoom, RoomAudioRenderer, StartAudio, useTracks, VideoTrack, useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import "@livekit/components-styles";
import ToolFeed from "./ToolFeed";
import Summary from "./Summary";

export default function VoiceAgent({ token, serverUrl, onDisconnect, onSummaryReceived }) {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [avatarInitialized, setAvatarInitialized] = useState(false);

    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect={true}
            video={isCameraOn}
            audio={true}
            onDisconnected={onDisconnect}
            className="w-full h-full flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-900"
        >
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Transcript & Tools (40%) */}
                <div className="w-[40%] flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-white flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Consultation Log</h2>
                            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Live Session</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-500">REC</span>
                        </div>
                    </div>

                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/30">
                        <TranscriptFeed />
                    </div>

                    {/* Tool/Action Log (Bottom Section of Left Panel) */}
                    <div className="h-1/3 border-t border-slate-200 flex flex-col bg-slate-50">
                        <div className="px-6 py-3 border-b border-slate-200/50 bg-slate-100/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Actions</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <ToolFeed />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Avatar (60%) */}
                <div className="w-[60%] relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-12">

                    <div className="w-full h-full max-w-4xl max-h-[80vh] relative shadow-2xl rounded-3xl overflow-hidden border-4 border-white bg-slate-900 ring-1 ring-slate-200">
                        <AvatarDisplay initialized={avatarInitialized} setInitialized={setAvatarInitialized} />

                        {/* Controls Overlay */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
                            <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                className={`p-4 rounded-full border transition-all shadow-lg backdrop-blur-md ${isCameraOn ? 'bg-white/90 text-teal-600 border-teal-500' : 'bg-black/40 text-white border-white/20 hover:bg-black/60'}`}
                            >
                                {isCameraOn ? '📹 On' : '📹 Off'}
                            </button>
                            <StartAudio
                                label="🔊 Audio"
                                className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                            />
                        </div>

                        {/* Local Video Picture-in-Picture */}
                        {isCameraOn && (
                            <div className="absolute bottom-8 right-8 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white z-50">
                                <LocalVideo />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DataListener onSummaryReceived={onSummaryReceived} />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

function TranscriptFeed() {
    const room = useRoomContext();
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!room) return;

        const handleData = (payload, participant) => {
            const str = new TextDecoder().decode(payload);
            try {
                const data = JSON.parse(str);
                console.log("DEBUG: VoiceAgent received data:", data);
                if (data.type === 'user_speech') {
                    setMessages(prev => [...prev, { id: Date.now(), text: data.text, sender: 'user' }]);
                } else if (data.type === 'agent_speech') {
                    setMessages(prev => [...prev, { id: Date.now(), text: data.text, sender: 'agent' }]);
                }
            } catch (e) { }
        };

        room.on("dataReceived", handleData);
        return () => room.off("dataReceived", handleData);
    }, [room]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-8 space-y-8">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-sm font-medium">Ready to start conversation</p>
                </div>
            )}
            {messages.map((msg) => (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[85%] p-5 rounded-2xl text-[15px] leading-7 shadow-sm ${msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                        }`}>
                        <div className={`text-[10px] uppercase tracking-wider mb-2 font-bold ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                            {msg.sender === 'user' ? 'You' : 'Assistant'}
                        </div>
                        {msg.text}
                    </div>
                </motion.div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

function AvatarDisplay({ initialized, setInitialized }) {
    const room = useRoomContext();
    const tracks = useTracks([Track.Source.Camera, Track.Source.Unknown]);

    // Find a video track that is NOT me (i.e., the agent/avatar)
    const agentTrack = tracks.find(t => t.participant.identity !== "me" && t.source === Track.Source.Camera);

    const initAvatar = async () => {
        if (!room) return;
        try {
            const msg = new TextEncoder().encode("init_avatar");
            await room.localParticipant.publishData(msg, { reliable: true });
            setInitialized(true);
        } catch (e) { console.error(e); }
    };

    if (agentTrack) {
        return (
            <div className="w-full h-full relative">
                <VideoTrack trackRef={agentTrack} className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Live Agent</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Ambient Background Animation */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 space-y-8">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 shadow-2xl mx-auto">
                    <span className="text-5xl">🎙️</span>
                </div>

                {!initialized ? (
                    <button
                        onClick={initAvatar}
                        className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm tracking-wide uppercase"
                    >
                        Initialize Avatar
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-center gap-1">
                            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <p className="text-teal-200 text-xs tracking-[0.2em] font-medium uppercase">Connecting...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function LocalVideo() {
    const tracks = useTracks([Track.Source.Camera]);
    const localTrack = tracks.find(t => t.participant.identity === "me");
    if (localTrack) return <VideoTrack trackRef={localTrack} className="w-full h-full object-cover mirror-mode" />;
    return <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">NO CAMERA</div>;
}

function DataListener({ onSummaryReceived }) {
    const room = useRoomContext();
    useEffect(() => {
        if (!room) return;
        const handleData = (payload) => {
            const str = new TextDecoder().decode(payload);
            try {
                const data = JSON.parse(str);
                if (data.type === "summary") {
                    console.log("Summary received:", data.summary);
                    if (onSummaryReceived) onSummaryReceived(data.summary);
                }
            } catch (e) { }
        };
        room.on("dataReceived", handleData);
        return () => room.off("dataReceived", handleData);
    }, [room, onSummaryReceived]);
    return null;
}
