// Ti Bac Kréyol — envoi des notifications sur le téléphone (Web Push)
//  kind = "daily"  : rappel du défi du jour (appelé par la tâche planifiée, clé secrète obligatoire)
//  kind = "invite" : invitation à une partie (appelé par le créateur de la partie)
//  kind = "friend" : demande d'ami (appelé par l'auteur de la demande)
//  kind = "test"   : notification d'essai sur ses propres téléphones
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const FRESH_MS = 10 * 60 * 1000; // une invitation ne se notifie que dans les 10 minutes qui suivent

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "méthode" }, 405);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: sec, error: secErr } = await sb.from("app_secrets").select("k,v");
  if (secErr || !sec) return json({ error: "configuration" }, 500);
  const S: Record<string, string> = Object.fromEntries(sec.map((r) => [r.k, r.v]));
  webpush.setVapidDetails(S.vapid_subject || "mailto:vizib.contact@gmail.com", S.vapid_public, S.vapid_private);

  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind || "");
  let subs: any[] = [];
  let payload: Record<string, string>;

  if (kind === "daily") {
    if (!S.cron_secret || req.headers.get("x-cron-secret") !== S.cron_secret) return json({ error: "interdit" }, 403);
    const today = new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10); // heure des Antilles
    const { data: done } = await sb.from("dailyscores").select("user_id").eq("last", today);
    const played = new Set((done || []).map((d) => d.user_id));
    const { data } = await sb.from("push_subs").select("*").eq("daily", true);
    subs = (data || []).filter((s) => !played.has(s.user_id));
    payload = { title: "Ti Bac Kréyol 🌴", body: "Ton défi du jour t'attend ! Un nouveau thème, 60 secondes.", url: "./#defi", tag: "defi" };
  } else {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u } = await sb.auth.getUser(token);
    const uid = u?.user?.id;
    if (!uid) return json({ error: "connexion" }, 401);
    const { data: me } = await sb.from("profiles").select("pseudo").eq("id", uid).maybeSingle();
    const pseudo = me?.pseudo || "Un joueur";

    if (kind === "invite") {
      const code = String(body.code || "").toUpperCase();
      const { data: m } = await sb.from("matches").select("host,invites,players,created_at").eq("code", code).maybeSingle();
      if (!m || m.host !== uid) return json({ error: "interdit" }, 403);
      if (Date.now() - new Date(m.created_at).getTime() > FRESH_MS) return json({ sent: 0 });
      const ids = (m.invites || []).filter((x: string) => !(m.players || []).includes(x));
      if (!ids.length) return json({ sent: 0 });
      const { data } = await sb.from("push_subs").select("*").in("user_id", ids).eq("invites", true);
      subs = data || [];
      payload = { title: `${pseudo} t'invite à jouer`, body: "Une partie de Ti Bac Kréyol t'attend. Touche pour la rejoindre.", url: `./#${code}`, tag: `inv-${code}` };
    } else if (kind === "friend") {
      const to = String(body.to || "");
      const id = [uid, to].sort().join("__");
      const { data: f } = await sb.from("friendships").select("from_id,to_id,status,created_at").eq("id", id).maybeSingle();
      if (!f || f.from_id !== uid || f.status !== "pending") return json({ error: "interdit" }, 403);
      if (Date.now() - new Date(f.created_at).getTime() > FRESH_MS) return json({ sent: 0 });
      const { data } = await sb.from("push_subs").select("*").eq("user_id", to).eq("invites", true);
      subs = data || [];
      payload = { title: `${pseudo} veut être ton ami`, body: "Accepte sa demande dans l'onglet Amis.", url: "./#amis", tag: `ami-${uid}` };
    } else if (kind === "test") {
      const { data } = await sb.from("push_subs").select("*").eq("user_id", uid);
      subs = data || [];
      payload = { title: "Ti Bac Kréyol 🌴", body: "Les notifications fonctionnent sur ce téléphone !", url: "./", tag: "test" };
    } else {
      return json({ error: "type inconnu" }, 400);
    }
  }

  let sent = 0, removed = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
        { TTL: 6 * 3600, urgency: "normal" },
      );
      sent++;
    } catch (e: any) {
      // abonnement expiré ou retiré par le téléphone : on l'efface
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await sb.from("push_subs").delete().eq("endpoint", s.endpoint);
        removed++;
      }
    }
  }));
  return json({ sent, removed, targets: subs.length });
});
