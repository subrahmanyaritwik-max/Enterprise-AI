import React, { useState } from "react";
import { useOps } from "../../context/OpsContext";
import { Sparkles, X, Send, HelpCircle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export const DecisionSupportModal = () => {
  const { isAskOpsOpen, setIsAskOpsOpen, openOrderDetail, setActiveTab } = useOps();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const presetQuestions = [
    "Which issue should I prioritize first?",
    "Why is Order #1042 at risk?",
    "Which department is causing the most delays?",
    "What are the biggest bottlenecks today?"
  ];

  const handleAsk = async (qText) => {
    const textToAsk = qText || query;
    if (!textToAsk.trim()) return;

    setQuery(textToAsk);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToAsk })
      });
      const data = await res.json();
      setResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAskOpsOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-enterprise-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Ask Operations — Decision Support</h2>
              <p className="text-xs text-slate-300">Structured AI reasoning backed by live enterprise data</p>
            </div>
          </div>
          <button
            onClick={() => setIsAskOpsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Common Operational Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {presetQuestions.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(preset)}
                  className="bg-slate-100 hover:bg-enterprise-50 hover:text-enterprise-700 hover:border-enterprise-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask an operational question (e.g. Which orders will miss delivery today?)"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-enterprise-600 focus:ring-2 focus:ring-enterprise-100 font-medium"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              className="absolute right-2 bg-enterprise-600 hover:bg-enterprise-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Response Container */}
          {loading ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-7 h-7 border-3 border-enterprise-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Evaluating operational data and cross-department dependencies...</p>
            </div>
          ) : response ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold text-enterprise-600 uppercase tracking-wider block mb-1">
                  Query Analysis
                </span>
                <p className="text-base font-bold text-slate-900">{response.answer}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Reason & Context:</span>
                  <p className="text-slate-600">{response.reason}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Affected Operational Data:</span>
                  <p className="text-slate-600 font-mono text-[11px]">{response.affectedData}</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-950">Recommended Operational Action:</span>
                  <span>{response.recommendedAction}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setIsAskOpsOpen(false);
                    if (query.includes("1042") || response.answer.includes("1042")) {
                      openOrderDetail("ORD-1042");
                    } else if (query.includes("department") || query.includes("bottleneck")) {
                      setActiveTab("analytics");
                    } else {
                      setActiveTab("risks");
                    }
                  }}
                  className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open Affected Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-right">
          <button
            onClick={() => setIsAskOpsOpen(false)}
            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-slate-300 transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
