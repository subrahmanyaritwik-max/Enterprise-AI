import React, { useState, useEffect } from "react";
import { useOps } from "../context/OpsContext";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Code
} from "lucide-react";

export const RecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [aiOutputs, setAiOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newAction, setNewAction] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [recRes, aiRes] = await Promise.all([
        fetch("/api/records?limit=50"),
        fetch("/api/ai/outputs/recent?limit=50")
      ]);
      const recData = await recRes.json();
      const aiData = await aiRes.json();
      if (recData.success) setRecords(recData.records || []);
      if (aiData.success) setAiOutputs(aiData.outputs || []);
    } catch (e) {
      console.warn("Error fetching records:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          input_data: {
            action: newAction.trim(),
            details: newDetails.trim() || "Manual operational task logged from Dashboard",
            createdBy: user?.name || "System Operator",
            department: user?.department || "Executive Operations",
            timestamp: new Date().toISOString()
          }
        })
      });
      const data = await res.json();
      if (res.status === 201 && data.success) {
        setNewAction("");
        setNewDetails("");
        setIsCreating(false);
        setStatusMsg("Record saved successfully to Supabase APP_RECORDS!");
        setTimeout(() => setStatusMsg(null), 3000);
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        setStatusMsg("Record deleted from Supabase!");
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Database Records & Persistence</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Supabase Live
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Live entries in <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">APP_RECORDS</code> and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">AI_OUTPUTS</code> tables.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRecords}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-enterprise-600" : ""}`} />
            Refresh Data
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-enterprise-600 hover:bg-enterprise-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Record (Judge Test)
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {statusMsg}
        </div>
      )}

      {/* Create Modal / Inline Form */}
      {isCreating && (
        <form onSubmit={handleCreateRecord} className="bg-white p-5 rounded-xl border border-enterprise-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-enterprise-600" />
              Create Persistent Record in Supabase (POST /api/records)
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Action / Title *</label>
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g., Expedite Order #1042 Buffer Stock"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-enterprise-500 focus:border-enterprise-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Details / Metadata</label>
              <input
                type="text"
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                placeholder="e.g., Dispatched 36 buffer units from Hub South"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-enterprise-500 focus:border-enterprise-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              Save to Database (201 Created)
            </button>
          </div>
        </form>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">APP_RECORDS Table Rows ({records.length})</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Synced to vcwqdvgibvtnktdfhipa</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading records from Supabase...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Database className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">No records found yet.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs text-enterprise-600 font-semibold hover:underline"
            >
              Create your first record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">Record ID (UUID)</th>
                  <th className="px-4 py-3">Action / Event</th>
                  <th className="px-4 py-3">Input Data (JSONB)</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {r.id.slice(0, 8)}...{r.id.slice(-4)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {r.input_data?.action || r.input_data?.eventType || r.input_data?.prompt || "Operation Log"}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                        {JSON.stringify(r.input_data)}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI_OUTPUTS Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">AI_OUTPUTS Table Rows ({aiOutputs.length})</h3>
          </div>
          <span className="text-xs text-amber-400/80 font-mono">Linked by record_id</span>
        </div>

        {aiOutputs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No AI output inferences logged yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {aiOutputs.map((o) => (
              <div key={o.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-mono text-enterprise-600 font-bold">ID: {o.id.slice(0, 8)}...</span>
                  <span>Record FK: <strong className="font-mono text-slate-700">{o.record_id ? o.record_id.slice(0, 8) + "..." : "Global"}</strong></span>
                  <span>{new Date(o.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  {o.result_json?.answer || o.result_json?.response || o.result_json?.summary || JSON.stringify(o.result_json)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
