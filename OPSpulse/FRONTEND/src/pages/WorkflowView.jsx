import React from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import { GitMerge, ArrowRight, ShieldAlert, CheckCircle2, Clock, UserCheck, AlertTriangle } from "lucide-react";

export const WorkflowView = () => {
  const { workflows, openOrderDetail } = useOps();

  const stages = workflows?.stages || [
    { name: "Sales Confirmation", status: "Completed", owner: "Sales Team", duration: "30 mins", deadline: "Yesterday, 3:30 PM" },
    { name: "Finance Credit Approval", status: "Completed", owner: "Finance Team", duration: "2h 15m", deadline: "Yesterday, 6:00 PM" },
    { name: "Inventory Availability Verification", status: "Blocked", owner: "Inventory Team (David Chen)", duration: "5h 24m waiting", deadline: "Today, 4:00 PM", reasonBlocked: "Quantity discrepancy: 120 ordered vs 84 physically available." },
    { name: "Operations & Packing", status: "Pending", owner: "Fulfillment Operations", duration: "0 mins", deadline: "Tomorrow, 10:00 AM" },
    { name: "Logistics Dispatch & Delivery", status: "Scheduled", owner: "Logistics Team", duration: "Pending", deadline: "Tomorrow, 5:00 PM" }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GitMerge size={24} className="text-enterprise-600" />
            Visual Workflow Monitor — Order Fulfillment Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Stage-by-stage process visualization highlighting operational bottlenecks and blocked stages.
          </p>
        </div>

        <button
          onClick={() => openOrderDetail("ORD-1042")}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>Inspect Order #1042</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Visual Horizontal Pipeline Flow */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Order: #1042 (ABC Industries)
          </span>
          <span className="bg-red-100 text-red-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            BLOCKED STAGE DETECTED
          </span>
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === "Completed";
            const isBlocked = stage.status === "Blocked";

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border relative flex flex-col justify-between space-y-3 transition-all ${
                  isBlocked
                    ? "bg-red-50 border-red-400 shadow-md ring-2 ring-red-200"
                    : isCompleted
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-slate-50 border-slate-200 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Stage 0{idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 size={18} className="text-emerald-600" />}
                  {isBlocked && <ShieldAlert size={18} className="text-red-600 animate-bounce" />}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{stage.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-2 ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : isBlocked
                      ? "bg-red-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {stage.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-200/60 font-medium">
                  <div className="flex items-center gap-1">
                    <UserCheck size={12} className="text-slate-400" />
                    <span className="truncate">{stage.owner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>Duration: {stage.duration}</span>
                  </div>
                </div>

                {/* Reason blocked callout */}
                {isBlocked && (
                  <div className="bg-white p-3 rounded-lg border border-red-300 text-xs text-red-900 space-y-1">
                    <span className="font-bold block text-red-700 text-[10px] uppercase">Reason Blocked</span>
                    <p className="leading-snug text-[11px] font-medium">{stage.reasonBlocked}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
