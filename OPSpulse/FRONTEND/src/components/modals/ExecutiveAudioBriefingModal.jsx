import React, { useState, useEffect } from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sliders
} from "lucide-react";

export const ExecutiveAudioBriefingModal = () => {
  const { isAudioBriefingOpen, setIsAudioBriefingOpen, openMitigationWizard, openOrderDetail } = useOps();
  const { user } = useAuth();

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(25);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);

  const speechSegments = [
    {
      title: "Operational Posture Overview",
      text: `Good day ${user?.name || "Operations Lead"}. OPSpulse has aggregated telemetry across Sales, Finance, Inventory, Operations, and Logistics. Current operational health score is 91% with 1 high-priority bottleneck requiring immediate management attention.`
    },
    {
      title: "High-Risk Threat: Order #1042 Shortage",
      text: "Order #1042 for ABC Industries valued at ₹2,40,000 has a 36-unit physical stock deficit on SKU-9041. Delivery is scheduled for tomorrow at 5:00 PM. AI recommends reallocating 36 units from Warehouse C."
    },
    {
      title: "Finance Approval Queue Backlog",
      text: "18 commercial orders are currently delayed in the finance credit approval queue, averaging 8.7 hours of stall time. Total delayed pipeline value is ₹18.4 Lakhs."
    },
    {
      title: "Top Recommended Action",
      text: "Authorize the 1-click inter-warehouse inventory rebalancing for Order #1042 to prevent SLA breach and protect tier-1 client trust."
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isAudioBriefingOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 3;
          const segIdx = Math.min(Math.floor((next / 100) * speechSegments.length), speechSegments.length - 1);
          setActiveSpeechIndex(segIdx);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAudioBriefingOpen, isPlaying]);

  if (!isAudioBriefingOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col animate-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-navy-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-enterprise-600/30 border border-enterprise-500/50 flex items-center justify-center text-enterprise-400">
              <Volume2 size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">Executive AI Voice Briefing</h3>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  SYNTHESIZED AUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Daily Operational Intelligence Telemetry</p>
            </div>
          </div>

          <button
            onClick={() => setIsAudioBriefingOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Audio Visualizer Waves */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-navy-950 to-slate-900">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
            {/* Animated Sound Spectrum Bars */}
            <div className="flex items-center justify-center gap-1.5 h-16">
              {[40, 65, 80, 45, 95, 70, 85, 60, 90, 75, 50, 85, 65, 95, 40, 80, 60, 90, 70, 50].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isPlaying ? "bg-enterprise-400 animate-pulse" : "bg-slate-700"
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) % 60)}px` : "12px",
                    animationDelay: `${i * 75}ms`
                  }}
                />
              ))}
            </div>

            {/* Segment Title & Live Text Highlight */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-enterprise-400 uppercase tracking-widest block">
                {speechSegments[activeSpeechIndex].title}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium min-h-[50px]">
                "{speechSegments[activeSpeechIndex].text}"
              </p>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="space-y-2 pt-2">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-enterprise-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>00:{progress < 10 ? `0${Math.floor(progress / 3)}` : Math.floor(progress / 3)}</span>
                <span>00:33</span>
              </div>
            </div>

            {/* Audio Play/Pause Button */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={() => {
                  setProgress(0);
                  setActiveSpeechIndex(0);
                  setIsPlaying(true);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                title="Restart"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-enterprise-600 hover:bg-enterprise-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 transition-all hover:scale-105 cursor-pointer"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>

              <div className="w-8" />
            </div>
          </div>

          {/* Quick Action Highlight */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-red-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-white">Recommended Action from Audio Brief</h4>
                <p className="text-[11px] text-slate-300">Run 1-Click Mitigation on Order #1042</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAudioBriefingOpen(false);
                openMitigationWizard("ORD-1042");
              }}
              className="bg-enterprise-600 hover:bg-enterprise-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <Zap size={13} className="text-yellow-300" />
              <span>Mitigate Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
