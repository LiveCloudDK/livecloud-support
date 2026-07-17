# Chatbot tracking + team-state

Én Cloudflare Worker, to formål:

1. **Chatbot events** (offentligt, write-only): modtager events fra `ringsted-chatbot.html`, skriver til Cloudflare KV (90 dages retention), poster `no_match` og negative `feedback` live til Slack.
2. **Team-state** (auth via Bearer token): delt JSON-tilstand for interne dokumenter som `go-live-18maj.html`. Holdet logger ind med en delt token og henter/gemmer samme blob, så ændringer er synlige på tværs af maskiner.

## Hvad logger vi?

| Event | Hvornår | Felter |
|---|---|---|
| `message_sent` | Brugeren sender en besked | `query` (PII-redacted), `matched` (bool), `topic` (string\|null) |
| `no_match` | Brugeren sendte en besked vi ikke kunne matche | `query` (PII-redacted), `consecutiveCount` |
| `feedback` | Brugeren trykker 👍 / 👎 under et svar | `topic`, `rating: "up" \| "down"` |
| `human_escalation_shown` | Brugeren har 2+ no-match i træk og fik vist support-email | – |

Alle events har desuden: `sessionId` (anonymt per fane), `timestamp`, `page`, `brand`, `userAgent` (trunkeret).

PII-redaction sker **client-side** før eventet sendes: e-mails, tlf, CPR erstattes med `[email]`, `[number]`, `[cpr]`.

## Setup

### 1. Cloudflare Worker

```bash
# fra denne mappe
npm install -g wrangler          # hvis ikke allerede installeret
wrangler login

# opret KV-namespace
wrangler kv:namespace create CHATBOT_EVENTS
# kopier id'et ind i wrangler.toml under [[kv_namespaces]]

# tilføj Slack webhook som secret (til chatbot no_match-alerts)
wrangler secret put SLACK_WEBHOOK_URL
# (paste webhook URL'en når den spørger)

# tilføj team-token som secret (til go-live-tavlen og andre delte docs)
wrangler secret put TEAM_TOKEN
# generér en stærk tilfældig værdi, fx via `openssl rand -hex 24`.
# Del den i jeres interne Slack, alle der skal kunne redigere
# go-live-tavlen skal have token.

# deploy
wrangler deploy
```

Worker'en udstiller sig nu på fx
`https://chatbot-tracking.<account>.workers.dev`.

## Endpoints

| Rute | Metode | Auth | Formål |
|---|---|---|---|
| `/event` | POST | nej | Chatbot-event ind |
| `/state/:docId` | GET | Bearer | Hent delt tilstand for et dokument |
| `/state/:docId` | PUT | Bearer | Gem delt tilstand (med optimistic locking) |

`:docId` må kun indeholde `[a-zA-Z0-9_-]`. Eksempel: `go-live-18maj`.

State-payload (GET response):
```json
{ "docId": "go-live-18maj",
  "version": 12,
  "state": { /* free-form JSON */ },
  "lastModifiedAt": 1747555555000,
  "lastModifiedBy": "Tony" }
```

PUT body:
```json
{ "state": { /* free-form JSON */ },
  "baseVersion": 11,
  "actor": "Tony" }
```

Hvis `baseVersion` ikke matcher serverens nuværende version returneres `409` med den nuværende state, så klienten kan merge og prøve igen.

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

### 4. Sæt endpoint i go-live-tavlen

I `go-live-18maj.html`, find blokken:

```js
const SYNC = {
  endpoint: '',
  docId: 'go-live-18maj',
  pollIntervalMs: 20000,
  debounceMs: 1200,
};
```

Sæt `endpoint` til Worker-URL'en (uden sti):

```js
const SYNC = {
  endpoint: 'https://chatbot-tracking.<account>.workers.dev',
  docId: 'go-live-18maj',
  pollIntervalMs: 20000,
  debounceMs: 1200,
};
```

Når siden er deployet med endpoint sat, kan holdet logge ind via "Log ind på holdet"-knappen øverst på siden. De indtaster:
- **Deres navn** (Tony, Edwin, etc.): bruges til "sidst opdateret af X"
- **Team-token**: den værdi du satte under `wrangler secret put TEAM_TOKEN`

Begge dele gemmes lokalt i browseren, så det er en engangs-handling pr. enhed.

**Hvordan sync fungerer:**
- Når du ændrer noget, gemmes det først lokalt og pushes til serveren ~1.2 sek efter sidste edit (debounced).
- Hver klient poll'er hver 20. sek og henter ind, hvis nogen andre har skrevet.
- Når en fane bliver synlig igen efter at have været i baggrunden, henter den straks.
- Ved samtidig redigering vinder "sidste skriv". Hvis to mennesker ændrer det samme item indenfor samme sekund kan det ene tabes. Det er sjældent og acceptabelt for dette dokument.

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
- PII-redaction er belt-and-braces: privacy-noten i bunden af chatten beder
  brugeren undlade at skrive personoplysninger.
- KV-retention er 90 dage. Hvis vi vil aggregere længere tilbage, dumpes til
  R2 i anonymiseret form (kun topic-counts, ikke fri tekst).
- Ingen cookies sættes.
