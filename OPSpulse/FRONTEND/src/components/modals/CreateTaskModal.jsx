import React, { useState } from "react";
import { useOps } from "../../context/OpsContext";
import { X, CheckSquare, Plus } from "lucide-react";

export const CreateTaskModal = () => {
  const { isCreateTaskOpen, setIsCreateTaskOpen, createTask, setActiveTab } = useOps();
  const [formData, setFormData] = useState({
    title: "",
    orderNumber: "#1042",
    customer: "ABC Industries",
    owner: "David Chen",
    ownerTitle: "Inventory Manager",
    department: "Inventory Management",
    priority: "High",
    dueDate: "Today, 4:00 PM",
    description: "Verify physical stock availability for Order #1042 and resolve 36-unit shortage discrepancy."
  });

  if (!isCreateTaskOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(formData);
    setIsCreateTaskOpen(false);
    setActiveTab("tasks");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={20} className="text-enterprise-400" />
            <h2 className="text-base font-bold">Create Operational Task</h2>
          </div>
          <button onClick={() => setIsCreateTaskOpen(false)} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Verify stock availability for Order #1042"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-enterprise-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Related Order</label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer</label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assignee</label>
              <select
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
              >
                <option value="David Chen">David Chen (Inventory Manager)</option>
                <option value="Marcus Vance">Marcus Vance (Head of Supply Chain)</option>
                <option value="Robert Sterling">Robert Sterling (Finance Lead)</option>
                <option value="Elena Rostova">Elena Rostova (Sales Head)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & SLA Instructions</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-enterprise-600 hover:bg-enterprise-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Plus size={14} /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
