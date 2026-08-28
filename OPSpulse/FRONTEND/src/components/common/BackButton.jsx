import React from "react";
import { useOps } from "../../context/OpsContext";
import { ArrowLeft } from "lucide-react";

export const BackButton = ({ label = "Back to Overview", fallbackTab = "overview" }) => {
  const { goBack, setActiveTab, activeTab } = useOps();

  if (activeTab === "overview") return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (goBack) {
          goBack();
        } else {
          setActiveTab(fallbackTab);
        }
      }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer group"
    >
      <ArrowLeft size={15} className="text-slate-500 group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  );
};
