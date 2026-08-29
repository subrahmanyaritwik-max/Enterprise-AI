import React, { useState } from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import { Play, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, HelpCircle, RefreshCw } from "lucide-react";

export const HackathonDemoBar = () => {
  const { setActiveTab, setSelectedOrderId, escalateTask, setIsDailyBriefOpen, setIsAskOpsOpen, refreshData } = useOps();
  const { switchRole } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Demo Workspace Login",
      subtitle: "Logged in as Executive Manager Sarah Jenkins",
      action: () => {
        switchRole("Executive / Manager");
        setActiveTab("overview");
      }
    },
    {
      title: "2. Overview Dashboard",
      subtitle: "Spot 5 attention items & Order #1042 High Risk alert",
      action: () => {
        setActiveTab("overview");
      }
    },
    {
      title: "3. Order #1042 Deep Dive",
      subtitle: "Review 120 ordered vs 84 stock shortage & ₹2,40,000 value",
      action: () => {
        setSelectedOrderId("ORD-1042");
        setActiveTab("order-detail");
      }
    },
    {
      title: "4. Workflow Stage Analysis",
      subtitle: "Sales ✓ Finance ✓ Inventory ⚠ (Blocked)",
      action: () => {
        setActiveTab("workflows");
      }
    },
    {
      title: "5. Inventory Task TASK-781",
      subtitle: "Review stock audit task assigned to Inventory Manager",
      action: () => {
        setActiveTab("tasks");
      }
    },
    {
      title: "6. SLA Breach Auto-Escalation",
      subtitle: "Trigger SLA breach -> Escalated to Dept Head Marcus Vance",
      action: async () => {
        await escalateTask("TASK-781");
        setActiveTab("tasks");
      }
    },
    {
      title: "7. Bottleneck Analytics",
      subtitle: "Finance approval queue backlog (18 items, 8.7h delay)",
      action: () => {
        setActiveTab("analytics");
      }
    },
    {
      title: "8. Generate Daily Brief",
      subtitle: "Executive AI briefing & top 3 action priorities",
      action: () => {
        setIsDailyBriefOpen(true);
      }
    },
    {
      title: "9. Ask Operations AI",
      subtitle: "NL Decision Support: 'Which issue should I prioritize first?'",
      action: () => {
        setIsAskOpsOpen(true);
      }
    }
  ];

  const handleNext = () => {
    const nextStep = (currentStep + 1) % steps.length;
    setCurrentStep(nextStep);
    steps[nextStep].action();
  };

  const handleReset = () => {
    setCurrentStep(0);
    steps[0].action();
    refreshData();
  };

  return (
    <div className="bg-navy-900 border-b border-navy-800 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm z-30">
      <div className="flex items-center gap-2">
        <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
          <Play size={10} fill="currentColor" /> Hackathon Demo Walkthrough
        </span>
        <span className="text-slate-300 font-medium hidden md:inline">
          Interactive Scenario: <strong className="text-white">Order #1042 Supply Chain Delay</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
          <span className="font-semibold text-blue-400">Step {currentStep + 1}/{steps.length}:</span>
          <span>{steps[currentStep].title}</span>
          <span className="text-slate-500">—</span>
          <span className="text-slate-400 italic">{steps[currentStep].subtitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-semibold px-3 py-1 rounded flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Next Demo Step</span>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={handleReset}
            title="Reset Demo State"
            className="bg-navy-800 hover:bg-navy-700 text-slate-300 px-2 py-1 rounded flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
