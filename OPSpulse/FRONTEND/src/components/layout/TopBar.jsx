import React, { useState } from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  X,
  Menu,
  Key
} from "lucide-react";

export const TopBar = () => {
  const {
    notifications,
    markNotificationRead,
    setIsDailyBriefOpen,
    setIsAskOpsOpen,
    setIsSearchOpen,
    openOrderDetail,
    setActiveTab,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen
  } = useOps();

  const { user } = useAuth();
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Mobile Hamburger Toggle & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full bg-slate-100 hover:bg-slate-150 text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search size={15} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 truncate">Search orders, risks, tasks...</span>
          </div>
          <kbd className="hidden sm:inline-block bg-white text-slate-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* AI Actions & Notification Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
        {/* Daily Brief Button */}
        <button
          onClick={() => setIsDailyBriefOpen(true)}
          className="bg-enterprise-50 hover:bg-enterprise-100 text-enterprise-700 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-enterprise-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Generate Executive Daily Brief"
        >
          <Sparkles size={14} className="text-enterprise-600 shrink-0" />
          <span className="hidden md:inline">Generate Daily Brief</span>
        </button>

        {/* Ask Operations Assistant Button */}
        <button
          onClick={() => setIsAskOpsOpen(true)}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          title="Ask Operations Decision Support"
        >
          <Sparkles size={14} className="text-blue-400 shrink-0" />
          <span className="hidden sm:inline">Ask Operations</span>
        </button>

        {/* API Keys Quick Button */}
        <button
          onClick={() => setActiveTab("api-keys")}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-enterprise-600 transition-colors relative cursor-pointer"
          title="API Keys & Unique Page Endpoints"
        >
          <Key size={17} />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-1" />

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout Drawer */}
          {isNotifDrawerOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsNotifDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No notifications.</p>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.orderId) {
                          openOrderDetail(n.orderId);
                          setIsNotifDrawerOpen(false);
                        }
                      }}
                      className={`p-3 rounded-xl cursor-pointer text-xs transition-colors flex items-start gap-2.5 ${
                        n.read ? "bg-white hover:bg-slate-50 opacity-70" : "bg-blue-50/50 hover:bg-blue-50"
                      }`}
                    >
                      {n.type === "Critical Risk" ? (
                        <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={16} className="text-enterprise-600 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {n.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
