import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Auth
router.get("/auth/directory", (req, res) => {
  const users = store.data.users.map(u => ({
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    title: u.title,
    avatar: u.avatar
  }));
  res.json({ success: true, users });
});

router.post("/auth/login", (req, res) => {
  const { email, password, role, name } = req.body;
  const users = store.data.users;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials: Email and password are required."
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials: Please enter a valid email format."
    });
  }

  if (password.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials: Password must be at least 3 characters."
    });
  }

  // Check if email matches an existing registered seed record
  const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (matchedUser) {
    return res.json({
      success: true,
      token: `token-${Date.now()}`,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        department: matchedUser.department,
        avatar: matchedUser.avatar,
        title: matchedUser.title
      }
    });
  }

  // Dynamic user creation for ANY valid person and email
  let derivedName = name?.trim();
  if (!derivedName) {
    const prefix = cleanEmail.split("@")[0];
    derivedName = prefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const selectedRole = role || "Executive / Manager";
  const userAvatar = derivedName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const newUser = {
    id: `usr-${Date.now()}`,
    name: derivedName,
    email: cleanEmail,
    role: selectedRole,
    department: selectedRole === "Department Head" ? "Supply Chain & Logistics" : selectedRole === "Employee" ? "Inventory Management" : "Executive Operations",
    avatar: userAvatar,
    title: selectedRole === "Department Head" ? "Head of Inventory & Logistics" : selectedRole === "Employee" ? "Senior Operations Specialist" : "VP of Enterprise Operations"
  };

  return res.json({
    success: true,
    token: `token-${Date.now()}`,
    user: newUser
  });
});

// Overview
router.get("/overview", (req, res) => {
  res.json(store.getOverview());
});

// Orders
router.get("/orders", (req, res) => {
  res.json(store.getOrders());
});

router.get("/orders/:id", (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

router.post("/orders/:id/comments", (req, res) => {
  const { text, authorName, authorRole } = req.body;
  const comment = store.addOrderComment(req.params.id, { text, authorName, authorRole });
  if (!comment) return res.status(404).json({ error: "Order not found" });
  res.json(comment);
});

// Tasks
router.get("/tasks", (req, res) => {
  res.json(store.getTasks());
});

router.post("/tasks", (req, res) => {
  const task = store.createTask(req.body);
  res.status(201).json(task);
});

router.patch("/tasks/:id/status", (req, res) => {
  const task = store.updateTaskStatus(req.params.id, req.body.status);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.post("/tasks/:id/escalate", (req, res) => {
  const task = store.escalateTask(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// Risks
router.get("/risks", (req, res) => {
  res.json(store.getRisks());
});

router.post("/risks/:id/resolve", (req, res) => {
  const risk = store.resolveRisk(req.params.id);
  if (!risk) return res.status(404).json({ error: "Risk not found" });
  res.json(risk);
});

// Workflows
router.get("/workflows", (req, res) => {
  res.json(store.getWorkflows());
});

// Departments
router.get("/departments", (req, res) => {
  res.json(store.getDepartments());
});

// Bottlenecks
router.get("/bottlenecks", (req, res) => {
  res.json(store.getBottlenecks());
});

// Notifications
router.get("/notifications", (req, res) => {
  res.json(store.getNotifications());
});

router.patch("/notifications/:id/read", (req, res) => {
  const notif = store.markNotificationRead(req.params.id);
  if (!notif) return res.status(404).json({ error: "Notification not found" });
  res.json(notif);
});

// Activity
router.get("/activities", (req, res) => {
  res.json(store.getActivities());
});

// Search with Natural Language and Intent recognition
router.get("/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  if (!query) {
    return res.json({ orders: [], tasks: [], risks: [], departments: [] });
  }

  const allOrders = store.getOrders() || [];
  const allTasks = store.getTasks() || [];
  const allRisks = store.getRisks() || [];
  const allDepts = store.getDepartments() || [];

  const tokens = query.split(/\s+/).filter(t => !["the", "a", "an", "for", "to", "in", "of", "and", "is", "are", "show", "me", "which"].includes(t));

  // Check natural language intents
  const isRiskIntent = query.includes("risk") || query.includes("shortage") || query.includes("delay") || query.includes("danger") || query.includes("incident");
  const isFinanceIntent = query.includes("finance") || query.includes("credit") || query.includes("approval");
  const isInventoryIntent = query.includes("inventory") || query.includes("stock") || query.includes("warehouse") || query.includes("sku");
  const isLogisticsIntent = query.includes("logistics") || query.includes("carrier") || query.includes("truck") || query.includes("transit");

  const matchesText = (str) => {
    if (!str) return false;
    const s = String(str).toLowerCase();
    if (s.includes(query)) return true;
    return tokens.some(t => s.includes(t));
  };

  const matchedOrders = allOrders.filter(o => {
    if (isRiskIntent && (o.status === "At Risk" || o.deliveryRisk || (o.notes && o.notes.toLowerCase().includes("shortage")))) return true;
    if (isFinanceIntent && (o.status?.toLowerCase().includes("pending") || o.currentDepartment === "Finance")) return true;
    if (isInventoryIntent && (o.currentDepartment === "Inventory" || o.items?.some(i => i.sku?.toLowerCase().includes("sku")))) return true;
    return (
      matchesText(o.id) ||
      matchesText(o.orderNumber) ||
      matchesText(o.customer) ||
      matchesText(o.status) ||
      matchesText(o.currentDepartment) ||
      matchesText(o.delayCause) ||
      o.items?.some(it => matchesText(it.sku) || matchesText(it.name))
    );
  });

  const matchedTasks = allTasks.filter(t => {
    if (isRiskIntent && (t.priority === "HIGH" || t.priority === "CRITICAL")) return true;
    if (isFinanceIntent && t.department === "Finance") return true;
    if (isInventoryIntent && t.department === "Inventory") return true;
    return (
      matchesText(t.id) ||
      matchesText(t.title) ||
      matchesText(t.description) ||
      matchesText(t.assignee) ||
      matchesText(t.department) ||
      matchesText(t.priority) ||
      matchesText(t.status)
    );
  });

  const matchedRisks = allRisks.filter(r => {
    if (isRiskIntent) return true;
    return (
      matchesText(r.id) ||
      matchesText(r.title) ||
      matchesText(r.description) ||
      matchesText(r.department) ||
      matchesText(r.severity) ||
      matchesText(r.mitigationStrategy)
    );
  });

  const matchedDepartments = allDepts.filter(d => {
    return (
      matchesText(d.id) ||
      matchesText(d.name) ||
      matchesText(d.headName) ||
      matchesText(d.status) ||
      matchesText(d.description)
    );
  });

  res.json({
    orders: matchedOrders,
    tasks: matchedTasks,
    risks: matchedRisks,
    departments: matchedDepartments
  });
});

// AI Operations Decision Support (Gemini API integrated)
router.post("/ai/ask-operations", async (req, res) => {
  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  const orders = store.getOrders() || [];
  const risks = store.getRisks() || [];
  const bottlenecks = store.getBottlenecks() || {};

  const order1042 = orders.find(o => o.orderNumber === "ORD-1042") || orders[0];

  // Try calling Google Gemini API if key is set
  if (apiKey && apiKey.length > 10) {
    try {
      const promptText = `You are OPSpulse AI, an enterprise operations intelligence assistant. The current live enterprise state has:
- Order #1042 (ABC Industries, ₹2,40,000) has a 36-unit physical stock shortage on SKU-9041 (120 confirmed vs 84 physical stock in Warehouse B). Buffer stock of 52 units exists in Warehouse C (Hub South).
- Finance department credit approvals queue is stalling 18 orders with average delay of 8.7 hours.
- Task SLA TASK-781 for stock recount by David Chen is approaching deadline.

User Query: "${query}"

Provide a concise, direct operational diagnosis with exact recommended action steps.`;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return res.json({
            success: true,
            source: "Google Gemini 1.5 Flash AI Engine",
            answer: generatedText,
            recommendedAction: "Execute 1-Click Inter-Warehouse Rebalance from Warehouse C to prevent SLA breach.",
            relatedOrderId: "ORD-1042"
          });
        }
      }
    } catch (e) {
      console.warn("Gemini API call warning, falling back to structured operational reasoning:", e.message);
    }
  }

  // Structured Operational Reasoning Fallback
  const q = (query || "").toLowerCase();
  let answer = "Based on live operational telemetry across all 5 departments, the primary critical risk is Order #1042 (ABC Industries) facing a 36-unit shortage on SKU-9041. Immediate inter-warehouse stock rebalancing is recommended.";
  let rec = "Execute 1-Click Autonomous Mitigation Wizard to transfer 36 buffer units from Hub South.";
  let orderId = "ORD-1042";

  if (q.includes("finance") || q.includes("bottleneck") || q.includes("delay")) {
    answer = "The Finance Credit Queue is currently the primary operational bottleneck, holding 18 orders with an average processing delay of 8.7 hours due to manual dual-signature thresholds.";
    rec = "Fast-track VIP enterprise approvals to unblock ₹18.4 Lakhs in pending fulfillment.";
    orderId = null;
  } else if (q.includes("prioritize") || q.includes("first")) {
    answer = "Priority #1 is resolving the stock deficit on Order #1042 (due tomorrow, ₹2,40,000 at risk). Priority #2 is clearing the Finance approval backlog.";
    rec = "1-Click Rebalance Order #1042, then dispatch batch credit authorization.";
  }

  return res.json({
    success: true,
    source: "OPSpulse Autonomous Intelligence Engine",
    answer,
    recommendedAction: rec,
    relatedOrderId: orderId
  });
});

// AI Daily Executive Brief
router.get("/ai/daily-brief", (req, res) => {
  res.json({
    date: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }),
    summary: "Operational health across 5 departments is 94.2%. 1 high-severity delivery risk detected on Order #1042 (36-unit physical stock shortage). Finance credit approvals queue is experiencing an 8.7h processing latency holding 18 orders.",
    criticalRiskCount: 1,
    bottlenecksCount: 1,
    totalActiveOrders: 24,
    revenueAtRisk: "₹2,40,000",
    suggestedActions: [
      "Trigger autonomous inter-warehouse rebalance for Order #1042 (36 units from Warehouse C).",
      "Authorize VIP tier-1 credit bypass for 18 stalled finance queue orders.",
      "Assign secondary reviewer to assist David Chen on TASK-781 stock audit."
    ]
  });
});

export default router;
