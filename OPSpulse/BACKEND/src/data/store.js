import { initialSeedData } from "./seedData.js";

class OpsStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
  }

  getOverview() {
    const activeOrders = this.data.orders.filter(o => o.status !== "Completed").length;
    const ordersAtRisk = this.data.orders.filter(o => o.status === "At Risk").length;
    const pendingApprovals = this.data.orders.filter(o => o.status === "Pending Approval" || o.stages.finance.status === "Pending").length;
    const overdueTasks = this.data.tasks.filter(t => t.status === "Overdue" || t.escalated || t.slaMinutesRemaining <= 0).length;

    const attentionItems = [
      {
        id: "ATTN-1042",
        orderId: "ORD-1042",
        orderNumber: "#1042",
        customer: "ABC Industries",
        type: "Delivery Risk",
        badge: "HIGH RISK",
        title: "Order #1042 Fulfillment Shortage",
        inventoryDiscrepancy: "36 units",
        orderedQuantity: 120,
        availableInventory: 84,
        deadline: "Tomorrow, 5:00 PM",
        affectedDepartments: ["Sales", "Inventory", "Operations", "Logistics"],
        description: "Confirmed sales quantity (120 units) exceeds available warehouse stock (84 units). High risk of missed delivery commitment."
      },
      {
        id: "ATTN-FINANCE",
        type: "Workflow Bottleneck",
        badge: "BOTTLENECK",
        title: "Finance Approval Backlog",
        backlogCount: 18,
        averageDelay: "8.7 hours",
        affectedDepartment: "Finance",
        description: "18 high-value commercial orders waiting in finance approval queue. Processing time exceeds target SLA by 4.2 hours."
      },
      {
        id: "ATTN-SYNC",
        type: "Data Inconsistency",
        badge: "WARNING",
        title: "Inventory Data Conflict",
        description: "Two operational data sources (SAP ERP vs WMS Scanner logs) report conflicting physical stock counts for SKU-8849.",
        affectedDepartment: "Inventory"
      }
    ];

    return {
      summary: {
        activeOrders,
        ordersAtRisk,
        pendingApprovals,
        overdueTasks
      },
      attentionItems
    };
  }

  getOrders() {
    return this.data.orders;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  getTasks() {
    return this.data.tasks;
  }

  createTask(taskData) {
    const newTask = {
      id: `TASK-${Math.floor(700 + Math.random() * 200)}`,
      title: taskData.title || "New Operational Task",
      orderId: taskData.orderId || null,
      orderNumber: taskData.orderNumber || "N/A",
      customer: taskData.customer || "General Operations",
      owner: taskData.owner || "David Chen",
      ownerTitle: taskData.ownerTitle || "Inventory Manager",
      department: taskData.department || "Inventory Management",
      priority: taskData.priority || "High",
      dueDate: taskData.dueDate || "Today, 5:00 PM",
      slaMinutesRemaining: taskData.slaMinutesRemaining || 180,
      status: "Pending",
      escalated: false,
      escalatedTo: null,
      description: taskData.description || "",
      createdAt: new Date().toISOString()
    };

    this.data.tasks.unshift(newTask);

    // Record Activity
    this.data.activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      actor: "Current User",
      actorRole: "Operations User",
      event: "Task Created",
      title: `Created task ${newTask.id}`,
      details: `${newTask.title} assigned to ${newTask.owner}.`,
      relatedObject: newTask.id,
      category: "Task"
    });

    return newTask;
  }

  updateTaskStatus(id, status) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return null;

    task.status = status;

    this.data.activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      actor: "Current User",
      actorRole: "Operations Manager",
      event: "Task Status Updated",
      title: `Task ${task.id} marked as ${status}`,
      details: `Status changed to ${status} for task: ${task.title}.`,
      relatedObject: task.id,
      category: "Task"
    });

    return task;
  }

  escalateTask(id) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return null;

    task.status = "ESCALATED";
    task.escalated = true;
    task.escalatedTo = "Marcus Vance (Department Head)";
    task.owner = "Marcus Vance";
    task.ownerTitle = "Head of Inventory & Logistics";
    task.priority = "Critical";
    task.slaMinutesRemaining = 0;

    // Record Activity
    this.data.activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      actor: "OPSpulse SLA Engine",
      actorRole: "Automated Escalation",
      event: "SLA Breach Escalation",
      title: `Task ${task.id} automatically escalated after SLA breach`,
      details: `Verification deadline breached. Reassigned from David Chen to Department Head Marcus Vance. Escalation alert sent.`,
      relatedObject: task.id,
      category: "Automated Escalation"
    });

    // Add Notification
    this.data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: "SLA breach",
      iconType: "red",
      title: `ESCALATED: Task ${task.id} SLA Breached`,
      message: `Task "${task.title}" exceeded maximum SLA duration. Escalated to Department Head Marcus Vance.`,
      orderId: task.orderId,
      taskId: task.id,
      timestamp: "Just now",
      read: false
    });

    return task;
  }

  getRisks() {
    return this.data.risks;
  }

  resolveRisk(id) {
    const risk = this.data.risks.find(r => r.id === id || r.riskId === id);
    if (!risk) return null;

    risk.status = "Resolved";

    if (risk.orderId) {
      const order = this.data.orders.find(o => o.id === risk.orderId);
      if (order && order.id === "ORD-1042") {
        order.status = "In Progress";
        order.riskLevel = "Low";
        order.stages.inventory.status = "Completed";
        order.stages.inventory.note = "Inventory discrepancy verified & stock reallocated";
      }
    }

    this.data.activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      actor: "Current User",
      actorRole: "Operations Manager",
      event: "Risk Resolved",
      title: `Risk ${risk.riskId} marked as Resolved`,
      details: `Resolution action confirmed for: ${risk.title}.`,
      relatedObject: risk.riskId,
      category: "Risk"
    });

    return risk;
  }

  getWorkflows() {
    const order1042 = this.getOrderById("ORD-1042");
    return {
      activeWorkflowName: "Order Fulfillment Workflow",
      selectedOrder: order1042,
      stages: [
        {
          name: "Sales Confirmation",
          code: "SALES",
          status: "Completed",
          owner: "Sales Team (Elena Rostova)",
          duration: "30 mins",
          deadline: "Yesterday, 3:30 PM",
          reasonBlocked: null
        },
        {
          name: "Finance Credit Approval",
          code: "FINANCE",
          status: "Completed",
          owner: "Finance Team (Robert Sterling)",
          duration: "2h 15m",
          deadline: "Yesterday, 6:00 PM",
          reasonBlocked: null
        },
        {
          name: "Inventory Availability Verification",
          code: "INVENTORY",
          status: "Blocked",
          owner: "Inventory Team (David Chen)",
          duration: "5h 24m waiting",
          deadline: "Today, 4:00 PM",
          reasonBlocked: "Quantity discrepancy: 120 ordered vs 84 physically available in stock."
        },
        {
          name: "Operations & Packing",
          code: "OPERATIONS",
          status: "Pending",
          owner: "Fulfillment Operations",
          duration: "0 mins",
          deadline: "Tomorrow, 10:00 AM",
          reasonBlocked: "Waiting for inventory stage clearance."
        },
        {
          name: "Logistics Dispatch & Delivery",
          code: "LOGISTICS",
          status: "Scheduled",
          owner: "Logistics Team (Karan Patel)",
          duration: "Pending",
          deadline: "Tomorrow, 5:00 PM",
          reasonBlocked: "Awaiting physical packing completion."
        }
      ]
    };
  }

  getDepartments() {
    return this.data.departments;
  }

  getBottlenecks() {
    return {
      summary: "31% of delayed orders are currently waiting for finance approval.",
      primaryBottleneck: {
        department: "Finance",
        avgProcessingTimeHours: 8.7,
        slaBreachesCount: 6,
        currentBacklogCount: 18,
        status: "BOTTLENECK",
        impactDescription: "Finance credit verification queue is taking 8.7 hours on average, causing cascading delays downstream in Inventory & Logistics.",
        recommendedAction: "Review finance approval capacity, reassign secondary reviewer, or implement automated credit line thresholds for Tier 1 Enterprise accounts."
      },
      stagesMetrics: [
        { name: "Sales", avgProcessing: "1.8h", backlog: 4, slaBreaches: 0, status: "Optimal" },
        { name: "Finance", avgProcessing: "8.7h", backlog: 18, slaBreaches: 6, status: "BOTTLENECK" },
        { name: "Inventory", avgProcessing: "4.2h", backlog: 8, slaBreaches: 2, status: "Attention Required" },
        { name: "Operations", avgProcessing: "3.1h", backlog: 5, slaBreaches: 1, status: "Optimal" },
        { name: "Logistics", avgProcessing: "5.0h", backlog: 5, slaBreaches: 1, status: "Optimal" }
      ]
    };
  }

  addComment(orderId, text, authorName, authorRole) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const newComment = {
      id: `cmt-${Date.now()}`,
      author: authorName || "Current User",
      role: authorRole || "Operations Specialist",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    order.comments.push(newComment);

    this.data.activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      actor: newComment.author,
      actorRole: newComment.role,
      event: "Comment Added",
      title: `Added update to ${order.orderNumber}`,
      details: text,
      relatedObject: order.orderNumber,
      category: "Collaboration"
    });

    return newComment;
  }

  generateDailyBrief() {
    const activeCount = this.data.orders.filter(o => o.status !== "Completed").length;
    const atRiskCount = this.data.orders.filter(o => o.status === "At Risk").length;
    const financeDept = this.data.departments.find(d => d.code === "FINANCE");

    return {
      title: "TODAY'S OPERATIONAL BRIEF",
      generatedAt: new Date().toLocaleString(),
      summaryBullets: [
        `${activeCount} active orders currently require operational monitoring.`,
        `${atRiskCount} orders have a high probability of delay if not resolved today.`,
        `Finance currently has the largest approval backlog (${financeDept ? financeDept.backlogCount : 18} orders pending, 8.7h avg delay).`,
        `2 inventory data inconsistencies were detected between ERP and WMS warehouse scans.`
      ],
      recommendedPriorities: [
        {
          step: 1,
          title: "Resolve Order #1042 Inventory Discrepancy",
          action: "Verify stock availability and clear the 36-unit shortage before tomorrow's 5:00 PM delivery deadline.",
          targetId: "ORD-1042"
        },
        {
          step: 2,
          title: "Review Finance Approval Backlog",
          action: "Reassign pending credit check approvals to secondary reviewer to clear 18 waiting orders.",
          targetId: "dept-finance"
        },
        {
          step: 3,
          title: "Investigate Inventory Data Inconsistencies",
          action: "Run automated reconciliation script to synchronize ERP and physical warehouse stock records.",
          targetId: "RISK-1034"
        }
      ]
    };
  }

  askOperations(userQuery) {
    const queryLower = (userQuery || "").toLowerCase();

    if (queryLower.includes("prioritize") || queryLower.includes("first")) {
      return {
        query: userQuery,
        answer: "Order #1042 (ABC Industries) should be your #1 operational priority right now.",
        reason: "Confirmed sales quantity (120 units) exceeds available warehouse inventory (84 units) with a hard delivery commitment scheduled for tomorrow 5:00 PM.",
        affectedData: "Order #1042 • 36-unit stock shortage • ₹2,40,000 order value • Affected depts: Sales, Inventory, Operations, Logistics",
        recommendedAction: "Verify physical stock in Warehouse B, create an urgent inventory verification task (TASK-781), or reallocate 36 units from Hub C to release the shipment."
      };
    }

    if (queryLower.includes("1042") || queryLower.includes("why") && queryLower.includes("risk")) {
      return {
        query: userQuery,
        answer: "Order #1042 is at high risk because sales confirmed 120 units while warehouse physical stock only shows 84 units.",
        reason: "Stock shortage of 36 units will prevent full order dispatch scheduled for tomorrow morning.",
        affectedData: "ABC Industries • Value: ₹2,40,000 • Ordered: 120 • Stock: 84 • Delivery: Tomorrow 5:00 PM",
        recommendedAction: "Execute Task TASK-781 to re-audit physical stock or request customer authorization for partial 84-unit release."
      };
    }

    if (queryLower.includes("department") || queryLower.includes("delay") || queryLower.includes("bottleneck")) {
      return {
        query: userQuery,
        answer: "The Finance Department is causing the most operational delays across the enterprise.",
        reason: "Finance has 18 pending order approvals with an average processing time of 8.7 hours (exceeding SLA by 4.2 hours). 31% of all delayed orders are waiting in the finance queue.",
        affectedData: "Finance Dept • 18 Backlog Orders • 8.7h Avg Delay • 6 SLA Breaches",
        recommendedAction: "Increase review capacity by delegating auto-approval thresholds for Tier 1 Enterprise customers."
      };
    }

    return {
      query: userQuery,
      answer: "Operational analysis indicates Order #1042 and the Finance approval queue require immediate managerial focus.",
      reason: "Inventory shortage on Order #1042 poses immediate delivery breach risk tomorrow, while Finance backlog represents the broadest structural bottleneck.",
      affectedData: "Order #1042 (High Risk) • Finance Backlog (18 items) • 2 Active Data Conflicts",
      recommendedAction: "1. Address Order #1042 stock audit. 2. Clear Finance approval queue. 3. Rebalance warehouse stock records."
    };
  }

  search(query) {
    const q = (query || "").toLowerCase().trim();
    if (!q) return { orders: [], tasks: [], risks: [], departments: [] };

    const matchingOrders = this.data.orders.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      o.riskLevel.toLowerCase().includes(q)
    );

    const matchingTasks = this.data.tasks.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.owner.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    );

    const matchingRisks = this.data.risks.filter(r =>
      r.riskId.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.severity.toLowerCase().includes(q)
    );

    const matchingDepts = this.data.departments.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.head.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    );

    return {
      orders: matchingOrders,
      tasks: matchingTasks,
      risks: matchingRisks,
      departments: matchingDepts
    };
  }

  getNotifications() {
    return this.data.notifications;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return this.data.notifications;
  }

  getActivities() {
    return this.data.activities;
  }
}

export const store = new OpsStore();
