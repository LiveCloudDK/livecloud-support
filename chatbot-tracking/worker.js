// Cloudflare Worker — tre formål:
//
//   1. POST /event           (offentligt, write-only)
//      Modtager events fra ringsted-chatbot.html, skriver til KV
//      (90-dages retention).
//
//   2. GET/PUT /state/:docId (auth via Bearer token)
//      Delt tilstand for interne dokumenter (fx go-live-18maj.html).
//      Holdet logger ind med en delt team-token og henter/gemmer
//      samme JSON-blob, så ændringer er synlige på tværs af maskiner.
//
//   3. GET /events           (auth via Bearer token)
//      Returnerer de seneste chatbot-events til dashboard-siden
//      (chatbot-dashboard.html). Bruges til at se hvilke spørgsmål
//      chatten ikke kunne svare på, hvilke svar fik 👎 osv.
//
// Deployment:
//   - Opret Cloudflare Worker (cloudflare.com → Workers & Pages → Create)
//   - Tilføj en KV-namespace bound under navnet EVENTS
//   - Secrets:
//       wrangler secret put TEAM_TOKEN
//   - I ringsted-chatbot.html: sæt TRACKING.endpoint til <URL>/event
//   - I go-live-18maj.html og chatbot-dashboard.html: sæt SYNC.endpoint
//     / DASHBOARD.endpoint til <URL>

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight (alle ruter)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // ─────────────────────────────────────────────────────────
    // PUBLIC: chatbot events
    // ─────────────────────────────────────────────────────────
    if (path === "/event") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
      }
      return handleChatbotEvent(request, env);
    }

    // ─────────────────────────────────────────────────────────
    // AUTH-GATED ruter
    // ─────────────────────────────────────────────────────────
    if (path === "/events" || path.startsWith("/state/")) {
      const unauth = requireAuth(request, env);
      if (unauth) return unauth;

      if (path === "/events" && request.method === "GET") {
        return listEvents(url, env);
      }

      if (path.startsWith("/state/")) {
        const docId = path.slice("/state/".length).replace(/[^a-zA-Z0-9_-]/g, "");
        if (!docId) {
          return new Response("Bad docId", { status: 400, headers: corsHeaders() });
        }
        if (request.method === "GET") return getState(docId, env);
        if (request.method === "PUT") return putState(docId, request, env);
      }

      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders() });
  },
};

function requireAuth(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!env.TEAM_TOKEN || !token || !constantTimeEqual(token, env.TEAM_TOKEN)) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders() });
  }
  return null;
}

// ═════════════════════════════════════════════════════════════
// CHATBOT EVENTS — write
// ═════════════════════════════════════════════════════════════
async function handleChatbotEvent(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return new Response("Bad JSON", { status: 400, headers: corsHeaders() });
  }

  const serverTs = Date.now();
  const eventRecord = { ...payload, serverTimestamp: serverTs };

  if (env.EVENTS) {
    const key = `event:${serverTs}-${Math.random().toString(36).slice(2, 8)}`;
    await env.EVENTS.put(key, JSON.stringify(eventRecord), {
      expirationTtl: 60 * 60 * 24 * 90, // 90 dage
    });
  }

  return jsonResponse({ ok: true });
}

// ═════════════════════════════════════════════════════════════
// CHATBOT EVENTS — read (for dashboard)
// ═════════════════════════════════════════════════════════════
async function listEvents(url, env) {
  if (!env.EVENTS) return jsonResponse({ events: [] });

  // Limit: hvor mange events vi henter (cap 1000, default 500)
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "500", 10), 1000);

  // KV list returnerer keys i lex-orden. Da vi præfikser med tidsstempel,
  // er senest sidst. Vi henter alt op til limit og sorterer i client.
  const list = await env.EVENTS.list({ prefix: "event:", limit });

  // Hent values parallelt
  const events = await Promise.all(
    list.keys.map(async (k) => {
      try {
        const raw = await env.EVENTS.get(k.name);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    })
  );

  // Filtrér null-værdier og sortér nyeste først
  const cleaned = events
    .filter(Boolean)
    .sort((a, b) => (b.serverTimestamp || 0) - (a.serverTimestamp || 0));

  return jsonResponse({
    events: cleaned,
    count: cleaned.length,
    listComplete: list.list_complete,
  });
}

// ═════════════════════════════════════════════════════════════
// STATE (delt dokument-tilstand)
// ═════════════════════════════════════════════════════════════
async function getState(docId, env) {
  if (!env.EVENTS) {
    return new Response("KV not bound", { status: 500, headers: corsHeaders() });
  }
  const key = `state:${docId}`;
  const raw = await env.EVENTS.get(key);
  if (!raw) {
    // Tomt dokument er en gyldig tilstand (første gang)
    return jsonResponse({
      docId,
      version: 0,
      state: null,
      lastModifiedAt: null,
      lastModifiedBy: null,
    });
  }
  return new Response(raw, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders(),
    },
  });
}

async function putState(docId, request, env) {
  if (!env.EVENTS) {
    return new Response("KV not bound", { status: 500, headers: corsHeaders() });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response("Bad JSON", { status: 400, headers: corsHeaders() });
  }
  if (!body || typeof body !== "object" || typeof body.state !== "object") {
    return new Response("Missing state", { status: 400, headers: corsHeaders() });
  }

  const key = `state:${docId}`;
  const existingRaw = await env.EVENTS.get(key);
  const existing = existingRaw ? JSON.parse(existingRaw) : { version: 0 };

  if (typeof body.baseVersion === "number" && body.baseVersion !== existing.version) {
    return new Response(
      JSON.stringify({
        error: "version_conflict",
        currentVersion: existing.version,
        current: existing,
      }),
      { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const next = {
    docId,
    version: (existing.version || 0) + 1,
    state: body.state,
    lastModifiedAt: Date.now(),
    lastModifiedBy: typeof body.actor === "string" ? body.actor.slice(0, 60) : "anon",
  };

  await env.EVENTS.put(key, JSON.stringify(next));

  return jsonResponse(next);
}

// ═════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
