import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

let ok = true;

if (!url || url.includes("xxxxxxxx")) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL manquant ou invalide dans .env.local");
  ok = false;
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_URL");
}

if (!anonKey || anonKey.endsWith("...")) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquant ou invalide dans .env.local");
  ok = false;
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

console.log(`ℹ️  NEXT_PUBLIC_SITE_URL → ${siteUrl}`);

if (!ok) {
  console.log("\n→ Copie .env.example vers .env.local et remplis les valeurs Supabase.");
  process.exit(1);
}

try {
  const res = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: anonKey },
  });
  if (res.ok) {
    console.log("✅ Connexion Supabase Auth OK");
  } else {
    console.error(`❌ Supabase Auth a répondu ${res.status}`);
    ok = false;
  }
} catch (error) {
  console.error("❌ Impossible de joindre Supabase :", error.message);
  ok = false;
}

if (ok) {
  console.log("\n🎉 Configuration Supabase prête. Lance : npm run dev");
} else {
  process.exit(1);
}
