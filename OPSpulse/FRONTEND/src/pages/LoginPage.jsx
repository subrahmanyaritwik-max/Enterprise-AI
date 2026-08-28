import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOps } from "../context/OpsContext";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound,
  CheckCircle2,
  Building2,
  User
} from "lucide-react";

export const LoginPage = () => {
  const { login } = useAuth();
  const { setActiveTab } = useOps();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Executive / Manager");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const roleProfiles = {
    "Executive / Manager": {
      title: "Executive Manager",
      description: "Full operational oversight, AI daily briefs, cross-department analytics",
      color: "bg-enterprise-600",
      icon: "👔"
    },
    "Department Head": {
      title: "Department Head",
      description: "Department-level workflows, task escalation, team performance",
      color: "bg-navy-800",
      icon: "🏢"
    },
    "Employee": {
      title: "Operations Specialist",
      description: "Task management, order tracking, operational reporting",
      color: "bg-slate-700",
      icon: "👤"
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Invalid credentials: Please enter your work email address.");
      return;
    }

    if (!email.includes("@") || email.trim().length < 5) {
      setErrorMsg("Invalid credentials: Enter a valid work email format (e.g. name@company.com).");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Invalid credentials: Password is required.");
      return;
    }

    if (password.trim().length < 3) {
      setErrorMsg("Invalid credentials: Password must be at least 3 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email: email.trim(),
        password: password.trim(),
        role: selectedRole
      });

      if (result && result.success) {
        setActiveTab("overview");
      } else {
        setErrorMsg(result?.error || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setErrorMsg("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-enterprise-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-slate-900 to-enterprise-950 opacity-90 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-enterprise-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-enterprise-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-enterprise-900/50 border border-enterprise-500/30">
            OP
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OPSpulse Workspace</h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Operational Intelligence Platform</p>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 space-y-6">
          {/* Role Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2.5">Select Role Category</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleProfiles).map(([role, profile]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-xl border-2 transition-all text-center cursor-pointer ${
                    selectedRole === role
                      ? "border-enterprise-600 bg-enterprise-50 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl block mb-1">{profile.icon}</span>
                  <span className={`text-[11px] font-bold block ${
                    selectedRole === role ? "text-enterprise-700" : "text-slate-700"
                  }`}>
                    {profile.title}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center font-medium">
              {roleProfiles[selectedRole].description}
            </p>
          </div>

          <div className="border-t border-slate-100" />

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-400 text-red-700 text-xs p-4 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wider text-[10px] text-red-800">
                  Authentication Error
                </span>
                <p className="font-medium mt-0.5 leading-snug">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Enterprise Work Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className={`w-full bg-slate-50 border rounded-lg pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all ${
                    errorMsg
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-300 focus:border-enterprise-600 focus:ring-enterprise-100"
                  }`}
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className={`w-full bg-slate-50 border rounded-lg pl-10 pr-10 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all ${
                    errorMsg
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-300 focus:border-enterprise-600 focus:ring-enterprise-100"
                  }`}
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-enterprise-600 focus:ring-enterprise-500"
                />
                <span>Remember this device</span>
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery dispatch sent to your registered email address.");
                }}
                className="text-enterprise-600 hover:underline font-semibold"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-enterprise-600 hover:bg-enterprise-700 disabled:bg-enterprise-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-enterprise-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Shield size={14} className="text-slate-400" />
          <span>SOC-2 Type II Certified • Multi-factor Verification</span>
        </div>
      </div>
    </div>
  );
};
