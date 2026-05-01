// Cloudflare Worker, modtager events fra ringsted-chatbot.html
// og:
//   1. Skriver dem til en KV-store (alle events, så vi kan analysere senere).
//   2. Poster "no_match" events live til en Slack-kanal, så vi kan reagere
//      på huller i FAQ'en samme dag.
//
// Deployment:
//   - Opret en Cloudflare Worker (cloudflare.com -> Workers & Pages -> Create)
//   - Tilføj en KV-namespace, fx "CHATBOT_EVENTS", og bind den til navnet EVENTS
//   - Sæt secret SLACK_WEBHOOK_URL via `wrangler secret put SLACK_WEBHOOK_URL`
//     (eller via dashboard). Slack-webhook'en oprettes i jeres workspace under
//     "Apps -> Incoming Webhooks". Vælg den kanal "no_match" beskederne skal i.
//   - Sæt TRACKING.endpoint i ringsted-chatbot.html til den deployede URL,
//     fx https://chatbot-tracking.<jeres-account>.workers.dev/event
//
// Event payload fra browseren:
//   { event: "message_sent" | "no_match" | "feedback",
//     sessionId, timestamp, page, brand, userAgent,
//     query?, matched?, topic?, rating? }

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return new Response("Bad JSON", { status: 400, headers: corsHeaders() });
    }

    // Server-side timestamp (we trust this, not client clock)
    const serverTs = Date.now();
    const eventRecord = { ...payload, serverTimestamp: serverTs };

    // 1. Persist to KV. Key is timestamp + random suffix so we get
    //    chronological order and no collisions.
    if (env.EVENTS) {
      const key = `${serverTs}-${Math.random().toString(36).slice(2, 8)}`;
      // 90-day TTL; tweak as needed.
      await env.EVENTS.put(key, JSON.stringify(eventRecord), {
        expirationTtl: 60 * 60 * 24 * 90,
      });
    }

    // 2. Live Slack notification for unmatched queries + thumbs-down feedback.
    //    These are the things we want to react to fast.
    if (env.SLACK_WEBHOOK_URL) {
      let slackText = null;

      if (payload.event === "no_match" && payload.query) {
        slackText = `:question: *Chatbot kunne ikke svare* — \`${escape(payload.query)}\`\n_session: ${payload.sessionId} · brand: ${payload.brand}_`;
      } else if (payload.event === "feedback" && payload.rating === "down") {
        slackText = `:-1: *Bruger ratede et svar negativt*\nTopic: \`${payload.topic}\` · session: ${payload.sessionId}`;
      }

      if (slackText) {
        // Fire-and-forget; don't block the response on Slack.
        try {
          await fetch(env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: slackText }),
          });
        } catch (e) { /* don't fail the request if Slack is down */ }
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  },
};

function corsHeaders() {
  // Open to the public — chatten ligger på en offentlig side.
  // Stram til hvis I kun vil acceptere fra et bestemt origin.
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function escape(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}
