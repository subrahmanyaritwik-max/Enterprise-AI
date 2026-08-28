import React from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import { BarChart3, Clock, AlertTriangle, ShieldAlert, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";

export const BottleneckIntelligence = () => {
  const { bottlenecks, setActiveTab } = useOps();

  const primary = bottlenecks?.primaryBottleneck || {
    department: "Finance",
    avgProcessingTimeHours: 8.7,
    slaBreachesCount: 6,
    currentBacklogCount: 18,
    status: "BOTTLENECK",
    impactDescription: "Finance credit verification queue is taking 8.7 hours on average, causing cascading delays downstream in Inventory & Logistics.",
    recommendedAction: "Review finance approval capacity, reassign secondary reviewer, or implement automated credit line thresholds for Tier 1 Enterprise accounts."
  };

  const stages = bottlenecks?.stagesMetrics || [
    { name: "Sales", avgProcessing: "1.8h", backlog: 4, slaBreaches: 0, status: "Optimal" },
    { name: "Finance", avgProcessing: "8.7h", backlog: 18, slaBreaches: 6, status: "BOTTLENECK" },
    { name: "Inventory", avgProcessing: "4.2h", backlog: 8, slaBreaches: 2, status: "Attention Required" },
    { name: "Operations", avgProcessing: "3.1h", backlog: 5, slaBreaches: 1, status: "Optimal" },
    { name: "Logistics", avgProcessing: "5.0h", backlog: 5, slaBreaches: 1, status: "Optimal" }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 size={24} className="text-enterprise-600" />
            Workflow Bottleneck & Delay Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Departmental throughput analysis, processing latency metrics, and capacity bottleneck detection.
          </p>
        </div>
      </div>

      {/* Primary Bottleneck Spotlight Box */}
      <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              PRIMARY SYSTEM BOTTLENECK
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">{primary.department} Department</h2>
          </div>

          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
            {bottlenecks?.summary || "31% of delayed orders are currently waiting for finance approval."}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold block mb-1">Average Processing Time</span>
            <span className="text-2xl font-extrabold text-slate-900">{primary.avgProcessingTimeHours} hours</span>
            <span className="text-amber-700 font-bold block text-[11px] mt-1">+4.2h over SLA baseline target</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold block mb-1">Active Queue Backlog</span>
            <span className="text-2xl font-extrabold text-slate-900">{primary.currentBacklogCount} orders</span>
            <span className="text-slate-500 font-medium block text-[11px] mt-1">Waiting in approval queue</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold block mb-1">SLA Breaches Recorded</span>
            <span className="text-2xl font-extrabold text-red-600">{primary.slaBreachesCount} breaches</span>
            <span className="text-red-700 font-medium block text-[11px] mt-1">Exceeded maximum turn-around</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs">
          <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider">
            Operational Impact & Recommended Action
          </span>
          <p className="text-slate-800 font-medium leading-relaxed">{primary.impactDescription}</p>
          <p className="text-amber-950 font-bold leading-relaxed pt-1">
            Recommended Action: {primary.recommendedAction}
          </p>
        </div>
      </div>

      {/* Stage-by-Stage Processing Time Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Departmental Stage Processing Performance</h3>
          <span className="text-xs text-slate-400">Target SLA Baseline: 3.5 hours per stage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Workflow Stage / Department</th>
                <th className="px-6 py-3">Avg Processing Time</th>
                <th className="px-6 py-3">Current Backlog</th>
                <th className="px-6 py-3">SLA Breaches</th>
                <th className="px-6 py-3">Status Posture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stages.map((st, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{st.name}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{st.avgProcessing}</td>
                  <td className="px-6 py-4 text-slate-700">{st.backlog} orders</td>
                  <td className={`px-6 py-4 font-bold ${st.slaBreaches > 0 ? "text-red-600" : "text-slate-500"}`}>
                    {st.slaBreaches}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      st.status === "BOTTLENECK"
                        ? "bg-amber-600 text-white"
                        : st.status === "Attention Required"
                        ? "bg-red-600 text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
