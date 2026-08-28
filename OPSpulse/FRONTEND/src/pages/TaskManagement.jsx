import React, { useState } from "react";
import { useOps } from "../context/OpsContext";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import {
  CheckSquare,
  Plus,
  Clock,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight
} from "lucide-react";

export const TaskManagement = () => {
  const { tasks, updateTaskStatus, escalateTask, setIsCreateTaskOpen, openOrderDetail } = useOps();
  const { user } = useAuth();
  const [filterView, setFilterView] = useState("All");

  const filteredTasks = tasks ? tasks.filter(t => {
    if (filterView === "All") return true;
    if (filterView === "My Tasks") return t.owner.includes(user.name.split(" ")[0]);
    if (filterView === "High Priority") return t.priority === "High" || t.priority === "Critical";
    if (filterView === "Overdue") return t.status === "Overdue" || t.escalated || t.slaMinutesRemaining <= 0;
    if (filterView === "Completed") return t.status === "Completed";
    return true;
  }) : [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare size={24} className="text-enterprise-600" />
            Operational Task Management & SLA Workflow
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track operational assignments, SLA countdowns, and automated SLA breach escalations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTaskOpen(true)}
          className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["All", "My Tasks", "High Priority", "Overdue", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterView(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              filterView === tab
                ? "bg-navy-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isHighPriority = task.priority === "High" || task.priority === "Critical";
          const isEscalated = task.escalated || task.status === "ESCALATED";

          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-4 transition-all ${
                isEscalated ? "border-red-400 bg-red-50/20" : isHighPriority ? "border-amber-300" : "border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-extrabold bg-navy-900 text-white px-2.5 py-1 rounded">
                    {task.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{task.title}</h3>
                    <p className="text-xs text-slate-500">
                      Order: <strong>{task.orderNumber}</strong> ({task.customer}) • Department: <strong>{task.department}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    isHighPriority ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {task.priority} Priority
                  </span>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isEscalated
                      ? "bg-red-600 text-white animate-pulse"
                      : task.status === "Completed"
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">Assignee Owner</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck size={14} className="text-enterprise-600" />
                    {task.owner} ({task.ownerTitle})
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">SLA Due Date</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-600" />
                    {task.dueDate}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-1">Description</span>
                  <p className="text-slate-700 text-[11px] leading-snug">{task.description}</p>
                </div>
              </div>

              {/* Action Buttons & SLA Escalation Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                {isEscalated ? (
                  <div className="text-red-700 font-bold text-xs flex items-center gap-1.5">
                    <ShieldAlert size={16} />
                    <span>Automatically escalated to Department Head Marcus Vance after SLA breach.</span>
                  </div>
                ) : (
                  <div className="text-slate-500 font-medium">
                    SLA Deadline Approaching • Verification required
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {task.orderId && (
                    <button
                      onClick={() => openOrderDetail(task.orderId)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View Order
                    </button>
                  )}

                  {task.status !== "Completed" && (
                    <button
                      onClick={() => updateTaskStatus(task.id, "Completed")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete Task</span>
                    </button>
                  )}

                  {!isEscalated && task.status !== "Completed" && (
                    <button
                      onClick={() => escalateTask(task.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      title="Simulate SLA breach auto-escalation"
                    >
                      <ShieldAlert size={14} />
                      <span>Trigger SLA Breach / Escalate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
