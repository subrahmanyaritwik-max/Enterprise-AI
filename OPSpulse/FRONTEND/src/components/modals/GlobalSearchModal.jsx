import React, { useState, useEffect } from "react";
import { useOps } from "../../context/OpsContext";
import {
  Search,
  X,
  PackageCheck,
  CheckSquare,
  ShieldAlert,
  Building2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Layers
} from "lucide-react";

export const GlobalSearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    openOrderDetail,
    setActiveTab,
    orders,
    tasks,
    risks,
    departments
  } = useOps();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ orders: [], tasks: [], risks: [], departments: [] });

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults({ orders: [], tasks: [], risks: [], departments: [] });
      return;
    }

    // Try backend search first
    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && (data.orders?.length || data.tasks?.length || data.risks?.length || data.departments?.length)) {
          setResults(data);
        } else {
          // Client-side fallback smart matching
          runClientSearch(trimmed);
        }
      })
      .catch(() => {
        runClientSearch(trimmed);
      });
  }, [query, orders, tasks, risks, departments]);

  const runClientSearch = (q) => {
    const tokens = q.split(/\s+/).filter((t) => !["the", "a", "an", "for", "to", "in", "of", "and", "is", "are", "show", "me", "which"].includes(t));
    const isRiskIntent = q.includes("risk") || q.includes("shortage") || q.includes("delay") || q.includes("danger") || q.includes("incident");
    const isFinanceIntent = q.includes("finance") || q.includes("credit") || q.includes("approval");
    const isInventoryIntent = q.includes("inventory") || q.includes("stock") || q.includes("warehouse");

    const matches = (str) => {
      if (!str) return false;
      const s = String(str).toLowerCase();
      if (s.includes(q)) return true;
      return tokens.some((t) => s.includes(t));
    };

    const matchedOrders = (orders || []).filter((o) => {
      if (isRiskIntent && (o.status === "At Risk" || o.deliveryRisk)) return true;
      if (isFinanceIntent && (o.status?.includes("Pending") || o.currentDepartment === "Finance")) return true;
      if (isInventoryIntent && o.currentDepartment === "Inventory") return true;
      return matches(o.id) || matches(o.orderNumber) || matches(o.customer) || matches(o.status) || matches(o.currentDepartment);
    });

    const matchedTasks = (tasks || []).filter((t) => {
      if (isRiskIntent && (t.priority === "HIGH" || t.priority === "CRITICAL")) return true;
      return matches(t.id) || matches(t.title) || matches(t.description) || matches(t.assignee) || matches(t.department);
    });

    const matchedRisks = (risks || []).filter((r) => {
      if (isRiskIntent) return true;
      return matches(r.id) || matches(r.title) || matches(r.description) || matches(r.department) || matches(r.severity);
    });

    const matchedDepts = (departments || []).filter((d) => {
      return matches(d.id) || matches(d.name) || matches(d.headName) || matches(d.status);
    });

    setResults({
      orders: matchedOrders,
      tasks: matchedTasks,
      risks: matchedRisks,
      departments: matchedDepts
    });
  };

  if (!isSearchOpen) return null;

  const totalResults =
    results.orders.length + results.tasks.length + results.risks.length + results.departments.length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search size={20} className="text-enterprise-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, risks, tasks, departments, or enter operational query..."
            className="w-full text-slate-900 text-sm focus:outline-none font-medium placeholder:text-slate-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Suggested Natural Language Queries when empty */}
        {!query && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-enterprise-600" />
              <span>Suggested Natural Language Queries</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "Show orders at risk",
                "Which orders are waiting for finance approval?",
                "Show inventory-related delays",
                "David Chen stock audit",
                "Order #1042 ABC Industries",
                "Which department has the highest backlog?"
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(preset)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-enterprise-50 hover:text-enterprise-700 font-medium text-slate-700 transition-colors flex items-center justify-between border border-slate-200 cursor-pointer"
                >
                  <span className="truncate">"{preset}"</span>
                  <ArrowRight size={13} className="text-slate-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {totalResults === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  No matching records found for "{query}".
                </p>
                <button
                  onClick={() => setQuery("Show orders at risk")}
                  className="text-xs font-bold text-enterprise-600 hover:underline"
                >
                  Try: "Show orders at risk"
                </button>
              </div>
            ) : (
              <>
                {/* Orders Results */}
                {results.orders.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <PackageCheck size={14} className="text-blue-600" /> Orders ({results.orders.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab("orders");
                        }}
                        className="text-[10px] text-enterprise-600 font-bold hover:underline"
                      >
                        View All Orders &rarr;
                      </button>
                    </h4>
                    <div className="space-y-1.5">
                      {results.orders.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            openOrderDetail(o.id);
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-enterprise-400 hover:bg-enterprise-50/50 cursor-pointer flex items-center justify-between text-xs transition-all"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{o.orderNumber}</span> —{" "}
                            <span className="text-slate-700 font-medium">{o.customer}</span>
                            <span className="text-slate-400 ml-2 font-mono text-[11px]">
                              Value: {o.orderValue || `₹${(o.totalAmount || 240000).toLocaleString()}`}
                            </span>
                            {o.delayCause && (
                              <p className="text-[11px] text-red-600 font-medium mt-0.5">
                                Alert: {o.delayCause}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                              o.status === "At Risk"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks Results */}
                {results.risks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-red-600" /> Operational Risks (
                        {results.risks.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab("risks");
                        }}
                        className="text-[10px] text-enterprise-600 font-bold hover:underline"
                      >
                        Open Risk Center &rarr;
                      </button>
                    </h4>
                    <div className="space-y-1.5">
                      {results.risks.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setActiveTab("risks");
                          }}
                          className="p-3 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 cursor-pointer flex items-center justify-between text-xs transition-all"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{r.title}</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{r.description}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300 shrink-0">
                            {r.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks Results */}
                {results.tasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare size={14} className="text-emerald-600" /> Tasks ({results.tasks.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab("tasks");
                        }}
                        className="text-[10px] text-enterprise-600 font-bold hover:underline"
                      >
                        View All Tasks &rarr;
                      </button>
                    </h4>
                    <div className="space-y-1.5">
                      {results.tasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setActiveTab("tasks");
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-enterprise-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-all"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{t.title}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">
                              Assignee: {t.assignee} ({t.department})
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Departments Results */}
                {results.departments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={14} className="text-purple-600" /> Departments (
                      {results.departments.length})
                    </h4>
                    <div className="space-y-1.5">
                      {results.departments.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setActiveTab("departments");
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer flex items-center justify-between text-xs transition-all"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{d.name}</span>
                            <span className="text-slate-500 ml-2 text-[11px]">Head: {d.headName}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400 font-mono">
          Press ESC or click close to dismiss
        </div>
      </div>
    </div>
  );
};
