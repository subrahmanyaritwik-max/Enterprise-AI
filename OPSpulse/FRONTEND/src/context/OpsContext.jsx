import React, { createContext, useContext, useState, useEffect } from "react";

const OpsContext = createContext();

const getTabFromPath = (path) => {
  const p = (path || "").toLowerCase().replace(/\/$/, "") || "/";
  if (p === "" || p === "/" || p === "/home") return { tab: "landing", orderId: null };
  if (p === "/login") return { tab: "login", orderId: null };
  if (p === "/overview" || p === "/dashboard") return { tab: "overview", orderId: null };
  if (p === "/orders") return { tab: "orders", orderId: null };
  if (p.startsWith("/orders/")) {
    const id = decodeURIComponent(p.replace("/orders/", ""));
    return { tab: "order-detail", orderId: id || "ORD-1042" };
  }
  if (p === "/order-detail") return { tab: "order-detail", orderId: "ORD-1042" };
  if (p === "/workflows") return { tab: "workflows", orderId: null };
  if (p === "/tasks") return { tab: "tasks", orderId: null };
  if (p === "/risks") return { tab: "risks", orderId: null };
  if (p === "/departments") return { tab: "departments", orderId: null };
  if (p === "/analytics" || p === "/bottlenecks") return { tab: "analytics", orderId: null };
  if (p === "/records") return { tab: "records", orderId: null };
  if (p === "/api-keys" || p === "/api-docs" || p === "/api") return { tab: "api-keys", orderId: null };
  if (p === "/reports") return { tab: "reports", orderId: null };
  if (p === "/activity") return { tab: "activity", orderId: null };
  if (p === "/notifications") return { tab: "notifications", orderId: null };
  if (p === "/settings") return { tab: "settings", orderId: null };
  return { tab: "overview", orderId: null };
};

const getPathFromTab = (tab, orderId) => {
  switch (tab) {
    case "landing":
      return "/";
    case "login":
      return "/login";
    case "overview":
      return "/overview";
    case "orders":
      return "/orders";
    case "order-detail":
      return `/orders/${orderId || "ORD-1042"}`;
    case "workflows":
      return "/workflows";
    case "tasks":
      return "/tasks";
    case "risks":
      return "/risks";
    case "departments":
      return "/departments";
    case "analytics":
      return "/analytics";
    case "records":
      return "/records";
    case "api-keys":
      return "/api-keys";
    case "reports":
      return "/reports";
    case "activity":
      return "/activity";
    case "notifications":
      return "/notifications";
    case "settings":
      return "/settings";
    default:
      return "/overview";
  }
};

export const OpsProvider = ({ children }) => {
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);
  const [workflows, setWorkflows] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [bottlenecks, setBottlenecks] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial tab and order ID from current URL
  const initialNav = typeof window !== "undefined" ? getTabFromPath(window.location.pathname) : { tab: "landing", orderId: null };
  const [activeTab, setActiveTabState] = useState(initialNav.tab);
  const [selectedOrderId, setSelectedOrderId] = useState(initialNav.orderId || "ORD-1042");
  const [navHistory, setNavHistory] = useState([]);

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // URL synchronization
  const setActiveTab = (newTab, customOrderId = null, pushHistory = true) => {
    setActiveTabState((prev) => {
      if (prev !== newTab && pushHistory) {
        setNavHistory((h) => [...h, prev]);
      }
      return newTab;
    });

    const targetOrderId = customOrderId || selectedOrderId;
    if (customOrderId) {
      setSelectedOrderId(customOrderId);
    }

    if (typeof window !== "undefined" && pushHistory) {
      const targetPath = getPathFromTab(newTab, targetOrderId);
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, "", targetPath);
      }
    }

    // Close mobile drawer on navigation
    setIsMobileDrawerOpen(false);
  };

  const openOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab("order-detail", orderId);
  };

  const goBack = () => {
    setNavHistory((prev) => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        setActiveTab(last || "overview", null, true);
        return prev.slice(0, -1);
      } else {
        setActiveTab("overview", null, true);
        return [];
      }
    });
  };

  // Browser Back/Forward Popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const { tab, orderId } = getTabFromPath(window.location.pathname);
      if (orderId) setSelectedOrderId(orderId);
      setActiveTabState(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Modals & Floating Tools
  const [isDailyBriefOpen, setIsDailyBriefOpen] = useState(false);
  const [isAskOpsOpen, setIsAskOpsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isMitigationWizardOpen, setIsMitigationWizardOpen] = useState(false);
  const [mitigationTarget, setMitigationTarget] = useState("ORD-1042");
  const [isPulseBotOpen, setIsPulseBotOpen] = useState(false);
  const [isAudioBriefingOpen, setIsAudioBriefingOpen] = useState(false);
  const [activeThreatToast, setActiveThreatToast] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        overviewRes,
        ordersRes,
        tasksRes,
        risksRes,
        workflowsRes,
        departmentsRes,
        bottlenecksRes,
        notifRes,
        actRes
      ] = await Promise.all([
        fetch("/api/overview").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/tasks").then((r) => r.json()),
        fetch("/api/risks").then((r) => r.json()),
        fetch("/api/workflows").then((r) => r.json()),
        fetch("/api/departments").then((r) => r.json()),
        fetch("/api/bottlenecks").then((r) => r.json()),
        fetch("/api/notifications").then((r) => r.json()),
        fetch("/api/activities").then((r) => r.json())
      ]);

      setOverview(overviewRes);
      setOrders(ordersRes);
      setTasks(tasksRes);
      setRisks(risksRes);
      setWorkflows(workflowsRes);
      setDepartments(departmentsRes);
      setBottlenecks(bottlenecksRes);
      setNotifications(notifRes);
      setActivities(actRes);
    } catch (err) {
      console.error("OpsContext fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const openMitigationWizard = (orderId = "ORD-1042") => {
    setMitigationTarget(orderId);
    setIsMitigationWizardOpen(true);
  };

  const refreshData = () => {
    fetchAllData();
  };

  const createTask = async (taskData) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });
      const created = await res.json();
      setTasks((prev) => [created, ...(prev || [])]);
      refreshData();
      return created;
    } catch (e) {
      console.error("Create task error:", e);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      refreshData();
      return updated;
    } catch (e) {
      console.error("Update task status error:", e);
    }
  };

  const escalateTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}/escalate`, { method: "POST" });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      refreshData();
      return updated;
    } catch (e) {
      console.error("Escalate task error:", e);
    }
  };

  const resolveRisk = async (id) => {
    try {
      const res = await fetch(`/api/risks/${id}/resolve`, { method: "POST" });
      const updated = await res.json();
      setRisks((prev) => prev.map((r) => (r.id === id ? updated : r)));
      refreshData();
      return updated;
    } catch (e) {
      console.error("Resolve risk error:", e);
    }
  };

  const addComment = async (orderId, text, authorName, authorRole) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, authorName, authorRole })
      });
      const newComment = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, comments: [...(o.comments || []), newComment] } : o
        )
      );
      refreshData();
      return newComment;
    } catch (e) {
      console.error("Add comment error:", e);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error("Mark notification read error:", e);
    }
  };

  return (
    <OpsContext.Provider
      value={{
        overview,
        orders,
        tasks,
        risks,
        workflows,
        departments,
        bottlenecks,
        notifications,
        activities,
        loading,
        activeTab,
        setActiveTab,
        goBack,
        navHistory,
        selectedOrderId,
        setSelectedOrderId,
        openOrderDetail,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        refreshData,
        createTask,
        updateTaskStatus,
        escalateTask,
        resolveRisk,
        addComment,
        markNotificationRead,
        isDailyBriefOpen,
        setIsDailyBriefOpen,
        isAskOpsOpen,
        setIsAskOpsOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        isMitigationWizardOpen,
        setIsMitigationWizardOpen,
        mitigationTarget,
        openMitigationWizard,
        isPulseBotOpen,
        setIsPulseBotOpen,
        isAudioBriefingOpen,
        setIsAudioBriefingOpen,
        activeThreatToast,
        setActiveThreatToast
      }}
    >
      {children}
    </OpsContext.Provider>
  );
};

export const useOps = () => useContext(OpsContext);
