import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useOps } from "../context/OpsContext";
import {
  ChevronRight,
  Sparkles,
  Search,
  LayoutDashboard,
  PackageCheck,
  GitMerge,
  CheckSquare,
  ShieldAlert,
  Building2,
  BarChart3,
  FileText,
  Activity,
  Zap,
  Bot,
  Truck,
  ArrowRight,
  Menu,
  X,
  Check,
  Clock,
  Boxes,
  CheckCircle2,
  Cpu,
  Layers,
  AlertTriangle
} from "lucide-react";

// Shared Primitive: Futuristic Robot Avatar SVG Mascot
export const RobotMascot = ({ className = "w-10 h-10", animated = true }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} ${animated ? "animate-bounce" : ""} filter drop-shadow-md`}
    style={{ animationDuration: "3s" }}
  >
    {/* Antenna */}
    <line x1="50" y1="22" x2="50" y2="12" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="10" r="5" fill="#38bdf8" className={animated ? "animate-pulse" : ""} />

    {/* Ears / Side Bolts */}
    <rect x="18" y="38" width="6" height="14" rx="3" fill="#3b82f6" />
    <rect x="76" y="38" width="6" height="14" rx="3" fill="#3b82f6" />

    {/* Head Base */}
    <rect x="24" y="24" width="52" height="42" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

    {/* Face Screen */}
    <rect x="30" y="30" width="40" height="28" rx="7" fill="#020617" stroke="#0284c7" strokeWidth="1.5" />

    {/* Glowing Eyes */}
    <circle cx="41" cy="42" r="5" fill="#38bdf8" className={animated ? "animate-pulse" : ""} />
    <circle cx="59" cy="42" r="5" fill="#38bdf8" className={animated ? "animate-pulse" : ""} />

    {/* Pupils */}
    <circle cx="42" cy="41" r="1.5" fill="#ffffff" />
    <circle cx="60" cy="41" r="1.5" fill="#ffffff" />

    {/* Smile */}
    <path d="M 43 51 Q 50 56 57 51" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

    {/* Neck */}
    <rect x="44" y="66" width="12" height="6" fill="#475569" />

    {/* Body */}
    <path d="M 28 72 Q 50 68 72 72 L 80 88 L 20 88 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
    <circle cx="50" cy="80" r="4" fill="#60a5fa" className={animated ? "animate-pulse" : ""} />
  </svg>
);

// Shared Primitive: OPSpulse Brand Mark
export const LogoMark = ({ className = "w-8 h-8" }) => (
  <div className={`${className} rounded-xl bg-enterprise-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-900/50 border border-enterprise-400/30 shrink-0`}>
    OP
  </div>
);

// Shared Primitive: Action Button
export const ActionButton = ({ label = "Launch Workspace", full = false, onClick, icon: Icon = Sparkles }) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-900/20 ${
      full ? "w-full" : ""
    }`}
  >
    <Icon size={16} className="text-enterprise-600 group-hover:rotate-12 transition-transform" />
    <span>{label}</span>
    <ChevronRight size={15} className="transition-transform group-hover:translate-x-[2px]" />
  </button>
);

// Shared Primitive: SectionEyebrow
export const SectionEyebrow = ({ label, tag }) => (
  <div className="inline-flex items-center gap-2 text-xs text-white/70">
    <span className="w-1.5 h-1.5 rounded-full bg-enterprise-400 animate-ping" />
    <span className="font-semibold uppercase tracking-wider text-enterprise-300">{label}</span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-enterprise-500/30 bg-enterprise-500/10 text-enterprise-400 text-[10px] font-mono font-bold">
        {tag}
      </span>
    )}
  </div>
);

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { setActiveTab, openOrderDetail } = useOps();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [selectedSignalIndex, setSelectedSignalIndex] = useState(0);

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      setActiveTab("overview");
    } else {
      setActiveTab("login");
    }
  };

  const handleInspectIncident = () => {
    openOrderDetail("ORD-1042");
    handleLaunchApp();
  };

  const gradientStyle = {
    backgroundImage:
      "linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    filter: "url(#c3-noise)"
  };

  const operationalSignals = [
    {
      type: "High Risk Incident",
      title: "Order #1042 — ABC Industries",
      desc: "Confirmed sales 120 units vs 84 warehouse stock (36-unit physical shortage). ₹2,40,000 at risk.",
      time: "Scheduled Tomorrow",
      status: "HIGH RISK",
      statusColor: "bg-red-500/20 text-red-400 border-red-500/40",
      department: "Inventory"
    },
    {
      type: "Queue Bottleneck",
      title: "Finance Credit Approvals Backlog",
      desc: "18 commercial orders pending credit clearance. Average delay is 8.7 hrs. ₹18.4 Lakhs stalled.",
      time: "8.7h Delay",
      status: "BOTTLENECK",
      statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      department: "Finance"
    },
    {
      type: "Task SLA Warning",
      title: "TASK-781 Stock Audit — David Chen",
      desc: "Physical recount verification for Order #1042 approaching SLA deadline. Escalation armed.",
      time: "1h 45m left",
      status: "ATTENTION",
      statusColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
      department: "Logistics"
    },
    {
      type: "Completed Workflow",
      title: "Order #1038 — Apex Healthcare",
      desc: "Credit approved for ₹6,50,000. 100% quantity packaged and released to logistics carrier.",
      time: "08:45 AM",
      status: "OPTIMAL",
      statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      department: "Sales"
    },
    {
      type: "Rebalancing Signal",
      title: "Warehouse C (Hub South) Buffer Sync",
      desc: "52 buffer units of SKU-9041 verified and ready for 1-click inter-warehouse transfer.",
      time: "Live Buffer",
      status: "READY",
      statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      department: "Operations"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white selection:bg-brand/30 font-sans">
      {/* Root SVG Noise Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Global Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/75 via-[#0c0c0c]/60 to-[#0c0c0c]" />
      </div>

      {/* Fixed Vertical Guide Lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* SECTION 1 — NAVBAR (Perfect Single-Line Glassmorphism) */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-0 z-40 bg-[#0c0c0c]/85 backdrop-blur-md border-b border-white/5"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            {/* Brand Logo & Version Badge */}
            <div
              className="cursor-pointer flex items-center gap-3 shrink-0 group"
              onClick={() => setActiveTab("landing")}
            >
              <div className="w-8 h-8 rounded-xl bg-enterprise-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-900/50 border border-enterprise-400/30 group-hover:scale-105 transition-transform">
                OP
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight whitespace-nowrap">
                  OPSpulse
                </span>
                <span className="text-[10px] bg-enterprise-500/20 text-enterprise-400 font-bold px-2 py-0.5 rounded-full border border-enterprise-500/30 font-mono whitespace-nowrap">
                  ENTERPRISE 4.5
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
              {[
                { label: "Risk Sentinel", href: "#features" },
                { label: "Cross-Dept Workflows", href: "#features" },
                { label: "PulseBot AI", href: "#features" },
                { label: "Bottlenecks", href: "#features" },
                { label: "Pricing", href: "#pricing" }
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
                  className="text-white/70 hover:text-white text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Right Controls */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button
                onClick={handleLaunchApp}
                className="text-xs font-bold text-white/70 hover:text-white px-3 py-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={handleLaunchApp}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-white/90 active:scale-[0.98] text-slate-900 font-bold text-xs px-5 py-2.5 transition-all shadow-md shadow-blue-900/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles size={14} className="text-enterprise-600 group-hover:rotate-12 transition-transform" />
                <span>Launch Workspace</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white shrink-0"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 border-b border-white/10 px-6 py-4 space-y-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
            {[
              { label: "Risk Sentinel", href: "#features" },
              { label: "Cross-Dept Workflows", href: "#features" },
              { label: "PulseBot AI", href: "#features" },
              { label: "Bottlenecks", href: "#features" },
              { label: "Pricing", href: "#pricing" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-white/80 py-1.5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleLaunchApp}
                className="flex-1 text-xs font-bold text-slate-300 py-2.5 rounded-lg border border-white/10 bg-white/5"
              >
                Sign In
              </button>
              <button
                onClick={handleLaunchApp}
                className="flex-1 text-xs font-bold text-slate-900 py-2.5 rounded-lg bg-white"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2 — HERO WITH AI ROBOT COMPANION */}
        <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center flex flex-col items-center">
          {/* Pulsing Robot AI Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 bg-enterprise-950/80 border border-enterprise-500/40 px-4 py-2 rounded-full shadow-lg backdrop-blur-md mb-6"
          >
            <RobotMascot className="w-6 h-6" animated />
            <span className="text-xs font-bold text-enterprise-300">PulseBot Autonomous AI Engine Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[0.95]"
          >
            <span className="block text-white">Your operations.</span>
            <span className="block animate-shiny mt-2" style={gradientStyle}>
              Revitalized
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 text-white/60 max-w-lg text-base leading-[1.6]"
          >
            OPSpulse is the premier AI-powered operations intelligence platform. Centralize fragmented workflows across Sales, Finance, Inventory, Operations, and Logistics into one high-clarity command center.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <ActionButton label="Launch Command Center" onClick={handleLaunchApp} />
            <button
              onClick={handleInspectIncident}
              className="rounded-full border border-white/15 text-white text-sm font-medium px-6 py-3.5 hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert size={16} className="text-red-400" />
              <span>Inspect Order #1042 Incident</span>
            </button>
          </motion.div>
        </section>

        {/* SECTION 3 — MACOS MENU BAR TELEMETRY STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
        >
          <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-5">
              <div className="w-3.5 h-3.5 rounded bg-enterprise-600 text-white font-black text-[9px] flex items-center justify-center">
                OP
              </div>
              <span className="font-bold text-white tracking-tight">OPSpulse Intelligence</span>
              {["Signals", "Workflows", "Task SLAs", "Risk Sentinel", "Bottlenecks", "PulseBot AI"].map((item, idx) => (
                <span
                  key={item}
                  className={`text-white/60 hover:text-white cursor-pointer transition-colors ${
                    idx > 4 ? "hidden md:inline" : idx > 3 ? "hidden sm:inline" : "inline"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-emerald-400 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>5 DEPARTMENTS SYNCHRONIZED</span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4 — REAL-TIME OPERATIONAL MOCKUP */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
          >
            {/* Title Bar */}
            <div className="h-10 bg-black/50 border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] inline-block" />
              </div>
              <span className="text-xs text-white/50 font-medium font-mono">
                OPSpulse Command Center — Real-time Operational Stream
              </span>
              <div className="flex items-center gap-2 text-[10px] text-enterprise-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-enterprise-400 animate-pulse" />
                LIVE ERP STREAM
              </div>
            </div>

            {/* Body 12-col Grid */}
            <div className="grid grid-cols-12 h-[560px] text-xs">
              {/* Left Sidebar: col-span-3 */}
              <div className="col-span-12 md:col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <button
                    onClick={handleLaunchApp}
                    className="w-full rounded-lg bg-enterprise-600 hover:bg-enterprise-500 text-white text-xs font-semibold px-3 py-2.5 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Zap size={14} className="text-yellow-300" />
                    <span>Run AI Mitigation Wizard</span>
                  </button>

                  <div className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: "Overview", count: "Live", active: true },
                      { icon: PackageCheck, label: "Active Orders", count: 24 },
                      { icon: GitMerge, label: "Workflows", count: 8 },
                      { icon: CheckSquare, label: "Tasks & SLAs", count: 3 },
                      { icon: ShieldAlert, label: "Risks Center", count: 1, alert: true },
                      { icon: BarChart3, label: "Bottlenecks", count: "8.7h" }
                    ].map((nav) => {
                      const Icon = nav.icon;
                      return (
                        <div
                          key={nav.label}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                            nav.active ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={14} className={nav.alert ? "text-red-400" : ""} />
                            <span>{nav.label}</span>
                          </div>
                          {nav.count && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              nav.alert ? "bg-red-500/20 text-red-300 font-bold" : "text-white/40"
                            }`}>
                              {nav.count}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest block">
                    Connected Departments
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { label: "Sales & Orders", color: "#38bdf8", status: "Optimal" },
                      { label: "Finance & Credit", color: "#f59e0b", status: "Bottleneck" },
                      { label: "Inventory Warehouse", color: "#ef4444", status: "Shortage" },
                      { label: "Logistics Dispatch", color: "#10b981", status: "Ready" }
                    ].map((l) => (
                      <div key={l.label} className="flex items-center justify-between text-white/60 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          <span>{l.label}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/40">{l.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Operational Stream: col-span-4 */}
              <div className="col-span-12 md:col-span-4 border-r border-white/10 flex flex-col bg-black/10 overflow-hidden">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Live Incident Feed</span>
                  <span className="text-[10px] font-mono text-enterprise-400">5 Telemetry Streams</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {operationalSignals.map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSignalIndex(idx)}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedSignalIndex === idx
                          ? "bg-white/10"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-white/40 uppercase">{m.department}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${m.statusColor}`}>
                          {m.status}
                        </span>
                      </div>
                      <p className={`font-semibold text-xs truncate mb-0.5 ${
                        selectedSignalIndex === idx ? "text-white" : "text-white/90"
                      }`}>
                        {m.title}
                      </p>
                      <p className="text-white/40 text-[11px] line-clamp-2 leading-snug">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Detail & PulseBot AI Analysis: col-span-5 */}
              <div className="col-span-12 md:col-span-5 p-5 flex flex-col justify-between overflow-y-auto bg-black/20">
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={16} className="text-red-400" />
                      <span className="font-bold text-xs text-white">Incident Diagnostics</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded">
                      IMMEDIATE ACTION
                    </span>
                  </div>

                  {/* Incident Header */}
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {operationalSignals[selectedSignalIndex].title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-white/50 text-[11px]">
                      <span>Client: ABC Industries</span>
                      <span>Value: ₹2,40,000</span>
                    </div>
                  </div>

                  {/* Robot PulseBot AI Summary Card */}
                  <div className="liquid-glass rounded-xl p-4 space-y-2 border border-enterprise-500/30 bg-enterprise-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-enterprise-300">
                        <RobotMascot className="w-5 h-5" animated={false} />
                        <span>PulseBot Autonomous Analysis</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">99.4% Match</span>
                    </div>
                    <p className="text-white/80 text-[11px] leading-relaxed">
                      Confirmed order of <strong>120 units</strong> exceeds available warehouse stock by <strong>36 units</strong>. Auto-rebalance recommended from <strong>Warehouse C (Hub South)</strong> with 52 units in buffer.
                    </p>
                  </div>

                  {/* Discrepancy Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="liquid-glass p-2.5 rounded-lg border border-white/10">
                      <span className="text-[10px] text-white/40 block">Ordered</span>
                      <span className="font-bold text-white">120 units</span>
                    </div>
                    <div className="liquid-glass p-2.5 rounded-lg border border-white/10">
                      <span className="text-[10px] text-white/40 block">Physical</span>
                      <span className="font-bold text-amber-400">84 units</span>
                    </div>
                    <div className="liquid-glass p-2.5 rounded-lg border border-red-500/30 bg-red-500/10">
                      <span className="text-[10px] text-red-400 block">Shortage</span>
                      <span className="font-bold text-red-400">36 units</span>
                    </div>
                  </div>
                </div>

                {/* Mitigation Action Trigger */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={handleLaunchApp}
                    className="flex-1 bg-enterprise-600 hover:bg-enterprise-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap size={13} className="text-yellow-300" />
                    <span>Run 1-Click AI Mitigation</span>
                  </button>
                  <button
                    onClick={handleInspectIncident}
                    className="bg-white/10 hover:bg-white/15 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 5 — AUTONOMOUS AI ROBOT AGENTS */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <SectionEyebrow label="Autonomous Agents" tag="OPSpulse Intelligence" />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
              Multi-Agent AI Network <br /> Working in Harmony.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Specialized autonomous bots continuously monitor live operational signals across your entire enterprise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Robot 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="liquid-glass rounded-2xl p-6 space-y-4 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
                  <RobotMascot className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Risk Sentinel Bot</h3>
                  <span className="text-[10px] font-mono text-enterprise-400 block mt-0.5">
                    Continuous Discrepancy Detection
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Scans ERP sales orders against real-time physical inventory counts, instantly flagging quantity shortages before items enter fulfillment.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
                <span>Latency: &lt;120ms</span>
                <span className="text-emerald-400 font-bold">100% Active</span>
              </div>
            </motion.div>

            {/* Robot 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="liquid-glass rounded-2xl p-6 space-y-4 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">SLA Auto-Escalation Bot</h3>
                  <span className="text-[10px] font-mono text-purple-300 block mt-0.5">
                    Automated Deadline Safeguards
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Monitors task deadlines across departments. Automatically escalates stalled tickets to Department Heads before SLA breach occurs.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
                <span>Auto-Reassignment</span>
                <span className="text-emerald-400 font-bold">Armed</span>
              </div>
            </motion.div>

            {/* Robot 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="liquid-glass rounded-2xl p-6 space-y-4 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Mitigation Rebalancer Bot</h3>
                  <span className="text-[10px] font-mono text-amber-300 block mt-0.5">
                    1-Click Autonomous Stock Rebalance
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Identifies surplus buffer units in secondary regional depots, calculates transit times, and dispatches automated carrier transfer manifests.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
                <span>Cost Optimized</span>
                <span className="text-emerald-400 font-bold">Ready</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 6 — LOGOCLOUD */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40 font-mono">
            Trusted by Leaders in Modern Supply Chains & Enterprise Operations
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
            {[
              "ABC Industries",
              "Apex Healthcare",
              "GlobalTech Logistics",
              "Horizon Retail",
              "Vertex Aerospace",
              "Titan Industrial",
              "Nexus Energy",
              "OmniCorp"
            ].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="text-xs font-bold tracking-tight text-white/50 hover:text-white transition-colors cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 7 — TESTIMONIALS */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "OPSpulse detected an inventory shortfall of 36 units on our biggest client order before our warehouse opened. Saved ₹2.40 Lakhs in SLA penalties.",
                name: "Marcus Vance",
                role: "Head of Inventory & Logistics",
                company: "SUPPLY CHAIN CO"
              },
              {
                quote: "The Finance Bottleneck detector showed our credit queue was stalling for 8.7 hours. We unblocked 18 orders in one morning.",
                name: "Robert Sterling",
                role: "Head of Commercial Finance",
                company: "FINANCE OPS"
              },
              {
                quote: "PulseBot AI gives our executive team an instant daily briefing with zero manual spreadsheet collation. It's like operating 10 years in the future.",
                name: "Sarah Jenkins",
                role: "VP Enterprise Operations",
                company: "GLOBALTECH"
              }
            ].map((t, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between"
              >
                <blockquote className="text-sm text-white/80 leading-[1.6]">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                  <div className="text-xs text-white font-semibold tracking-wide font-mono">
                    {t.company}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* SECTION 8 — PRICING */}
        <section id="pricing" className="c3-pricing-section">
          {/* Pricing SVG Noise Filter */}
          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <filter id="c3-noise-pricing">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.075" />
                </feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="in" result="noise" />
                <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
              </filter>
            </defs>
          </svg>

          {/* Giant Watermark Headline */}
          <div className="c3-watermark-container">
            <div className="c3-watermark-main">
              <span className="c3-watermark-line-1">Your operations.</span>
              <span className="c3-watermark-line-2">Revitalized</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="c3-grid">
            {/* Starter */}
            <div className="c3-card">
              <div className="c3-tier-small">Starter Workspace</div>
              <div className="c3-tier-large">Free</div>
              <div className="c3-desc">For small operational teams tracking up to 50 active orders.</div>
              <ul className="c3-list">
                {[
                  "Up to 50 active ERP orders",
                  "Basic risk anomaly detection",
                  "Single department dashboard",
                  "Standard daily brief export",
                  "Community support"
                ].map((item, idx) => (
                  <li key={idx}>
                    <span className="c3-check">
                      <Check size={14} className="text-white" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="c3-btn" onClick={handleLaunchApp}>
                Launch Starter
              </button>
            </div>

            {/* Enterprise Pro */}
            <div className="c3-card">
              <div className="c3-tier-small">Enterprise Pro</div>
              <div className="c3-tier-large">{yearly ? "₹79,999/y" : "₹7,999/m"}</div>
              <div className="c3-desc">
                For growing multi-department enterprises with SLA safeguards.
              </div>
              <ul className="c3-list">
                {[
                  "Unlimited active ERP orders",
                  "Autonomous PulseBot AI Copilot",
                  "Cross-department live telemetry",
                  "1-Click AI stock rebalancing",
                  "SLA breach auto-escalation"
                ].map((item, idx) => (
                  <li key={idx}>
                    <span className="c3-check">
                      <Check size={14} className="text-white" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="c3-btn" onClick={handleLaunchApp}>
                Launch Enterprise
              </button>
            </div>

            {/* Global Scaled */}
            <div className="c3-card c3-card-pro">
              <div className="c3-tier-small">Global Scaled</div>
              <div className="c3-tier-large">{yearly ? "₹1,99,999/y" : "₹19,999/m"}</div>
              <div className="c3-desc">
                For global enterprise supply chains and multi-warehouse networks.
              </div>
              <ul className="c3-list">
                {[
                  "Multi-regional warehouse networks",
                  "Custom Gemini AI workflow agents",
                  "Executive Voice Briefing Studio",
                  "SOC-2 Type II audit compliance",
                  "24/7 dedicated operational architect"
                ].map((item, idx) => (
                  <li key={idx}>
                    <span className="c3-check">
                      <Check size={14} className="text-white" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="c3-btn" onClick={handleLaunchApp}>
                Contact Architecture
              </button>
            </div>
          </div>

          {/* Toggle Wrap */}
          <div className="c3-toggle-wrap">
            <span className="text-sm text-white/60 font-medium">Annual Enterprise Billing (Save 20%)</span>
            <button
              type="button"
              onClick={() => setYearly(!yearly)}
              className={`c3-toggle ${yearly ? "active" : ""}`}
            >
              <div className="c3-toggle-knob" />
            </button>
          </div>
        </section>

        {/* SECTION 9 — FINAL CTA WITH ROBOT */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10"
          >
            {/* Radial glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(600px circle at 50% 0%, rgba(59, 130, 246, 0.25), transparent 70%)",
                opacity: 0.4
              }}
            />

            <div className="flex justify-center mb-6">
              <RobotMascot className="w-16 h-16" />
            </div>

            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-white">
              Stop operating in silos. <br /> Open your command center.
            </h2>

            <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
              Join the operational leaders and supply chain directors using OPSpulse to eliminate fulfillment bottlenecks.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ActionButton label="Launch OPSpulse Workspace" onClick={handleLaunchApp} />
              <button
                onClick={handleInspectIncident}
                className="rounded-full border border-white/15 text-white text-sm font-medium px-6 py-3.5 hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldAlert size={16} className="text-red-400" />
                <span>See Live Incident Demo</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-white/40">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LogoMark className="w-6 h-6 text-xs" />
              <span className="font-bold text-white/80 text-sm">OPSpulse Enterprise</span>
            </div>
            <p>&copy; 2026 OPSpulse Operational Intelligence Systems, Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
