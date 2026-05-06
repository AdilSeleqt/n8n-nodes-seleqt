# n8n-nodes-seleqt

n8n community node for [Seleqt](https://seleqt.ai) — the #1 lead generation tool. Connect Seleqt's lead generation, enrichment, campaign management, and inbox capabilities to your n8n workflows.

> **Status:** v0.2 (early access). Action node covers Campaign + Lead List + Prospect + Inbox basics; the Trigger node and webhook events land in v0.4 once the backend webhook subscription system ships (SQ26-226 Ticket C).

## Installation

### From npm (once published)

In your n8n instance: **Settings → Community Nodes → Install**, then enter:

```
n8n-nodes-seleqt
```

### From GitHub (testing pre-release builds)

```bash
# Inside your n8n install directory
npm install github:AdilSeleqt/n8n-nodes-seleqt
```

Then restart n8n. The Seleqt node appears in the node panel under "Transform".

### Self-hosted Docker n8n

Mount the package into the container's user nodes folder:

```bash
docker exec -u node n8n-container npm install github:AdilSeleqt/n8n-nodes-seleqt
docker restart n8n-container
```

## Setup

1. Generate an API key in Seleqt: **Settings → API Keys → New key**.
2. In n8n, open any workflow and add the **Seleqt** node.
3. Click **Credentials → New** and paste the API key.
4. Leave **Base URL** at the default (`https://api.seleqt.ai/api/v1`) unless you're on staging or self-hosted Seleqt. (`app.seleqt.ai` is the SPA frontend; the JSON API lives at `api.seleqt.ai`.)
5. n8n's "Test" button confirms the key is live before you save.

## Operations (v0.2)

| Resource | Operation | API endpoint |
|---|---|---|
| Campaign | Get Many | `GET /public/campaigns/` |
| Campaign | Get | `GET /public/campaigns/:id/` |
| Campaign | Create | `POST /public/campaigns/` |
| Campaign | Update | `PATCH /public/campaigns/:id/` |
| Campaign | Get Stats | `GET /public/campaigns/:id/analytics/` |
| Campaign | Get Steps | `GET /public/campaigns/:id/steps/` |
| Lead List | Get Many | `GET /public/lead-lists/` |
| Lead List | Get Leads | `GET /public/lead-lists/:id/leads/` |
| Lead List | Create | `POST /public/lead-lists/` |
| Lead List | Add Leads | `POST /public/lead-lists/:id/add-leads/` |
| Lead List | Move to Campaign | `POST /public/lead-lists/:id/move-to-campaign/` |
| Lead List | Enrich | `POST /public/lead-lists/:id/enrichment/` |
| Prospect | Search | `POST /public/prospects/search/` |
| Inbox | Send Message | `POST /public/chats/:prospect_id/send-message/` |

## Roadmap

Tracked in [SQ26-226](https://github.com/AdilSeleqt/seleqt-sales/blob/main/docs/sq26-226-n8n-integration-plan.md):

- v0.1 — Campaign Get Many ✅
- **v0.2 — Campaign + Lead List + Prospect + Inbox surface (you are here)**
- v0.3 — Lead-level CRUD, Workspace resource (depends on Ticket B backend)
- v0.4 — Trigger node + webhook subscriptions (depends on Ticket C backend)
- v1.0 — n8n marketplace partner verification + 5 workflow templates

## Development

```bash
npm install
npm run build         # one-shot TypeScript compile + asset copy
npm run dev           # watch mode
npm run lint          # n8n-nodes-base ruleset
npm run lintfix       # autofix where possible
```

To load a local build into a running n8n instance, point your n8n's `~/.n8n/custom` directory at this package or use:

```bash
cd ~/.n8n/custom
npm link n8n-nodes-seleqt   # after `npm link` in this repo
```

## License

MIT — see [LICENSE](./LICENSE).
