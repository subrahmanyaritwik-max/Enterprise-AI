import React, { useState } from "react";
import { useOps } from "../context/OpsContext";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import {
  FileText,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  ArrowDownToLine
} from "lucide-react";

export const ReportsPage = () => {
  const { overviewData, orders, tasks, bottlenecks } = useOps();
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState(null);
  const [lastDownloaded, setLastDownloaded] = useState(null);

  const reportsList = [
    {
      id: "daily-ops",
      title: "Daily Operations Executive Brief",
      category: "Executive Overview",
      freq: "Daily",
      date: "Today, 08:00 AM",
      description: "Executive summary of critical delivery shortages, revenue at risk, and autonomous mitigation actions.",
      generateCsv: () => {
        return `Report: Daily Operations Executive Brief\nGenerated For: ${user?.name || "Executive"}\nDate: ${new Date().toLocaleString()}\n\nMetric,Value,Status\nTotal Active Orders,${orders?.length || 24},Active\nCritical Risk Orders,1,Order #1042 Shortage\nRevenue at Risk,Rs 240000,Requires Mitigation\nFinance Queue Backlog,18 Orders,8.7h Avg Latency\nSLA Compliance Rate,99.4%,Protected\nDepartment Status,5 Connected,Synchronized\n`;
      }
    },
    {
      id: "dept-perf",
      title: "Departmental Throughput & Backlog Report",
      category: "Performance",
      freq: "Weekly",
      date: "Aug 28, 2026",
      description: "Cross-department breakdown across Sales, Finance, Inventory, Operations, and Logistics.",
      generateCsv: () => {
        return `Department,Throughput Rate,Pending Backlog,Avg Resolution Time,Health Status\nSales & Client Commitments,98.2%,4 Orders,1.2 hrs,Optimal\nFinance & Credit Approvals,84.5%,18 Orders,8.7 hrs,Bottleneck\nInventory & Warehouse,91.0%,3 Tasks,2.4 hrs,Attention\nLogistics & Carrier Dispatch,96.8%,6 Shipments,1.8 hrs,Optimal\nExecutive Operations,100%,0 Items,0.5 hrs,Optimal\n`;
      }
    },
    {
      id: "sla-perf",
      title: "Enterprise SLA Compliance & Escalation Audit",
      category: "Compliance",
      freq: "Weekly",
      date: "Aug 27, 2026",
      description: "Complete log of operational tasks, assignee compliance, and auto-escalation triggers.",
      generateCsv: () => {
        return `Task ID,Title,Assignee,Department,Priority,Due Deadline,Status\nTASK-781,Verify Physical Count SKU-9041,David Chen,Inventory,HIGH,1h 45m remaining,In Progress\nTASK-782,Review Credit Terms ABC Industries,Elena Rostova,Sales,MEDIUM,Today 5:00 PM,Pending Approval\nTASK-783,Reroute Carrier South Depot,Marcus Vance,Logistics,HIGH,Tomorrow 10:00 AM,Scheduled\n`;
      }
    },
    {
      id: "risk-sum",
      title: "Critical Anomaly & Delivery Risk Matrix",
      category: "Risk Management",
      freq: "Real-time",
      date: "Live Synchronized",
      description: "Direct discrepancy telemetry identifying physical stock shortages against confirmed sales commitments.",
      generateCsv: () => {
        return `Order ID,Client Name,SKU,Confirmed Sales Qty,Physical Warehouse Stock,Discrepancy (Deficit),Value at Risk,Mitigation Strategy\nORD-1042,ABC Industries,SKU-9041,120 units,84 units,-36 units,Rs 240000,1-Click Inter-Warehouse Rebalance from Hub South (52 buffer units)\nORD-1039,Vertex Aerospace,SKU-8820,40 units,40 units,0 units,Rs 580000,None (Optimal fulfillment)\nORD-1038,Apex Healthcare,SKU-3310,200 units,200 units,0 units,Rs 650000,Carrier packaging dispatched\n`;
      }
    },
    {
      id: "bottlenecks",
      title: "Workflow Bottleneck & Latency Diagnostic",
      category: "Process Intelligence",
      freq: "Monthly",
      date: "Aug 2026",
      description: "Root cause diagnostics for delayed approvals, inter-department handoffs, and transit delays.",
      generateCsv: () => {
        return `Bottleneck Stage,Department,Delayed Items,Avg Queue Time,Root Cause,Recommended Action\nCredit Hold Queue,Finance,18 orders,8.7 hours,Manual dual-signature signoff,Enable 1-click VIP client fast-track approval\nLoading Dock Transfer,Logistics,4 trucks,3.2 hours,Carrier slot scheduling,Automate digital dock reservation\n`;
      }
    }
  ];

  const triggerDirectDownload = (report, format = "csv") => {
    setDownloadingId(report.id);

    try {
      const csvData = report.generateCsv();
      const filename = `${report.id}_${report.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.${format}`;

      const blob = new Blob([csvData], { type: format === "csv" ? "text/csv;charset=utf-8;" : "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloadingId(null);
        setLastDownloaded({
          id: report.id,
          title: report.title,
          filename
        });
      }, 500);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText size={26} className="text-enterprise-600" />
            Enterprise Operational Reports & Direct Exports
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Automated executive reporting, SLA compliance audit logs, and instant downloadable CSV datasets.
          </p>
        </div>

        {/* Live Download Status Toast */}
        {lastDownloaded && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Downloaded: </span>
              <span className="font-mono text-[11px]">{lastDownloaded.filename}</span>
            </div>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep) => {
          const isDownloading = downloadingId === rep.id;
          return (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-enterprise-50 text-enterprise-700 font-bold px-2.5 py-0.5 rounded-full border border-enterprise-200">
                    {rep.category}
                  </span>
                  <span className="text-slate-400 font-semibold text-[11px] font-mono flex items-center gap-1">
                    <Clock size={12} />
                    {rep.freq}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rep.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.description}</p>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Last Compiled: <strong className="text-slate-700">{rep.date}</strong>
                </div>
              </div>

              {/* Direct Download Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => triggerDirectDownload(rep, "csv")}
                  disabled={isDownloading}
                  className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Downloading File...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet size={15} className="text-emerald-400" />
                      <span>Download CSV Dataset</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => triggerDirectDownload(rep, "txt")}
                  disabled={isDownloading}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                  title="Download raw report text"
                >
                  <ArrowDownToLine size={14} className="text-slate-500" />
                  <span>TXT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
