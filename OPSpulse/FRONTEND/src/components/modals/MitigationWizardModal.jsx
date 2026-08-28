import React, { useState } from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  X,
  Zap,
  Building2,
  Truck,
  FileCheck,
  RotateCcw,
  AlertTriangle,
  Send,
  Boxes,
  Check
} from "lucide-react";

export const MitigationWizardModal = () => {
  const {
    isMitigationWizardOpen,
    setIsMitigationWizardOpen,
    mitigationTarget,
    resolveRisk,
    refreshData,
    openOrderDetail
  } = useOps();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedWarehouse, setSelectedWarehouse] = useState("wh-south");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyLogistics, setNotifyLogistics] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [resolved, setResolved] = useState(false);

  if (!isMitigationWizardOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleExecuteMitigation = async () => {
    setExecuting(true);

    setTimeout(async () => {
      await resolveRisk("RISK-1042");
      setExecuting(false);
      setResolved(true);
      setStep(4);
      triggerConfetti();
      refreshData();
    }, 1200);
  };

  const handleClose = () => {
    setIsMitigationWizardOpen(false);
    setStep(1);
    setResolved(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-navy-950 text-white p-5 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-enterprise-600 flex items-center justify-center text-white shadow-md">
              <Zap size={20} className="text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white">
                  Autonomous AI Mitigation Wizard
                </h2>
                <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded uppercase">
                  ACTIVE RESOLUTION
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Resolving Order #{mitigationTarget || "1042"} Shortage & SLA Delivery Risk
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: "Diagnosis" },
            { num: 2, label: "Stock Rebalancing" },
            { num: 3, label: "Coordination" },
            { num: 4, label: "Resolution" }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 ${
                step === s.num
                  ? "text-enterprise-600 font-bold"
                  : step > s.num
                  ? "text-emerald-600 font-medium"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  step === s.num
                    ? "bg-enterprise-600 text-white shadow-sm"
                    : step > s.num
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step > s.num ? <Check size={12} /> : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body per Step */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5 text-slate-800 text-xs">
          {/* STEP 1: Threat Diagnostics */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                  <ShieldAlert size={18} />
                  <span>Physical Inventory Discrepancy Detected</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Sales confirmed <strong>120 units</strong> of SKU-9041 for client <strong>ABC Industries</strong> (₹2,40,000 value). Physical warehouse audit in Warehouse B confirmed only <strong>84 units</strong> in ready-stock.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ordered</span>
                  <span className="text-lg font-extrabold text-slate-900">120 units</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Available</span>
                  <span className="text-lg font-extrabold text-slate-900">84 units</span>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <span className="text-[10px] font-bold text-red-600 uppercase block">Shortage</span>
                  <span className="text-lg font-extrabold text-red-600">36 units</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Deadline</span>
                  <span className="text-lg font-extrabold text-amber-600">Tomorrow</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <span className="font-bold text-enterprise-900 flex items-center gap-1.5 text-xs">
                  <Sparkles size={14} className="text-enterprise-600" />
                  AI Suggested Strategy
                </span>
                <p className="text-slate-600 text-[11px] leading-snug">
                  Reallocate 36 available buffer units from <strong>Warehouse C (Hub South)</strong> via inter-facility express transfer, preserving the full delivery commitment without split delays.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Stock Rebalancing Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-bold text-slate-900 text-sm">
                Select Optimal Inter-Warehouse Inventory Source
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    id: "wh-south",
                    name: "Warehouse C — Hub South (Recommended)",
                    stock: "52 units available",
                    distance: "18 km away",
                    transferTime: "1.5 hours transit",
                    confidence: "99.2% Match",
                    cost: "₹1,200 transfer fee"
                  },
                  {
                    id: "wh-east",
                    name: "Warehouse E — Regional Depot East",
                    stock: "80 units available",
                    distance: "64 km away",
                    transferTime: "4.0 hours transit",
                    confidence: "88.0% Match",
                    cost: "₹3,400 transfer fee"
                  }
                ].map((wh) => (
                  <div
                    key={wh.id}
                    onClick={() => setSelectedWarehouse(wh.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedWarehouse === wh.id
                        ? "border-enterprise-600 bg-enterprise-50/50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{wh.name}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {wh.confidence}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        {wh.stock} • {wh.distance} • {wh.transferTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-700">{wh.cost}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ml-auto mt-1 flex items-center justify-center ${
                        selectedWarehouse === wh.id ? "border-enterprise-600 bg-enterprise-600 text-white" : "border-slate-300"
                      }`}>
                        {selectedWarehouse === wh.id && <Check size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Automated Coordination */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-bold text-slate-900 text-sm">
                Automated Departmental & Partner Notification Channels
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyLogistics}
                    onChange={(e) => setNotifyLogistics(e.target.checked)}
                    className="rounded text-enterprise-600 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck size={14} className="text-blue-600" />
                      Logistics Dispatch & Driver Notification
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Auto-generate transfer docket and schedule pickup from Warehouse C for 02:00 PM today.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={(e) => setNotifyCustomer(e.target.checked)}
                    className="rounded text-enterprise-600 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 size={14} className="text-emerald-600" />
                      Proactive ABC Industries SLA Assurance
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Send verified tracking link confirming 100% full quantity delivery by Tomorrow 5:00 PM.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-enterprise-400 uppercase tracking-wider block">
                  Automated Audit Trail Record
                </span>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  MITIGATION_PLAN: #ORD-1042-REBAL<br />
                  AUTHOR: {user?.name || "Operations Lead"} ({user?.title || "VP Operations"})<br />
                  STATUS: PENDING_ONE_CLICK_EXECUTION
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmed Resolution */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Operational Risk Successfully Mitigated!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  36 units reallocated from Warehouse C. Full 120-unit shipment locked for on-time dispatch tomorrow at 5:00 PM.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center pt-2">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-emerald-700 block">SLA Protection</span>
                  <span className="text-sm font-extrabold text-emerald-900">100% Saved</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-blue-700 block">Revenue Saved</span>
                  <span className="text-sm font-extrabold text-blue-900">₹2,40,000</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 block">Audit Log</span>
                  <span className="text-sm font-extrabold text-slate-900">Recorded</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              &larr; Back
            </button>
          )}
          {step === 1 && <div />}

          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue &rarr;</span>
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleExecuteMitigation}
                disabled={executing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:bg-slate-400"
              >
                {executing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing AI Mitigation...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="text-yellow-300" />
                    <span>Confirm & Execute Mitigation</span>
                  </>
                )}
              </button>
            )}

            {step === 4 && (
              <>
                <button
                  onClick={() => {
                    handleClose();
                    openOrderDetail("ORD-1042");
                  }}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  View Updated Order #1042
                </button>
                <button
                  onClick={handleClose}
                  className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Close Wizard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
