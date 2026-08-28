import React, { useState } from "react";
import { useOps } from "../context/OpsContext";
import { BackButton } from "../components/common/BackButton";
import {
  Key,
  Copy,
  Check,
  Code,
  Globe,
  Database,
  Terminal,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu,
  Server
} from "lucide-react";

export const ApiKeysPage = () => {
  const { setActiveTab } = useOps();
  const [copiedKey, setCopiedKey] = useState(null);

  const supabaseUrl = "https://vcwqdvgibvtnktdfhipa.supabase.co";
  const supabasePublishableKey = "sb_publishable_LVRES5t75rnhnXDyo3g3kg_kBViqTtN";
  const opspulseBackendUrl = typeof window !== "undefined" ? window.location.origin : "https://enterprise-ai-5mzs.vercel.app";

  const handleCopy = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pageEndpoints = [
    {
      page: "Overview Dashboard",
      urlPath: "/overview",
      apiRoute: "/api/overview",
      method: "GET",
      description: "Live enterprise KPIs, multi-department telemetry, and critical attention alerts.",
      samplePayload: "None (Query Parameters optional: ?timeRange=24h)"
    },
    {
      page: "Orders & Order Details",
      urlPath: "/orders and /orders/:id",
      apiRoute: "/api/orders / /api/orders/:id",
      method: "GET | POST",
      description: "Complete order fulfillment lifecycle, stages, discrepancy tracking, and comment logs.",
      samplePayload: `{ "text": "Stock recount requested", "authorName": "David Chen", "authorRole": "Logistics" }`
    },
    {
      page: "Cross-Department Workflows",
      urlPath: "/workflows",
      apiRoute: "/api/workflows",
      method: "GET",
      description: "Live multi-stage operational pipelines connecting Sales, Finance, Inventory, Operations, and Logistics."
    },
    {
      page: "Task & SLA Management",
      urlPath: "/tasks and /tasks/:id",
      apiRoute: "/api/tasks / /api/tasks/:id",
      method: "GET | POST | PATCH",
      description: "SLA timers, assignee resolution, priority escalations, and automated reassignment."
    },
    {
      page: "Risk Sentinel",
      urlPath: "/risks and /risks/:id",
      apiRoute: "/api/risks / /api/risks/:id",
      method: "GET | POST",
      description: "Proactive AI risk detection, root-cause diagnostics, and autonomous mitigation triggers."
    },
    {
      page: "Department Performance",
      urlPath: "/departments and /departments/:id",
      apiRoute: "/api/departments / /api/departments/:id",
      method: "GET",
      description: "Capacity, throughput, latency, and operational health metrics across all 5 business units."
    },
    {
      page: "Bottleneck Intelligence",
      urlPath: "/analytics",
      apiRoute: "/api/bottlenecks",
      method: "GET",
      description: "Telemetry analytics on queue depths, approval stalls, and supply chain delays."
    },
    {
      page: "Persistent Database Records",
      urlPath: "/records and /records/:id",
      apiRoute: "/api/records / /api/records/:id",
      method: "GET | POST | PUT | DELETE",
      description: "Full persistent CRUD operations synced to Supabase APP_RECORDS table.",
      samplePayload: `{ "userId": "uuid", "input_data": { "action": "Warehouse Rebalance", "units": 36 } }`
    },
    {
      page: "Autonomous AI Decision Engine",
      urlPath: "/api/ai",
      apiRoute: "/api/ai / /api/ai/ask-operations",
      method: "POST",
      description: "Google Gemini 1.5 Flash AI reasoning engine, diagnosis synthesizer, and auto-output logger.",
      samplePayload: `{ "prompt": "What is the stock discrepancy for Order #1042?", "userId": "uuid" }`
    },
    {
      page: "Authentication & Directory",
      urlPath: "/login and /api/auth/register",
      apiRoute: "/api/auth/login / /api/auth/register",
      method: "POST",
      description: "User authentication, SHA-256 hashed credentials, role switching, and directory sync."
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Keys & Developer Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-enterprise-100 text-enterprise-700 border border-enterprise-200">
                v4.5 PRO
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Direct API keys, unique page URLs, and REST endpoints for all OPSpulse modules and Supabase tables.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("records")}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            View Live Records
          </button>
        </div>
      </div>

      {/* Active API Credentials Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Publishable Key */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Supabase Cloud API Key</h3>
                <span className="text-xs text-emerald-600 font-medium">Public Client Key (Anon / Client-Side)</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
              Active & Verified
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Use this publishable API key for direct frontend queries and client-side database authentication.
          </p>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <code className="text-xs font-mono text-slate-800 flex-1 truncate select-all">
              {supabasePublishableKey}
            </code>
            <button
              onClick={() => handleCopy(supabasePublishableKey, "supaKey")}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Copy Key"
            >
              {copiedKey === "supaKey" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Project: <strong className="text-slate-700">vcwqdvgibvtnktdfhipa</strong></span>
            <span>Region: <strong className="text-slate-700">ap-northeast-2</strong></span>
          </div>
        </div>

        {/* REST API Base URL */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-enterprise-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-enterprise-50 text-enterprise-600 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">OPSpulse Live REST Base URL</h3>
                <span className="text-xs text-enterprise-600 font-medium">Production API & Serverless Gateway</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              HTTPS Live
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Primary API gateway for all operations telemetry, Google Gemini 1.5 Flash AI, and workflow services.
          </p>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <code className="text-xs font-mono text-slate-800 flex-1 truncate select-all">
              {opspulseBackendUrl}/api
            </code>
            <button
              onClick={() => handleCopy(`${opspulseBackendUrl}/api`, "restBase")}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Copy URL"
            >
              {copiedKey === "restBase" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Protocol: <strong className="text-slate-700">REST / JSON</strong></span>
            <span>Auth: <strong className="text-slate-700">Bearer Token / Header Key</strong></span>
          </div>
        </div>
      </div>

      {/* Unique URLs & API Endpoints for Every Page */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-enterprise-400" />
            <div>
              <h3 className="font-bold text-base">Unique Page URLs & Connected API Endpoints</h3>
              <p className="text-xs text-slate-400">Every single module features a distinct URL and backend API route.</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            {pageEndpoints.length} Live Endpoints
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {pageEndpoints.map((ep, idx) => (
            <div key={idx} className="p-5 hover:bg-slate-50/80 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{ep.page}</h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {ep.method}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ep.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 select-all">
                    {ep.urlPath}
                  </span>
                  <button
                    onClick={() => handleCopy(`${opspulseBackendUrl}${ep.apiRoute.split(" ")[0]}`, `ep-${idx}`)}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs"
                    title="Copy API Route"
                  >
                    {copiedKey === `ep-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px] font-medium hidden sm:inline">Copy URL</span>
                  </button>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="mt-3 bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono flex items-center justify-between overflow-x-auto">
                <span className="text-emerald-400">{ep.method.split(" ")[0]}</span>
                <span className="text-slate-300 flex-1 px-3 truncate">{ep.apiRoute}</span>
                <button
                  onClick={() => handleCopy(`curl -X ${ep.method.split(" ")[0]} "${opspulseBackendUrl}${ep.apiRoute.split(" ")[0]}"`, `curl-${idx}`)}
                  className="text-slate-400 hover:text-white transition-colors text-[11px] flex items-center gap-1 ml-2"
                >
                  {copiedKey === `curl-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                  cURL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
