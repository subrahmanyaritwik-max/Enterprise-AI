import React from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  PackageCheck,
  GitMerge,
  CheckSquare,
  ShieldAlert,
  Building2,
  BarChart3,
  FileText,
  Activity,
  Settings,
  LogOut,
  User,
  Shield,
  X,
  Database,
  Key
} from "lucide-react";

export const Sidebar = () => {
  const { activeTab, setActiveTab, risks, tasks, orders, isMobileDrawerOpen, setIsMobileDrawerOpen } = useOps();
  const { user, switchRole, logout } = useAuth();

  const atRiskCount = orders ? orders.filter((o) => o.status === "At Risk").length : 2;
  const overdueCount = tasks ? tasks.filter((t) => t.escalated || t.status === "Overdue").length : 1;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Operations",
      icon: PackageCheck,
      badge: atRiskCount ? `${atRiskCount} risk` : null,
      badgeColor: "bg-red-500 text-white"
    },
    { id: "workflows", label: "Workflows", icon: GitMerge },
    {
      id: "tasks",
      label: "Tasks & SLAs",
      icon: CheckSquare,
      badge: overdueCount ? `${overdueCount}` : null,
      badgeColor: "bg-amber-500 text-white"
    },
    {
      id: "risks",
      label: "Risk Center",
      icon: ShieldAlert,
      badge: risks?.length || 4,
      badgeColor: "bg-red-600/80 text-white"
    },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "analytics", label: "Bottlenecks", icon: BarChart3 },
    { id: "records", label: "Database Records", icon: Database, badge: "Supabase", badgeColor: "bg-emerald-600 text-white" },
    { id: "api-keys", label: "API Keys & URLs", icon: Key, badge: "REST", badgeColor: "bg-blue-600 text-white" },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    setActiveTab("login");
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between">
          <div
            onClick={() => {
              setActiveTab("landing");
              setIsMobileDrawerOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group flex-1"
            title="Return to OPSpulse Home Page"
          >
            <div className="w-9 h-9 rounded-xl bg-enterprise-600 group-hover:scale-105 transition-transform flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-900/40 border border-enterprise-400/30">
              OP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-white tracking-tight text-base group-hover:text-blue-300 transition-colors">
                  OPSpulse
                </h1>
                <span className="text-[10px] bg-enterprise-600/20 text-enterprise-400 font-semibold px-1.5 py-0.2 rounded border border-enterprise-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Intelligence</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-navy-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Workspace Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id || (item.id === "orders" && activeTab === "order-detail");

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-enterprise-600 text-white shadow-md font-semibold"
                    : "hover:bg-navy-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile & Account Footer */}
      <div className="p-3 border-t border-navy-800 bg-navy-950/80 space-y-2">
        <div className="bg-navy-850 rounded-xl p-2.5 border border-navy-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-enterprise-700 text-white font-bold text-xs flex items-center justify-center border border-enterprise-500/40 shrink-0">
                {user?.avatar || "U"}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "Enterprise User"}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.title || "Operations Staff"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-navy-700/60 rounded-md transition-colors shrink-0 cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>

          <div className="pt-2 border-t border-navy-800">
            <select
              value={user?.role || "Executive / Manager"}
              onChange={(e) => switchRole(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-enterprise-500 cursor-pointer font-medium"
            >
              <option value="Executive / Manager">
                Executive Manager {user?.role === "Executive / Manager" && user?.name ? `(${user.name})` : ""}
              </option>
              <option value="Department Head">
                Department Head {user?.role === "Department Head" && user?.name ? `(${user.name})` : "(Marcus Vance)"}
              </option>
              <option value="Employee">
                Operations Specialist {user?.role === "Employee" && user?.name ? `(${user.name})` : "(David Chen)"}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-navy-900 border-r border-navy-800 text-slate-300 flex-col justify-between h-full select-none shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop Overlay */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Body */}
          <div className="relative w-72 max-w-[80vw] bg-navy-900 border-r border-navy-800 text-slate-300 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
