import React from "react";
import { useOps } from "../../context/OpsContext";
import { useAuth } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { PulseBotRobot } from "./PulseBotRobot";
import { LiveThreatToast } from "./LiveThreatToast";

// Pages
import { LandingPage } from "../../pages/LandingPage";
import { LoginPage } from "../../pages/LoginPage";
import { OverviewDashboard } from "../../pages/OverviewDashboard";
import { RiskCenter } from "../../pages/RiskCenter";
import { OrderDetail } from "../../pages/OrderDetail";
import { WorkflowView } from "../../pages/WorkflowView";
import { TaskManagement } from "../../pages/TaskManagement";
import { BottleneckIntelligence } from "../../pages/BottleneckIntelligence";
import { DepartmentPerformance } from "../../pages/DepartmentPerformance";
import { ReportsPage } from "../../pages/ReportsPage";
import { ActivityCenter } from "../../pages/ActivityCenter";
import { NotificationsPage } from "../../pages/NotificationsPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { ApiKeysPage } from "../../pages/ApiKeysPage";
import { RecordsPage } from "../../pages/RecordsPage";

// Modals
import { AiDailyBriefModal } from "../modals/AiDailyBriefModal";
import { DecisionSupportModal } from "../modals/DecisionSupportModal";
import { GlobalSearchModal } from "../modals/GlobalSearchModal";
import { CreateTaskModal } from "../modals/CreateTaskModal";
import { MitigationWizardModal } from "../modals/MitigationWizardModal";
import { ExecutiveAudioBriefingModal } from "../modals/ExecutiveAudioBriefingModal";

export const AppShell = () => {
  const { activeTab } = useOps();
  const { isAuthenticated } = useAuth();

  // Public pages — accessible without authentication
  if (activeTab === "landing") {
    return <LandingPage />;
  }

  // If not authenticated, always show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "orders":
        return <OverviewDashboard />;
      case "order-detail":
        return <OrderDetail />;
      case "workflows":
        return <WorkflowView />;
      case "tasks":
        return <TaskManagement />;
      case "risks":
        return <RiskCenter />;
      case "departments":
        return <DepartmentPerformance />;
      case "analytics":
        return <BottleneckIntelligence />;
      case "records":
        return <RecordsPage />;
      case "api-keys":
        return <ApiKeysPage />;
      case "reports":
        return <ReportsPage />;
      case "activity":
        return <ActivityCenter />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-enterprise-600 selection:text-white relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-20 md:pb-0">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Floating AI Robot Mascot & Copilot at Right */}
      <PulseBotRobot />

      {/* Proactive Real-Time Threat Signal Toast */}
      <LiveThreatToast />

      {/* High-Impact Modals & Popups */}
      <AiDailyBriefModal />
      <DecisionSupportModal />
      <GlobalSearchModal />
      <CreateTaskModal />
      <MitigationWizardModal />
      <ExecutiveAudioBriefingModal />
    </div>
  );
};
