import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common/BackButton";
import { Settings, User, Shield, Bell, Sun, Lock, CheckCircle2 } from "lucide-react";

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage("Settings saved successfully.");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings size={24} className="text-enterprise-600" />
            Enterprise Workspace Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Configure profile preferences, security policies, active sessions, and enterprise notifications.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["Profile", "Workspace", "Notifications", "Security", "Appearance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === tab ? "bg-navy-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 max-w-2xl space-y-6 text-xs">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle2 size={16} />
            <span>Workspace preferences saved successfully.</span>
          </div>
        )}

        {activeTab === "Profile" && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Enterprise Email</label>
              <input
                type="email"
                readOnly
                defaultValue={user.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role & Title</label>
              <input
                type="text"
                readOnly
                defaultValue={`${user.role} — ${user.title}`}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="bg-enterprise-600 hover:bg-enterprise-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
            >
              Save Profile Changes
            </button>
          </form>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Security & Active Sessions</h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Current Active Session</span>
                <span className="text-emerald-600 text-[10px] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              <p className="text-slate-500">Chrome browser on Windows • IP 192.168.1.104 • Logged in today</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSavedMessage("Password reset instructions dispatched to your registered enterprise email.")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Change Enterprise Password
              </button>
            </div>
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Appearance & Theme</h3>
            <p className="text-slate-500">
              OPSpulse is configured with the professional Light Enterprise Navy Blue visual system designed for optimal contrast and readability.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">
              Default Enterprise Light Theme Active
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
