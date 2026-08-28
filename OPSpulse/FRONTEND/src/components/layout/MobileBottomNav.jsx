import React from "react";
import { useOps } from "../../context/OpsContext";
import {
  LayoutDashboard,
  PackageCheck,
  ShieldAlert,
  CheckSquare,
  Menu
} from "lucide-react";

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab, risks, tasks, orders, setIsMobileDrawerOpen, isMobileDrawerOpen } =
    useOps();

  const atRiskCount = orders ? orders.filter((o) => o.status === "At Risk").length : 0;
  const overdueCount = tasks ? tasks.filter((t) => t.escalated || t.status === "Overdue").length : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Orders",
      icon: PackageCheck,
      badge: atRiskCount > 0 ? atRiskCount : null
    },
    {
      id: "risks",
      label: "Risks",
      icon: ShieldAlert,
      badge: risks?.length || null
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      badge: overdueCount > 0 ? overdueCount : null
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-navy-950/95 backdrop-blur-md border-t border-navy-800 flex items-center justify-around py-1.5 px-2 safe-area-pb">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          activeTab === tab.id || (tab.id === "orders" && activeTab === "order-detail");

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
              isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? "text-blue-400" : "text-slate-400"} />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${isActive ? "text-white" : "text-slate-400"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Menu Drawer Toggle */}
      <button
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
      >
        <Menu size={20} />
        <span className="text-[10px] mt-1 font-semibold text-slate-400">Menu</span>
      </button>
    </div>
  );
};
