# Solaris Energy — Website & Agents

Next.js 16 (App Router) + TypeScript + Tailwind CSS demo for a solar panel
company: a public marketing site with a solar sizing calculator and
consultation booking, plus a Supabase-authenticated admin dashboard that
also manages n8n automation agents.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions), **React 19**, **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres database + Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **n8n** — lead capture / quote / booking / follow-up automation, wired via public webhooks (public forms) and the n8n REST API (admin Agents page)

## Project structure

```
app/
├── (public)/            Landing page, /calculator, /book
├── (admin)/admin/       Auth-gated dashboard, /clients, /meetings, /agents
├── api/n8n/workflows/   Route Handler proxying the n8n REST API (keeps N8N_API_KEY server-only)
├── layout.tsx
middleware.ts             Refreshes the Supabase session + guards /admin/*
lib/
├── supabase/            Browser / server / middleware / admin Supabase clients
├── actions/              Server Actions (meeting status)
├── solar-calc.ts         Calculator math
├── n8n.ts                n8n REST API wrapper (server-only, used by app/api/n8n/workflows)
components/
├── ui/                   Shared primitives (Button, Card, Field, icons, …)
├── site/  calculator/  booking/
├── admin/                Incl. WorkflowModal + WorkflowFlowView (React Flow workflow preview)
supabase/
└── policies.sql          RLS policies applied to the live database (see below)
```

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in real values (a working
`.env.local` for this Supabase project is already present locally — it's
git-ignored, never commit it).

### Required env vars

| Var | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin client (`lib/supabase/admin.ts`) — never expose to the browser |
| `NEXT_PUBLIC_N8N_LEAD_WEBHOOK` | Landing page contact form |
| `NEXT_PUBLIC_N8N_QUOTE_WEBHOOK` | Calculator "Get a Quote" |
| `NEXT_PUBLIC_N8N_MEETING_WEBHOOK` | Booking flow |
| `NEXT_PUBLIC_N8N_DASHBOARD_WEBHOOK` | Present in `.env.example` for parity with the n8n contract, but **not wired up yet** — the dashboard currently reads Supabase directly |
| `N8N_BASE_URL`, `N8N_API_KEY` | Server-only — read by `lib/n8n.ts`, used by `app/api/n8n/workflows/route.ts` |
| `N8N_WORKFLOW_ID_LEAD_CAPTURE`, `..._QUOTE_GENERATION`, `..._MEETING_BOOKING`, `..._FOLLOW_UP` | One per Agents page card |

Until the `N8N_*` vars hold real values, the public forms still work (they
fall back to the direct Supabase writes and just skip the webhook call
with a console warning), and the Agents admin page renders a
"Not configured" state instead of crashing — including if `N8N_BASE_URL`
is set but the workflow IDs/API key are still the placeholder values from
the template (`lib/n8n.ts` recognizes and ignores those specific
placeholders, same as an unset var).

### Creating your first admin login

There's no public sign-up — `/admin` is a login form backed by Supabase
Auth. Create a user from the Supabase dashboard (**Authentication → Users
→ Add user**, with "Auto confirm" on) or via the CLI/Admin API, then sign
in with that email/password at `/admin`.

## Database: RLS policies

The `clients`, `meetings`, `interactions`, and `quotes` tables have RLS
enabled. **They need policies to be usable at all** — the CRM tables
started with RLS on and zero policies, which is a hard deny for every
role, including the logged-in admin. [`supabase/policies.sql`](supabase/policies.sql)
documents the policy set already applied to this project's database:

- `anon` (public visitors) can `INSERT` into `clients`, `meetings`, and
  `interactions` only — no read access to client data. This backs the
  public forms' "write to Supabase directly as a backup" behavior
  alongside the n8n webhook calls.
- `authenticated` (the logged-in admin) has full read/write access to all
  four tables.

If you point this app at a fresh Supabase project, run that file's SQL
once (Supabase SQL editor, or `psql` against the project's connection
string) before expecting the forms or the admin dashboard to work.

Note the three enum-like columns are constrained by real `check`
constraints already on the tables — `lib/types.ts` mirrors them:
`clients.status`: `active | inactive | converted`,
`clients.source`: `contact_form | calculator | meeting_booking`,
`interactions.type`: `form_submit | quote_generated | meeting_booked | email_sent | follow_up`,
`meetings.status`: `scheduled | completed | no_show | cancelled`.

## Solar calculator formula

```
system_size_kw   = monthly_kwh / (30 * 4.5)
num_panels       = ceil(system_size_kw / 0.55)
estimated_cost   = system_size_kw * 170,000        (PKR)
monthly_savings  = monthly_bill * 0.85
payback_years    = estimated_cost / (monthly_savings * 12)
```

See [`lib/solar-calc.ts`](lib/solar-calc.ts).

## Agents page: how "View Workflow" works

n8n's own editor generally can't be iframed for a demo like this — it
requires an authenticated session, and self-hosted/cloud instances send
`X-Frame-Options`/CSP headers that block framing unless each workflow is
explicitly shared with a public read-only link. Rather than depend on
that being set up, "View Workflow" instead:

1. Calls `GET /api/n8n/workflows?id={workflowId}` (server-side proxy —
   keeps `N8N_API_KEY` out of the browser, and requires an authenticated
   admin session, checked in the route handler itself since it isn't
   under `/admin/*` and so isn't covered by `middleware.ts`).
2. Gets back the real workflow JSON (`nodes` + `connections`) from n8n.
3. Renders it as an actual graph with [`@xyflow/react`](https://reactflow.dev)
   (the current package name for what the n8n docs still call "React
   Flow") in [`components/admin/WorkflowFlowView.tsx`](components/admin/WorkflowFlowView.tsx) —
   node type → color/icon mapping lives there.

The modal also shows an "Open in n8n" link (`${N8N_BASE_URL}/workflow/{id}`)
for jumping to the real editor in a new tab. Activate/deactivate goes
through the same proxy route (`POST /api/n8n/workflows` with
`{ id, action }`).
