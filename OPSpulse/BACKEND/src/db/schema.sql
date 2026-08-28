-- OPSpulse Supabase Database Schema
-- Run this SQL in your Supabase Project SQL Editor (https://supabase.com/dashboard/project/vcwqdvgibvtnktdfhipa/sql)

-- 1. USERS Table
CREATE TABLE IF NOT EXISTS USERS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'Executive / Manager',
    department TEXT DEFAULT 'Executive Operations',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. APP_RECORDS Table
CREATE TABLE IF NOT EXISTS APP_RECORDS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES USERS(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. AI_OUTPUTS Table
CREATE TABLE IF NOT EXISTS AI_OUTPUTS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID REFERENCES APP_RECORDS(id) ON DELETE CASCADE,
    result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_users_email ON USERS(email);
CREATE INDEX IF NOT EXISTS idx_app_records_user_id ON APP_RECORDS(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_outputs_record_id ON AI_OUTPUTS(record_id);

-- Enable Row Level Security (RLS)
ALTER TABLE USERS ENABLE ROW LEVEL SECURITY;
ALTER TABLE APP_RECORDS ENABLE ROW LEVEL SECURITY;
ALTER TABLE AI_OUTPUTS ENABLE ROW LEVEL SECURITY;

-- Allow Public Access via Anon Key for OPSpulse operations
CREATE POLICY "Allow public read USERS" ON USERS FOR SELECT USING (true);
CREATE POLICY "Allow public insert USERS" ON USERS FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update USERS" ON USERS FOR UPDATE USING (true);

CREATE POLICY "Allow public read APP_RECORDS" ON APP_RECORDS FOR SELECT USING (true);
CREATE POLICY "Allow public insert APP_RECORDS" ON APP_RECORDS FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update APP_RECORDS" ON APP_RECORDS FOR UPDATE USING (true);
CREATE POLICY "Allow public delete APP_RECORDS" ON APP_RECORDS FOR DELETE USING (true);

CREATE POLICY "Allow public read AI_OUTPUTS" ON AI_OUTPUTS FOR SELECT USING (true);
CREATE POLICY "Allow public insert AI_OUTPUTS" ON AI_OUTPUTS FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update AI_OUTPUTS" ON AI_OUTPUTS FOR UPDATE USING (true);
CREATE POLICY "Allow public delete AI_OUTPUTS" ON AI_OUTPUTS FOR DELETE USING (true);
