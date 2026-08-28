import React, { useState } from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import { ShieldAlert, AlertTriangle, CheckCircle2, Search, ArrowRight, UserPlus, Filter } from "lucide-react";

export const RiskCenter = () => {
  const { risks, resolveRisk, openOrderDetail, setIsCreateTaskOpen } = useOps();
  const [filterSeverity, setFilterSeverity] = useState("All");

  const filteredRisks = risks ? risks.filter(r => {
    if (filterSeverity === "All") return true;
    return r.severity.toLowerCase() === filterSeverity.toLowerCase();
  }) : [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert size={24} className="text-red-600" />
            Operational Risk Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time operational anomaly detection, impact severity scoring, and recommended mitigation workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Critical", "High", "Medium", "Low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                filterSeverity === sev
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => {
          const isCritical = risk.severity === "Critical";
          const isHigh = risk.severity === "High";

          return (
            <div
              key={risk.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-4 transition-all ${
                isCritical ? "border-red-400 bg-red-50/20" : isHigh ? "border-amber-300" : "border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded">
                    {risk.riskId}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{risk.title}</h3>
                    <p className="text-xs text-slate-500">
                      Category: <strong>{risk.category}</strong> • Detected {risk.detectedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isCritical ? "bg-red-600 text-white" : isHigh ? "bg-amber-600 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {risk.severity} Severity
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    risk.status === "Active" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {risk.status}
                  </span>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    Operational Reason & Cause
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">{risk.reason}</p>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-enterprise-700 uppercase tracking-wider text-[10px] block">
                    Recommended Action
                  </span>
                  <p className="text-enterprise-950 leading-relaxed font-medium">{risk.recommendedAction}</p>
                </div>
              </div>

              {/* Affected Departments & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Affected Departments:</span>
                  <div className="flex flex-wrap gap-1">
                    {risk.departments.map((dept, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {risk.orderId && (
                    <button
                      onClick={() => openOrderDetail(risk.orderId)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Investigate Order</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="bg-enterprise-50 text-enterprise-700 border border-enterprise-200 font-semibold px-3 py-1.5 rounded-lg hover:bg-enterprise-100 transition-colors flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    <span>Assign Task</span>
                  </button>

                  {risk.status !== "Resolved" && (
                    <button
                      onClick={() => resolveRisk(risk.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      <span>Resolve Risk</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
