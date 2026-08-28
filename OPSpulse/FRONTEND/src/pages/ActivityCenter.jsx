import React from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import { Activity, ShieldAlert, CheckSquare, MessageSquare, GitMerge, User } from "lucide-react";

export const ActivityCenter = () => {
  const { activities, openOrderDetail } = useOps();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity size={24} className="text-enterprise-600" />
            Enterprise Activity & Audit Stream
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Immutable system event log, user updates, SLA breach escalations, and cross-department comments.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        {activities.map((act) => {
          const isRisk = act.category === "Risk";
          const isEscalation = act.category === "Automated Escalation";

          return (
            <div
              key={act.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                isEscalation ? "bg-red-50/70 border-red-300" : isRisk ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {act.category === "Risk" ? <ShieldAlert size={18} className="text-red-400" /> : <Activity size={18} className="text-blue-400" />}
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{act.actor}</span>
                    <span className="text-slate-400 font-medium">({act.actorRole})</span>
                    <span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {act.event}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{act.timestamp}</span>
                </div>

                <p className="font-bold text-slate-900 text-sm">{act.title}</p>
                <p className="text-slate-600 font-medium leading-relaxed">{act.details}</p>

                {act.relatedObject && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        if (act.relatedObject.includes("1042")) openOrderDetail("ORD-1042");
                      }}
                      className="text-[11px] font-bold text-enterprise-600 hover:underline"
                    >
                      Related: {act.relatedObject} &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
