// Cloudflare Worker — to formål:
//
//   1. POST /event           (offentligt, write-only)
//      Modtager events fra ringsted-chatbot.html, skriver til KV,
//      poster no_match + thumbs-down live til Slack.
//
//   2. GET/PUT /state/:docId (auth via Bearer token)
//      Delt tilstand for interne dokumenter (fx go-live-18maj.html).
//      Holdet logger ind med en delt team-token og henter/gemmer
//      samme JSON-blob, så ændringer er synlige på tværs af maskiner.
//
// Deployment:
//   - Opret Cloudflare Worker (cloudflare.com → Workers & Pages → Create)
//   - Tilføj en KV-namespace bound under navnet EVENTS
//   - Secrets:
//       wrangler secret put SLACK_WEBHOOK_URL
//       wrangler secret put TEAM_TOKEN
//   - I ringsted-chatbot.html: sæt TRACKING.endpoint til <URL>/event
//   - I go-live-18maj.html: sæt SYNC.endpoint til <URL>
//
// Auth-model for state:
//   - TEAM_TOKEN er en delt hemmelighed (én pr. team, deles i Slack).
//   - Brugeren indtaster token første gang, den gemmes i localStorage.
//   - Worker tjekker Authorization: Bearer <token>.
//   - Hvis flere docs skal bruges: brug forskellige docIds, samme token.

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
    // AUTH GATE for resten (state-endpoints)
    // ─────────────────────────────────────────────────────────
    if (path.startsWith("/state/")) {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.replace(/^Bearer\s+/i, "").trim();
      if (!env.TEAM_TOKEN || !token || !constantTimeEqual(token, env.TEAM_TOKEN)) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders() });
      }

      const docId = path.slice("/state/".length).replace(/[^a-zA-Z0-9_-]/g, "");
      if (!docId) {
        return new Response("Bad docId", { status: 400, headers: corsHeaders() });
      }

      if (request.method === "GET") return getState(docId, env);
      if (request.method === "PUT") return putState(docId, request, env);
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders() });
  },
};

// ═════════════════════════════════════════════════════════════
// CHATBOT EVENTS
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

  if (env.SLACK_WEBHOOK_URL) {
    let slackText = null;
    if (payload.event === "no_match" && payload.query) {
      slackText = `:question: *Chatbot kunne ikke svare* — \`${escape(payload.query)}\`\n_session: ${payload.sessionId} · brand: ${payload.brand}_`;
    } else if (payload.event === "feedback" && payload.rating === "down") {
      slackText = `:-1: *Bruger ratede et svar negativt*\nTopic: \`${payload.topic}\` · session: ${payload.sessionId}`;
    }
    if (slackText) {
      try {
        await fetch(env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: slackText }),
        });
      } catch (e) { /* swallow */ }
    }
  }

  return jsonResponse({ ok: true });
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
  // Returnér med passende cache-headers
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

  // Optimistic concurrency: hvis client angiver baseVersion, skal den matche
  // den nuværende version. Ellers fortæller vi clienten at der er nyere data
  // og lader den merge/genovervej.
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

  // Ingen TTL — vi vil have state'en til at leve, indtil vi eksplicit
  // sletter eller overskriver den.
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

function escape(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

// Constant-time string compare, så vi ikke lækker token-længde via timing.
function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
