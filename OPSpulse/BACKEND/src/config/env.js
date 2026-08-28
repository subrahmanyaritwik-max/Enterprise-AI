import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Synchronously load .env before anything else runs
try {
  const envPath = path.resolve(__dirname, "../../.env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...vals] = trimmed.split("=");
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join("=").trim();
        }
      }
    });
  }
} catch (e) {
  console.warn("Could not load .env file:", e);
}

// Fallback constants if not present
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = "https://vcwqdvgibvtnktdfhipa.supabase.co";
}
if (!process.env.SUPABASE_ANON_KEY) {
  process.env.SUPABASE_ANON_KEY = "sb_publishable_LVRES5t75rnhnXDyo3g3kg_kBViqTtN";
}
