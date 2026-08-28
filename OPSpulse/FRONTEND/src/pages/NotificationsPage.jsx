import React from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import { Bell, ShieldAlert, AlertCircle, CheckCircle2, Check } from "lucide-react";

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, openOrderDetail } = useOps();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell size={24} className="text-enterprise-600" />
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            System alerts, critical risk notifications, SLA warnings, and workflow mentions.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.orderId) openOrderDetail(n.orderId);
            }}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              n.read ? "bg-white border-slate-200 opacity-75" : "bg-blue-50/50 border-blue-200 shadow-2xs"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {n.iconType === "red" && <ShieldAlert size={18} className="text-red-600" />}
                  {n.iconType === "amber" && <AlertCircle size={18} className="text-amber-600" />}
                  {n.iconType === "blue" && <CheckCircle2 size={18} className="text-blue-600" />}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{n.message}</p>
                </div>
              </div>

              {!n.read && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shrink-0">
                  NEW
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
