# OPSpulse — Autonomous Enterprise Operations & Intelligence Platform

> **Real-Time Cross-Departmental Operations Intelligence & Autonomous Risk Mitigation Engine**

OPSpulse is a state-of-the-art enterprise operational intelligence platform designed to eliminate silos across Sales, Finance, Inventory, Operations, and Logistics. It detects supply chain discrepancies, credit bottlenecks, and SLA risks in real time and offers 1-click autonomous mitigation.

---

## 🚀 Key Features

- **Operational Command Center**: Real-time cross-departmental health tracking, active order stream, and anomaly detection.
- **Incident Diagnostics & Discrepancy Scanning**: Deep-dive analytics into stock shortages (e.g. Order #1042 SKU-9041 36-unit deficit) with live barcode & CSV upload verification.
- **1-Click Autonomous Mitigation Wizard**: Multi-stage mitigation engine capable of automated buffer inventory rebalancing (Warehouse C → Warehouse B).
- **Executive AI Voice Studio**: Synthesized audio briefing generator with real-time waveform visualization.
- **PulseBot Autonomous AI Mascot & Copilot**: Floating interactive assistant powered by Google Gemini AI with voice synthesis.
- **Queue Delay & Bottleneck Intelligence**: Live latency tracking across approval queues (e.g. Finance Credit Clearance).
- **Task Management & SLA Countdown**: Role-specific task assignment with automated escalation triggers.
- **Role-Based Workspaces**: Tailored perspectives for Executive Managers, Department Heads, and Operations Specialists.
- **Native Direct File Exports**: Instant CSV and TXT dataset downloads without browser popups.
- **Responsive Mobile Application Design**: Native slide-out drawers, mobile bottom navigation, and fluid layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Motion (Framer Motion), Lucide React, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express.js, REST API, Google Gemini AI Engine.

---

## 📦 Getting Started

### 1. Backend Setup
```bash
cd OPSpulse/BACKEND
npm install
cp .env.example .env
# Add your GEMINI_API_KEY in .env
node src/server.js
```

### 2. Frontend Setup
```bash
cd OPSpulse/FRONTEND
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Note
Environment files (`.env`) containing sensitive credentials and API keys are strictly excluded from version control via `.gitignore`.
