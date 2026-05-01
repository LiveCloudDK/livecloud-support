# Chatbot tracking

Modtager events fra `ringsted-chatbot.html` og:
1. Skriver alle events til Cloudflare KV (90 dages retention).
2. Poster `no_match` og negative `feedback`-events live til en Slack-kanal.

## Hvad logger vi?

| Event | Hvornår | Felter |
|---|---|---|
| `message_sent` | Brugeren sender en besked | `query` (PII-redacted), `matched` (bool), `topic` (string\|null) |
| `no_match` | Brugeren sendte en besked vi ikke kunne matche | `query` (PII-redacted) |
| `feedback` | Brugeren trykker 👍 / 👎 under et svar | `topic`, `rating: "up" \| "down"` |

Alle events har desuden: `sessionId` (anonymt per fane), `timestamp`, `page`, `brand`, `userAgent` (trunkeret).

PII-redaction sker **client-side** før eventet sendes — e-mails, tlf, CPR erstattes med `[email]`, `[number]`, `[cpr]`.

## Setup

### 1. Cloudflare Worker

```bash
# fra denne mappe
npm install -g wrangler          # hvis ikke allerede installeret
wrangler login

# opret KV-namespace
wrangler kv:namespace create CHATBOT_EVENTS
# kopier id'et ind i wrangler.toml under [[kv_namespaces]]

# tilføj Slack webhook som secret
wrangler secret put SLACK_WEBHOOK_URL
# (paste webhook URL'en når den spørger)

# deploy
wrangler deploy
```

Worker'en udstiller sig nu på fx
`https://chatbot-tracking.<account>.workers.dev`.

### 2. Slack-webhook

I jeres Slack workspace:
1. https://api.slack.com/apps → "Create New App" → "From scratch"
2. Vælg en kanal, fx `#chatbot-misses`
3. Aktiver "Incoming Webhooks", tilføj en til kanalen
4. Kopier webhook-URL'en og indsæt den under `wrangler secret put SLACK_WEBHOOK_URL`

### 3. Sæt endpoint i chatbotten

I `ringsted-chatbot.html`, find blokken:

```js
const TRACKING = {
  endpoint: '',
  plausibleDomain: '',
};
```

Sæt `endpoint` til Worker-URL'en + `/event`:

```js
const TRACKING = {
  endpoint: 'https://chatbot-tracking.<account>.workers.dev/event',
  plausibleDomain: '',
};
```

(Stien er ligegyldig, Worker'en accepterer alle paths — `/event` er bare for læsbarhed.)

## Hvordan ser vi data?

### Live, i Slack
`no_match` og 👎-events ryger live ind i kanalen, så vi kan reagere samme dag.

### Aggregeret (KV)
KV er ikke en database, så aggregering kræver et lille script. Eksempel:

```bash
# liste alle keys
wrangler kv:key list --binding EVENTS

# hent ét event
wrangler kv:key get "1730312456789-abc123" --binding EVENTS
```

Til skalerbar analyse: tilføj en cron-trigger til Worker'en der dumper KV → R2 (object storage) som JSON eller CSV én gang om dagen, og åbner i Excel / Sheets.

### Plausible (alternativ til KV)
Hvis I bare vil have aggregeret topic-fordeling og bounce-rate, sæt
`TRACKING.plausibleDomain` i chatbotten og lad være med at sætte `endpoint`.
Plausible viser så `topic_matched`, `no_match` og `feedback` som custom events
i sit dashboard. Begrænsning: Plausible logger ikke fri tekst (ingen `query`-værdi),
så I kan ikke se hvad uheldige brugere faktisk skrev.

**Anbefaling**: brug både Worker (til `query`-tekst) og Plausible (til pænt dashboard).
Eventfunktionen kalder begge automatisk hvis begge er konfigureret.

## Lokal test uden deployment

I browser-konsollen på chatbot-siden:

```js
JSON.parse(localStorage.getItem('rfb_events'))
```

Alle events skrives lokalt, så I kan teste flow'et inden Worker'en er oppe.
Tøm med `localStorage.removeItem('rfb_events')`.

## GDPR

- `userAgent` er trunkeret til 150 tegn.
- `sessionId` er random per fane, kan ikke kobles til person.
- PII-redaction er belt-and-braces — privacy-noten i bunden af chatten beder
  brugeren undlade at skrive personoplysninger.
- KV-retention er 90 dage. Hvis vi vil aggregere længere tilbage, dumpes til
  R2 i anonymiseret form (kun topic-counts, ikke fri tekst).
- Ingen cookies sættes.
