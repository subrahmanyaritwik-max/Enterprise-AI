import React, { useState, useEffect } from "react";
import { useOps } from "../../context/OpsContext";
import {
  ShieldAlert,
  Zap,
  Volume2,
  X,
  ArrowRight,
  Clock,
  Sparkles,
  AlertTriangle
} from "lucide-react";

export const LiveThreatToast = () => {
  const { openMitigationWizard, setIsAudioBriefingOpen, openOrderDetail } = useOps();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show toast automatically after 2.5 seconds to WOW the judges
    const timer = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed top-20 right-6 z-40 max-w-md w-full animate-in slide-in-from-top-5 duration-300 font-sans select-none">
      <div className="bg-slate-900/95 text-white border-2 border-red-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 relative overflow-hidden">
        {/* Glowing Ambient Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert size={18} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CRITICAL THREAT
                </span>
                <span className="text-[11px] text-slate-400 font-mono">LIVE AI SIGNAL</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">
                Order #1042 — 36 Unit Shortage
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setDismissed(true);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Confirmed order of 120 units for <strong className="text-white">ABC Industries</strong> (₹2,40,000) exceeds available stock by 36 units. Delivery SLA at risk for tomorrow.
        </p>

        {/* Quick Action Triggers */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={() => {
              setIsAudioBriefingOpen(true);
              setIsVisible(false);
            }}
            className="text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Volume2 size={13} className="text-blue-400" />
            <span>Voice Brief</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                openOrderDetail("ORD-1042");
                setIsVisible(false);
              }}
              className="text-slate-300 hover:text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Order
            </button>
            <button
              onClick={() => {
                openMitigationWizard("ORD-1042");
                setIsVisible(false);
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-md cursor-pointer"
            >
              <Zap size={12} className="text-yellow-300" />
              <span>Mitigate Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
