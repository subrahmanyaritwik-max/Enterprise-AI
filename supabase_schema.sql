-- ====================================================================
-- OPSpulse Enterprise Intelligence — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  value TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  sla_deadline TEXT,
  progress INTEGER DEFAULT 0,
  departments JSONB DEFAULT '[]'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  discrepancies JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_id TEXT,
  assignee TEXT NOT NULL,
  department TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  due_time TEXT,
  escalated BOOLEAN DEFAULT FALSE,
  escalation_level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  severity TEXT NOT NULL,
  impact TEXT,
  mitigation_strategy TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  head_name TEXT NOT NULL,
  active_orders INTEGER DEFAULT 0,
  cycle_time_hours NUMERIC DEFAULT 0,
  throughput_rate NUMERIC DEFAULT 0,
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  order_id TEXT,
  read BOOLEAN DEFAULT FALSE,
  timestamp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  timestamp TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) & Allow Read/Write
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for risks" ON risks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for activities" ON activities FOR ALL USING (true) WITH CHECK (true);

-- 3. Initial Seed Data
INSERT INTO orders (id, order_number, customer_name, value, status, priority, sla_deadline, progress, departments, items, discrepancies, comments)
VALUES 
(
  'ord-1042',
  'ORD-1042',
  'ABC Industries',
  '₹2,40,000',
  'At Risk',
  'High',
  'Tomorrow, 4:00 PM',
  40,
  '["Sales", "Finance", "Inventory", "Operations", "Logistics"]'::jsonb,
  '[
    {"sku": "SKU-9041", "name": "Precision Hydraulic Valve Assembly", "ordered": 120, "physicalStock": 84, "discrepancy": 36, "unit": "units", "warehouse": "Warehouse B", "bufferWarehouse": "Warehouse C (Hub South, 52 units)"},
    {"sku": "SKU-8820", "name": "Reinforced High-Pressure Seal Ring", "ordered": 240, "physicalStock": 240, "discrepancy": 0, "unit": "units", "warehouse": "Warehouse B", "bufferWarehouse": "None"}
  ]'::jsonb,
  '[
    {"type": "Stock Shortage", "sku": "SKU-9041", "deficit": 36, "impact": "High Delivery Failure SLA Breach Risk", "bufferAvailable": 52, "sourceHub": "Warehouse C"}
  ]'::jsonb,
  '[
    {"id": "c1", "author": "David Chen", "role": "Inventory Specialist", "text": "Re-counting SKU-9041 in Warehouse B Bin 4B. Confirmed 36 units deficit from invoice.", "timestamp": "10:15 AM"},
    {"id": "c2", "author": "Marcus Vance", "role": "Head of Operations", "text": "Warehouse C buffer transfer prepared. Waiting on 1-click rebalance approval.", "timestamp": "10:45 AM"}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, title, description, order_id, assignee, department, priority, status, due_time, escalated, escalation_level)
VALUES
('TASK-781', 'Physical Stock Recount — SKU-9041', 'Conduct recount of Precision Valve Assemblies in Warehouse B Bin 4B for Order #1042.', 'ORD-1042', 'David Chen', 'Inventory', 'Urgent', 'In Progress', '1h 45m remaining', false, 0),
('TASK-782', 'Fast-Track Credit Approval Batch', 'Release 18 commercial credit holds exceeding 8-hour latency threshold.', 'ORD-1044', 'Sarah Jenkins', 'Finance', 'High', 'Pending', '3h remaining', true, 1),
('TASK-783', 'Carrier Dispatch Route Optimization', 'Verify refrigerated transport allocation for Apex Healthcare consignment.', 'ORD-1038', 'Alex Rivera', 'Logistics', 'Normal', 'Completed', 'Done', false, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO risks (id, order_id, title, description, department, severity, impact, mitigation_strategy, status)
VALUES
('RISK-101', 'ORD-1042', 'Physical Inventory Shortage (36 units)', 'Confirmed shortage on SKU-9041 threatens SLA delivery for ABC Industries.', 'Inventory', 'Critical', '₹2,40,000 revenue & contract penalty at risk', 'Execute 1-click autonomous stock rebalance from Warehouse C.', 'Active'),
('RISK-102', 'ORD-1044', 'Finance Credit Approval Queue Latency', '18 orders experiencing average 8.7h delay waiting on credit clearance.', 'Finance', 'Medium', 'Delayed dispatch for ₹18.4L in commercial orders', 'Bypass dual-signature requirement for Tier-1 approved clients.', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name, head_name, active_orders, cycle_time_hours, throughput_rate, status, description)
VALUES
('dept-sales', 'Sales & Order Intake', 'Elena Rostova', 6, 2.1, 98.2, 'Optimal', 'Handles incoming commercial order contracts and customer specifications.'),
('dept-finance', 'Finance & Credit Risk', 'Sarah Jenkins', 18, 8.7, 72.4, 'Delayed', 'Responsible for buyer credit assessments and payment milestone clearance.'),
('dept-inventory', 'Inventory & Warehousing', 'Marcus Vance', 8, 4.5, 84.1, 'At Risk', 'Maintains physical stock audits, bin tracking, and SKU level verification.'),
('dept-operations', 'Operations & Assembly', 'Rajiv Sharma', 4, 3.2, 94.5, 'Optimal', 'Coordinates cross-department fulfillment and autonomous mitigation dispatch.'),
('dept-logistics', 'Logistics & Dispatch', 'Alex Rivera', 3, 1.8, 99.1, 'Optimal', 'Carrier routing, dispatch manifests, and last-mile delivery tracking.')
ON CONFLICT (id) DO NOTHING;
