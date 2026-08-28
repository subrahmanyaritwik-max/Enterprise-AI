import React, { useState, useEffect, useRef } from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  ShieldAlert,
  Zap,
  Bot,
  RefreshCw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers
} from "lucide-react";

export const PulseBotRobot = () => {
  const {
    overview,
    orders,
    tasks,
    risks,
    setActiveTab,
    openOrderDetail,
    openMitigationWizard,
    setIsDailyBriefOpen,
    setIsAudioBriefingOpen,
    escalateTask,
    isPulseBotOpen,
    setIsPulseBotOpen
  } = useOps();
  const { user } = useAuth();

  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const [hasPrompted, setHasPrompted] = useState(true);
  const [speechBubbleText, setSpeechBubbleText] = useState(`Hi ${firstName}! 1 urgent inventory risk detected on Order #1042. Click me for instant AI intelligence! 🤖`);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  // Update speech bubble if user changes
  useEffect(() => {
    if (user?.name) {
      setSpeechBubbleText(`Hi ${user.name.split(" ")[0]}! 1 urgent inventory risk detected on Order #1042. Click me for instant AI intelligence! 🤖`);
    }
  }, [user]);

  // Play futuristic UI chime using Web Audio API
  const playChime = (type = "chime") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "chime") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === "pop") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio context might be restricted before first gesture
    }
  };

  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "bot",
      time: "Just now",
      text: `Hello **${user?.name || "Operations Lead"}**! I am **PulseBot AI**, your autonomous operational intelligence copilot. I am actively monitoring live ERP signals across **Sales, Finance, Inventory, Operations, and Logistics**.`,
      suggestions: [
        "🚨 Analyze Order #1042 Shortage",
        "⚡ Run 1-Click AI Mitigation",
        "📊 Show Finance Bottlenecks",
        "🎙️ Play Executive Voice Briefing"
      ]
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    playChime("pop");

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      time: "Just now",
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Context-aware smart AI answer generator
    setTimeout(() => {
      setIsTyping(false);
      playChime("chime");
      const lower = text.toLowerCase();
      let botResponse = {};

      if (lower.includes("1042") || lower.includes("shortage") || lower.includes("risk") || lower.includes("order")) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `### 🚨 Critical Operational Alert: Order #1042\n* **Client:** ABC Industries (Tier-1 Strategic Partner)\n* **Value at Risk:** ₹2,40,000\n* **Root Discrepancy:** Confirmed Sales Order is **120 units** of \`SKU-9041\`, but physical warehouse count is **84 units** (**36-unit physical shortage**).\n* **Dispatch SLA:** Scheduled for **Tomorrow at 5:00 PM**.\n\n**AI Recommendation:** Reallocate 36 available buffer units from *Warehouse C (South Hub)* or trigger split fulfillment immediately.`,
          action: {
            label: "⚡ Run 1-Click AI Mitigation Wizard",
            onClick: () => {
              openMitigationWizard("ORD-1042");
            }
          },
          secondaryAction: {
            label: "Inspect Order #1042 Record",
            onClick: () => {
              openOrderDetail("ORD-1042");
            }
          },
          suggestions: ["⚡ Run 1-Click AI Mitigation", "🛡️ Escalate Task TASK-781", "📊 Show Finance Bottlenecks"]
        };
      } else if (lower.includes("mitigat") || lower.includes("fix") || lower.includes("resolve") || lower.includes("wizard")) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `Opening the **Autonomous AI Mitigation Wizard** now! You can rebalance warehouse stocks, notify logistics drivers, and alert ABC Industries with a verified audit trail.`,
          action: {
            label: "Open Mitigation Wizard Popup",
            onClick: () => {
              openMitigationWizard("ORD-1042");
            }
          }
        };
        openMitigationWizard("ORD-1042");
      } else if (lower.includes("bottleneck") || lower.includes("finance") || lower.includes("delay")) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `### ⏳ Operational Bottleneck Detected: Finance Approval Queue\n* **Backlog:** 18 commercial orders awaiting credit sign-off.\n* **Average Delay:** **8.7 hours** (exceeding target SLA of 2.0 hrs).\n* **Total Stalled Capital:** **₹18.4 Lakhs**.\n\n**Suggested Action:** Trigger automated finance threshold override for orders under ₹5,00,000.`,
          action: {
            label: "View Bottleneck Analytics",
            onClick: () => {
              setActiveTab("analytics");
            }
          },
          suggestions: ["🚨 Analyze Order #1042 Shortage", "📋 Generate Daily Brief"]
        };
      } else if (lower.includes("task") || lower.includes("escalat") || lower.includes("781")) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `### 🛡️ Task SLA Status: TASK-781\n* **Task:** Physical stock count audit for Order #1042.\n* **Assignee:** David Chen (Senior Inventory Specialist).\n* **SLA Status:** **Deadline Approaching (Under 2 hours remaining)**.\n\nClick below to immediately escalate this task to Department Head *Marcus Vance*.`,
          action: {
            label: "🚨 Escalate TASK-781 Now",
            onClick: async () => {
              await escalateTask("TASK-781");
              setActiveTab("tasks");
            }
          },
          suggestions: ["🚨 Analyze Order #1042 Shortage", "📊 Show Finance Bottlenecks"]
        };
      } else if (lower.includes("voice") || lower.includes("audio") || lower.includes("brief") || lower.includes("listen")) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `Launching the **Executive AI Voice Briefing Studio** with synthesized audio narration of today's operational posture and top mitigation priorities.`,
          action: {
            label: "🎙️ Open Voice Briefing Player",
            onClick: () => {
              setIsAudioBriefingOpen(true);
            }
          }
        };
        setIsAudioBriefingOpen(true);
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          time: "Just now",
          text: `I've synthesized operational telemetry across all 5 departments for query: *"${text}"*.\n\n* **System Status:** 5 Active Departments Synchronized\n* **Highest Priority:** Order #1042 (36-unit physical shortage)\n* **SLA Compliance:** 88.4% overall compliance\n\nHow would you like me to assist next?`,
          suggestions: [
            "🚨 Analyze Order #1042 Shortage",
            "⚡ Run 1-Click AI Mitigation",
            "📊 Show Finance Bottlenecks",
            "🎙️ Play Executive Voice Briefing"
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 700);
  };

  return (
    <>
      {/* ROBOT AVATAR BUTTON (Anchored bottom-right, elevated on mobile) */}
      <div className="fixed bottom-18 md:bottom-6 right-3 sm:right-6 z-40 flex flex-row-reverse items-center gap-3 select-none">
        <div className="relative group">
          {/* Animated Speech Bubble */}
          {hasPrompted && !isPulseBotOpen && (
            <div className="absolute -top-20 right-0 bg-slate-900/95 text-white border border-enterprise-500/40 text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md w-72 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-2">
                <p className="leading-snug text-[11px] text-slate-200">
                  <span className="text-enterprise-400 font-bold">PulseBot AI:</span> {speechBubbleText}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasPrompted(false);
                  }}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
              {/* Pointer triangle */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-enterprise-500/40 rotate-45" />
            </div>
          )}

          {/* Interactive Floating Robot Mascot */}
          <button
            onClick={() => {
              playChime("pop");
              setIsPulseBotOpen(!isPulseBotOpen);
              setHasPrompted(false);
            }}
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-900 via-enterprise-950 to-slate-900 border-2 border-enterprise-500/60 p-1 shadow-2xl shadow-enterprise-900/60 hover:scale-105 hover:border-enterprise-400 transition-all duration-300 flex items-center justify-center cursor-pointer group"
            title="Ask PulseBot AI Copilot"
          >
            {/* Glowing Pulse Aura */}
            <div className="absolute inset-0 rounded-2xl bg-enterprise-500/20 animate-ping pointer-events-none" />

            {/* Custom High-Tech Robot SVG Mascot */}
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 text-enterprise-400 filter drop-shadow-md animate-bounce duration-1000"
              style={{ animationDuration: "3s" }}
            >
              {/* Antenna */}
              <line x1="50" y1="22" x2="50" y2="12" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="10" r="5" fill="#38bdf8" className="animate-pulse" />

              {/* Ears / Head bolts */}
              <rect x="18" y="38" width="6" height="14" rx="3" fill="#3b82f6" />
              <rect x="76" y="38" width="6" height="14" rx="3" fill="#3b82f6" />

              {/* Head Base */}
              <rect x="24" y="24" width="52" height="42" rx="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />

              {/* Face Screen */}
              <rect x="30" y="30" width="40" height="28" rx="7" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />

              {/* Glowing Robot Eyes (Animated Blink) */}
              <circle cx="41" cy="42" r="5" fill="#38bdf8" className="animate-pulse" />
              <circle cx="59" cy="42" r="5" fill="#38bdf8" className="animate-pulse" />

              {/* Eye pupils */}
              <circle cx="42" cy="41" r="1.5" fill="#ffffff" />
              <circle cx="60" cy="41" r="1.5" fill="#ffffff" />

              {/* Smiling Robot Mouth */}
              <path d="M 43 51 Q 50 56 57 51" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Neck & Shoulders */}
              <rect x="44" y="66" width="12" height="6" fill="#475569" />
              <path d="M 28 72 Q 50 68 72 72 L 80 88 L 20 88 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              
              {/* Chest core glow */}
              <circle cx="50" cy="80" r="4" fill="#60a5fa" className="animate-pulse" />
            </svg>

            {/* Online Status LED Indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </button>
        </div>

        {/* Mascot Quick Title Pill */}
        <div
          onClick={() => {
            playChime("pop");
            setIsPulseBotOpen(true);
            setHasPrompted(false);
          }}
          className="hidden sm:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-full shadow-lg cursor-pointer backdrop-blur-md transition-all group"
        >
          <Sparkles size={13} className="text-enterprise-400 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-xs font-bold tracking-tight">PulseBot AI</span>
          <span className="text-[10px] bg-enterprise-500/20 text-enterprise-300 font-semibold px-1.5 py-0.5 rounded border border-enterprise-500/30">
            COPILOT
          </span>
        </div>
      </div>

      {/* EXPANDED AI ASSISTANT CHAT WINDOW (Floating at Right) */}
      {isPulseBotOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans ${
            isExpanded
              ? "bottom-4 md:bottom-6 right-2 sm:right-6 w-[560px] max-w-[96vw] h-[85vh]"
              : "bottom-20 md:bottom-24 right-2 sm:right-6 w-[430px] max-w-[96vw] h-[78vh] max-h-[580px]"
          }`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-enterprise-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-enterprise-600/30 border border-enterprise-500/50 flex items-center justify-center text-enterprise-400">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">PulseBot AI</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE 4.5 TURBO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Autonomous Operations Intelligence Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute audio" : "Enable audio chimes"}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsPulseBotOpen(false)}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="bg-navy-950/60 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert size={13} className="text-red-400" />
              1 Critical Risk Active: <strong className="text-white font-bold">Order #1042</strong>
            </span>
            <button
              onClick={() => {
                openMitigationWizard("ORD-1042");
              }}
              className="text-enterprise-400 hover:text-enterprise-300 font-bold underline cursor-pointer"
            >
              Resolve Discrepancy &rarr;
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-enterprise-600/30 border border-enterprise-500/40 flex items-center justify-center text-enterprise-400 shrink-0 mt-0.5">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-md leading-relaxed ${
                    m.sender === "user"
                      ? "bg-enterprise-600 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none"
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-normal">
                    {m.text}
                  </div>

                  {/* Interactive Action Buttons inside Bot Message */}
                  {m.action && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={m.action.onClick}
                        className="bg-enterprise-600 hover:bg-enterprise-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[11px] shadow-sm cursor-pointer"
                      >
                        <Zap size={12} className="text-yellow-300" />
                        <span>{m.action.label}</span>
                      </button>
                      {m.secondaryAction && (
                        <button
                          onClick={m.secondaryAction.onClick}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-3 py-1.5 rounded-lg transition-colors text-[11px] cursor-pointer"
                        >
                          {m.secondaryAction.label}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quick Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Recommended Prompts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(s)}
                            className="bg-slate-900/80 hover:bg-enterprise-950 text-slate-300 hover:text-white border border-slate-700 hover:border-enterprise-500 text-[10px] font-medium px-2.5 py-1 rounded-full transition-all text-left"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-enterprise-600/30 border border-enterprise-500/40 flex items-center justify-center text-enterprise-400 shrink-0">
                  <Bot size={16} className="animate-spin" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-enterprise-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-enterprise-400 animate-pulse delay-75" />
                  <span className="w-2 h-2 rounded-full bg-enterprise-400 animate-pulse delay-150" />
                  <span className="text-[11px] font-medium text-slate-300 ml-1">Synthesizing operational signals...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Carousel */}
          <div className="px-3 py-2 bg-navy-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              "🚨 Order #1042",
              "⚡ Run Mitigation",
              "📊 Finance Queue",
              "🛡️ Task SLA",
              "🎙️ Voice Brief"
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shrink-0 border border-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about orders, stock, risks, SLA..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-enterprise-500 focus:ring-1 focus:ring-enterprise-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="bg-enterprise-600 hover:bg-enterprise-500 disabled:bg-slate-800 text-white p-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
