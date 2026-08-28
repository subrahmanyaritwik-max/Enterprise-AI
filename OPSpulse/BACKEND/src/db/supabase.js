import "../config/env.js";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL || "https://vcwqdvgibvtnktdfhipa.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "sb_publishable_LVRES5t75rnhnXDyo3g3kg_kBViqTtN";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Helper for hashing password
export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Fallback in-memory store in case network connection drops
const inMemoryStore = {
  users: [],
  appRecords: [],
  aiOutputs: []
};

/**
 * USERS Table Service
 * Schema:
 *   - id (UUID)
 *   - email (TEXT)
 *   - password_hash (TEXT)
 *   - name (TEXT)
 *   - role (TEXT)
 *   - department (TEXT)
 *   - created_at (TIMESTAMP)
 */
export const UserService = {
  async findByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("[Supabase] users findByEmail query fallback:", e.message);
    }

    return inMemoryStore.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] users findById query fallback:", e.message);
    }

    return inMemoryStore.users.find(u => u.id === id) || null;
  },

  async createUser({ email, password, name, role, department }) {
    const cleanEmail = email.trim().toLowerCase();
    const password_hash = hashPassword(password);
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const userObj = {
      id,
      email: cleanEmail,
      password_hash,
      name: name || cleanEmail.split("@")[0],
      role: role || "Executive / Manager",
      department: department || "Executive Operations",
      created_at
    };

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([userObj])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
      if (error) {
        console.warn("[Supabase] users insert error:", error.message);
      }
    } catch (e) {
      console.warn("[Supabase] users insert fallback:", e.message);
    }

    // Save to in-memory store
    inMemoryStore.users.push(userObj);
    return userObj;
  },

  async listAll() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, department, created_at");

      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn("[Supabase] users listAll fallback:", e.message);
    }

    return inMemoryStore.users.map(({ password_hash, ...rest }) => rest);
  }
};

/**
 * APP_RECORDS Table Service
 * Schema:
 *   - id (UUID)
 *   - user_id (UUID)
 *   - input_data (JSONB)
 *   - created_at (TIMESTAMP)
 *   - updated_at (TIMESTAMP)
 */
export const AppRecordsService = {
  async createRecord(userId, inputData) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      id,
      user_id: userId || null,
      input_data: inputData || {},
      created_at: now,
      updated_at: now
    };

    try {
      const { data, error } = await supabase
        .from("app_records")
        .insert([record])
        .select()
        .single();

      if (!error && data) return data;
      if (error) {
        console.warn("[Supabase] app_records insert error:", error.message);
      }
    } catch (e) {
      console.warn("[Supabase] app_records insert fallback:", e.message);
    }

    inMemoryStore.appRecords.unshift(record);
    return record;
  },

  async getRecordsByUser(userId) {
    try {
      const { data, error } = await supabase
        .from("app_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] app_records getRecordsByUser fallback:", e.message);
    }

    return inMemoryStore.appRecords.filter(r => r.user_id === userId);
  },

  async getRecentRecords(limit = 20) {
    try {
      const { data, error } = await supabase
        .from("app_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] app_records getRecentRecords fallback:", e.message);
    }

    return inMemoryStore.appRecords.slice(0, limit);
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from("app_records")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] app_records getById fallback:", e.message);
    }

    return inMemoryStore.appRecords.find(r => r.id === id) || null;
  },

  async updateRecord(id, inputData) {
    const now = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from("app_records")
        .update({
          input_data: inputData,
          updated_at: now
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] app_records updateRecord fallback:", e.message);
    }

    const idx = inMemoryStore.appRecords.findIndex(r => r.id === id);
    if (idx !== -1) {
      inMemoryStore.appRecords[idx].input_data = inputData;
      inMemoryStore.appRecords[idx].updated_at = now;
      return inMemoryStore.appRecords[idx];
    }
    return null;
  },

  async deleteRecord(id) {
    try {
      const { data, error } = await supabase
        .from("app_records")
        .delete()
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) return true;
    } catch (e) {
      console.warn("[Supabase] app_records deleteRecord fallback:", e.message);
    }

    const idx = inMemoryStore.appRecords.findIndex(r => r.id === id);
    if (idx !== -1) {
      inMemoryStore.appRecords.splice(idx, 1);
      return true;
    }
    return false;
  }
};

/**
 * AI_OUTPUTS Table Service
 * Schema:
 *   - id (UUID)
 *   - record_id (UUID)
 *   - result_json (JSONB)
 *   - created_at (TIMESTAMP)
 */
export const AiOutputsService = {
  async createOutput(recordId, resultJson) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const output = {
      id,
      record_id: recordId || null,
      result_json: resultJson || {},
      created_at: now
    };

    try {
      const { data, error } = await supabase
        .from("ai_outputs")
        .insert([output])
        .select()
        .single();

      if (!error && data) return data;
      if (error) {
        console.warn("[Supabase] ai_outputs insert error:", error.message);
      }
    } catch (e) {
      console.warn("[Supabase] ai_outputs insert fallback:", e.message);
    }

    inMemoryStore.aiOutputs.unshift(output);
    return output;
  },

  async getOutputsByRecord(recordId) {
    try {
      const { data, error } = await supabase
        .from("ai_outputs")
        .select("*")
        .eq("record_id", recordId)
        .order("created_at", { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] ai_outputs getOutputsByRecord fallback:", e.message);
    }

    return inMemoryStore.aiOutputs.filter(o => o.record_id === recordId);
  },

  async getRecentOutputs(limit = 20) {
    try {
      const { data, error } = await supabase
        .from("ai_outputs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] ai_outputs getRecentOutputs fallback:", e.message);
    }

    return inMemoryStore.aiOutputs.slice(0, limit);
  }
};
