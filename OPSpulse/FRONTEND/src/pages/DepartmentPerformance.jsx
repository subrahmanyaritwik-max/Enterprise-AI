import React from "react";
import { useOps } from "../context/OpsContext";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import { Building2, CheckCircle2, Clock, ShieldAlert, BarChart2 } from "lucide-react";

export const DepartmentPerformance = () => {
  const { departments } = useOps();
  const { user } = useAuth();

  const opsHead = user?.name || "Executive Operations Lead";

  const depts = departments?.length
    ? departments.map(d => d.name === "Operations" ? { ...d, head: opsHead } : d)
    : [
        { name: "Sales", head: "Elena Rostova", requests: 42, completed: 38, pending: 4, overdue: 0, avgProcessingTimeHours: 1.8, slaComplianceRate: 98.2, status: "Optimal" },
        { name: "Finance", head: "Robert Sterling", requests: 58, completed: 40, pending: 18, overdue: 6, avgProcessingTimeHours: 8.7, slaComplianceRate: 72.5, status: "Bottleneck" },
        { name: "Inventory", head: "Marcus Vance", requests: 35, completed: 27, pending: 8, overdue: 2, avgProcessingTimeHours: 4.2, slaComplianceRate: 85.0, status: "Attention Required" },
        { name: "Operations", head: opsHead, requests: 49, completed: 44, pending: 5, overdue: 1, avgProcessingTimeHours: 3.1, slaComplianceRate: 94.1, status: "Optimal" },
        { name: "Logistics", head: "Karan Patel", requests: 31, completed: 26, pending: 5, overdue: 1, avgProcessingTimeHours: 5.0, slaComplianceRate: 90.3, status: "Optimal" }
      ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 size={24} className="text-enterprise-600" />
            Departmental Operations Analytics & Performance
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Department performance monitoring, request completion rates, and SLA compliance rankings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((d, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{d.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Head: {d.head}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                d.status === "Bottleneck" ? "bg-amber-600 text-white" : d.status === "Attention Required" ? "bg-red-600 text-white" : "bg-emerald-100 text-emerald-800"
              }`}>
                {d.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">Total Requests</span>
                <span className="text-xl font-extrabold text-slate-900">{d.requests}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">Completed</span>
                <span className="text-xl font-extrabold text-emerald-600">{d.completed}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">Pending Backlog</span>
                <span className="text-xl font-extrabold text-amber-600">{d.pending}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">Avg SLA Time</span>
                <span className="text-xl font-extrabold text-slate-900">{d.avgProcessingTimeHours}h</span>
              </div>
            </div>

            {/* SLA Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">SLA Compliance Rate</span>
                <span className="text-slate-900 font-bold">{d.slaComplianceRate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.slaComplianceRate > 90 ? "bg-emerald-500" : d.slaComplianceRate > 80 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${d.slaComplianceRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
