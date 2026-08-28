import React, { useState } from "react";
import { useOps } from "../context/OpsContext";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import {
  PackageCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  UserPlus,
  ArrowLeft,
  Calendar,
  Building2,
  AlertTriangle
} from "lucide-react";

export const OrderDetail = () => {
  const { orders, selectedOrderId, addComment, setIsCreateTaskOpen, setActiveTab, goBack } = useOps();
  const { user } = useAuth();

  const [commentText, setCommentText] = useState("");

  const order = orders ? orders.find(o => o.id === selectedOrderId || o.orderNumber === selectedOrderId) || orders[0] : null;

  if (!order) {
    return <div className="p-8 text-center text-slate-500">Order not found.</div>;
  }

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addComment(order.id, commentText, user.name, user.department);
    setCommentText("");
  };

  const isRisk = order.status === "At Risk";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <BackButton label="Back" fallbackTab="orders" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ORDER {order.orderNumber}</h1>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                isRisk ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Customer: <strong className="text-slate-800">{order.customer}</strong> ({order.customerTier})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus size={16} />
            <span>Create Verification Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Value</span>
          <span className="text-xl font-extrabold text-slate-900">{order.orderValue}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Deadline</span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-1">
            <Calendar size={14} className="text-slate-400" />
            {order.deliveryDeadline}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Quantity</span>
          <span className="text-xl font-extrabold text-slate-900">{order.orderedQuantity} units</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Stock</span>
          <span className={`text-xl font-extrabold ${order.shortageQuantity > 0 ? "text-amber-600" : "text-emerald-600"}`}>
            {order.availableInventory} units
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discrepancy</span>
          <span className={`text-xl font-extrabold ${order.shortageQuantity > 0 ? "text-red-600" : "text-slate-500"}`}>
            {order.shortageQuantity > 0 ? `-${order.shortageQuantity} units` : "None"}
          </span>
        </div>
      </div>

      {/* Department Stage Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Cross-Department Fulfillment Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { stage: "Sales", data: order.stages.sales },
            { stage: "Finance", data: order.stages.finance },
            { stage: "Inventory", data: order.stages.inventory },
            { stage: "Operations", data: order.stages.operations },
            { stage: "Logistics", data: order.stages.logistics }
          ].map((item, idx) => {
            const status = item.data?.status || "Pending";
            const isDone = status === "Completed";
            const isAttention = status === "Attention Required";
            const isBlocked = status === "Blocked";

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 transition-all ${
                  isDone
                    ? "bg-emerald-50/40 border-emerald-200"
                    : isAttention || isBlocked
                    ? "bg-red-50 border-red-300"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{item.stage}</span>
                  {isDone && <CheckCircle2 size={16} className="text-emerald-600" />}
                  {(isAttention || isBlocked) && <ShieldAlert size={16} className="text-red-600 animate-pulse" />}
                </div>

                <div className="space-y-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    isDone ? "bg-emerald-100 text-emerald-800" : (isAttention || isBlocked) ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {status}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium pt-1">{item.data?.owner}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reasoning & Recommendation Cards */}
      {isRisk && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 space-y-2">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={16} /> WHY IS THIS AT RISK?
            </h3>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {order.whyAtRisk}
            </p>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-2">
            <h3 className="text-xs font-bold text-enterprise-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={16} /> RECOMMENDED ACTION
            </h3>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {order.recommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* Collaboration Stream & Comments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-enterprise-600" />
            Cross-Department Activity Stream & Updates
          </h3>
          <span className="text-xs text-slate-400 font-medium">Sales • Inventory • Operations • Logistics</span>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post an operational update or status comment..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-enterprise-600"
          />
          <button
            type="submit"
            className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Post</span>
            <Send size={14} />
          </button>
        </form>

        {/* Existing Comments List */}
        <div className="space-y-3">
          {order.comments && order.comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{comment.author}</span>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {comment.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
