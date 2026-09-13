# Solaris Energy CRM

> A solar sales funnel and operations workspace: attract leads, estimate system
> requirements, book consultations, and manage the resulting client pipeline
> from one authenticated dashboard.

## Demo

**[Watch the product demo](https://drive.google.com/file/d/1RjBTw91sWcXPC1309APvwIWgJbM79Ovt/view?usp=drive_link)**

## What This Project Demonstrates

This is a full-stack solar company experience built around a practical business
workflow rather than a collection of disconnected screens:

- A responsive public marketing site with services, testimonials, contact
  capture, and solar-focused imagery.
- A client-side solar sizing calculator that turns energy usage into estimated
  system size, panel count, cost, savings, payback, and CO2 offset.
- A consultation booking flow with a weekday calendar, time-slot selection,
  contact details, and confirmation feedback.
- An authenticated CRM dashboard for client records, meeting operations, lead
  trends, quote totals, and recent interaction activity.
- n8n automation agents for lead capture, quote generation, meeting booking,
  and follow-up operations, connected through public webhook contracts.

The result is a realistic lead-to-operations loop: a visitor can submit an
enquiry, request a quote, or book a consultation; the business team can then
review the client history and update meeting outcomes from the admin portal.

## Tech Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Application | Next.js `16.3.1` App Router | Routing, layouts, server-rendered admin pages, metadata |
| UI | React `19.2.8` + TypeScript | Typed interactive forms and components |
| Styling | Tailwind CSS `4` + PostCSS | Responsive design system and utility styling |
| Data and auth | Supabase PostgreSQL + Supabase Auth | CRM persistence, relational queries, password authentication |
| Auth integration | `@supabase/ssr` | Browser, server, and middleware clients with cookie sessions |
| Automation | n8n | Lead, quote, booking, email, and follow-up workflows |
| Utilities | `clsx` | Conditional class composition |
| Quality tooling | ESLint `9`, `eslint-config-next`, TypeScript | Linting and static type checking |

The app uses Next.js Server Components by default and opts into Client
Components for interactive forms, calendars, filters, and tables. The root
layout loads Geist and Geist Mono through `next/font`.

## Architecture

```text
                         +----------------------+
                         |  Public Next.js site  |
                         |  / /calculator /book |
                         +----------+-----------+
                                    |
                    JSON webhook POSTs from client forms
                                    |
                                    v
                         +----------------------+
                         |   n8n automation     |
                         | lead / quote / book  |
                         | email / follow-up    |
                         +----------+-----------+
                                    |
                         PostgreSQL writes + email
                                    |
                                    v
                         +----------------------+
                         | Supabase CRM tables  |
                         | clients, meetings,   |
                         | quotes, interactions|
                         +----------+-----------+
                                    ^
                                    |
                         Authenticated server reads
                                    |
                         +----------+-----------+
                         | Admin Next.js portal |
                         | /admin/*             |
                         +----------------------+
```

### Route structure

```text
app/
├── (public)/
│   ├── page.tsx                 Landing page and contact form
│   ├── calculator/page.tsx      Solar sizing and quote request flow
│   ├── book/page.tsx            Consultation booking flow
│   └── layout.tsx               Public header/footer shell
├── (admin)/admin/
│   ├── page.tsx                 KPI overview, trend chart, recent activity
│   ├── clients/page.tsx         Clients with related history
│   ├── meetings/page.tsx        Searchable meetings and status actions
│   ├── agents/page.tsx          Configured n8n agent directory
│   └── layout.tsx               Authenticated sidebar and topbar shell
├── layout.tsx                   Root metadata, fonts, and global styles
└── globals.css                  Tailwind/theme styles

components/
├── site/                        Public marketing and contact UI
├── calculator/                  Calculator results and quote request UI
├── booking/                     Calendar, time slots, and booking state
├── admin/                       CRM dashboard tables, cards, and charts
└── ui/                          Shared buttons, fields, cards, badges, icons

lib/
├── solar-calc.ts                Pure, client-safe sizing calculations
├── webhook.ts                   Resilient n8n webhook client
├── types.ts                     CRM domain and joined-record types
├── utils.ts                     Dates, time slots, formatting, class helpers
├── actions/meetings.ts          Authenticated meeting status Server Action
└── supabase/                    Browser, server, middleware, and admin clients
```

## Core Workflows

### 1. Lead capture

The landing page contact form posts a typed JSON payload to the configured n8n
Lead Capture webhook. It also writes a client and `form_submit` interaction
through the anonymous Supabase client as a persistence fallback. The webhook
client deliberately fails soft when n8n is not configured, allowing the public
site to remain usable in a local/demo environment.

### 2. Solar calculation and quote generation

The calculator accepts monthly bill, monthly usage, roof area, and a Pakistan
city. Results are calculated immediately in the browser using the constants in
`lib/solar-calc.ts`:

```text
system size kW = monthly kWh / (30 * 4.5 peak sun hours)
panel count    = ceil(system size kW / 0.55 kW per panel)
estimated cost = system size kW * PKR 170,000
monthly saving = monthly bill * 0.85
payback years  = estimated cost / (monthly saving * 12)
```

The visitor can then submit contact details to the Quote Generation webhook.
n8n calculates and persists the quote, sends email notifications, and returns
the detailed quote for display. The UI renders system size, panel count,
estimated cost, monthly savings, and payback period from that response.

### 3. Consultation booking

The booking UI exposes the next 30 weekdays and eight one-hour slots from 09:00
through 16:00. After the visitor selects a slot, the Meeting Booking webhook
receives the contact details, ISO date, time, and optional notes. n8n owns this
workflow end to end: it upserts the client, inserts the meeting and interaction,
and emails the client and admin. This avoids duplicate client records between
the browser fallback and the automation workflow.

### 4. CRM operations

Authenticated server-rendered pages query Supabase directly rather than waiting
on a slower dashboard webhook:

- **Overview:** total clients, active/inactive counts, meetings this week,
  quote totals, period-over-period trends, six-month lead chart, and recent
  interactions.
- **Clients:** relational client rows with meetings, interactions, and quotes;
  rows expand into client history.
- **Meetings:** search by name/email, filter by status, and update meetings to
  `completed`, `no_show`, or `cancelled` through an authenticated Server Action.
- **Agents:** four configured automation roles with availability and recent
  trigger information derived from interactions. When an n8n base URL and
  workflow ID are configured, the card links to the workflow editor.

The repository includes two n8n JSON exports (`Workflow 2.json` and
`Workflow1.json`) containing webhook, PostgreSQL, Gmail, schedule, branching,
and code nodes for the automation layer. n8n activation and workflow editing
remain in n8n itself; the app does not pretend to provide an n8n REST control
plane on a free-trial instance.

## Data Model and Security

The Supabase CRM model contains four related tables:

- `clients`: identity, source, lifecycle status, and creation time.
- `meetings`: client relationship, date/time, notes, and appointment status.
- `quotes`: usage/bill inputs and generated financial/system estimates.
- `interactions`: activity records such as form submissions, quote generation,
  booked meetings, emails, and follow-ups.

Row Level Security is documented in [`supabase/policies.sql`](supabase/policies.sql):

- `anon` may insert into `clients`, `meetings`, and `interactions`, but cannot
  read or modify CRM data. This supports public-form fallback writes without
  exposing client PII.
- `authenticated` users have full CRM table access for the admin portal.
- `quotes` are intentionally not writable by anonymous visitors; quote creation
  is owned by n8n.

Supabase sessions are refreshed in `middleware.ts`. Requests under `/admin/*`
redirect unauthenticated users to the login screen, while the admin layout
renders the sidebar and topbar only after `getAuthUser()` succeeds. The service
role client exists in `lib/supabase/admin.ts` for server-only privileged work;
its secret must never be exposed to a Client Component.

## Local Setup

### Prerequisites

- Node.js compatible with the Next.js 16 toolchain
- A Supabase project with the CRM tables and Auth enabled
- Optional: an n8n instance with the exported workflows imported and active

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The available scripts are:

```bash
npm run dev       # Start the Next.js development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Serve the production build
```

### Environment variables

Set these in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/server session-scoped Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged Supabase client |
| `NEXT_PUBLIC_N8N_LEAD_WEBHOOK` | Landing contact form webhook |
| `NEXT_PUBLIC_N8N_QUOTE_WEBHOOK` | Detailed quote webhook |
| `NEXT_PUBLIC_N8N_MEETING_WEBHOOK` | Consultation booking webhook |
| `NEXT_PUBLIC_N8N_DASHBOARD_WEBHOOK` | Reserved contract; dashboard currently queries Supabase directly |
| `N8N_BASE_URL` | Base URL used to link Agents cards to n8n |
| `N8N_WORKFLOW_ID_LEAD_CAPTURE` | Lead Capture editor link |
| `N8N_WORKFLOW_ID_QUOTE_GENERATION` | Quote Generation editor link |
| `N8N_WORKFLOW_ID_MEETING_BOOKING` | Meeting Booking editor link |
| `N8N_WORKFLOW_ID_FOLLOW_UP` | Follow-up editor link |

`N8N_API_KEY` is retained in `.env.example` for deployment parity, but the
current app does not call the n8n REST API. Placeholder workflow values are
treated as unconfigured, so the Agents page shows a graceful unavailable state.

### Supabase initialization

For a fresh project, apply [`supabase/policies.sql`](supabase/policies.sql)
after creating the `clients`, `meetings`, `interactions`, and `quotes` tables.
The types in [`lib/types.ts`](lib/types.ts) document the expected enum-like
values and joined shapes used by the pages. Create the first admin user in
Supabase Authentication with email/password and auto-confirm enabled, then use
that account at `/admin`.

## Engineering Highlights

- **Clear integration boundaries:** public forms know only their webhook
  payloads; server-rendered admin pages own CRM reads; the meeting Server Action
  owns authenticated status mutation.
- **Graceful degradation:** `postToWebhook` never throws into the UI when an
  endpoint is missing, unavailable, or returns an explicit failure response.
- **RLS-first data access:** anonymous writes are narrowly scoped, while admin
  reads use the authenticated Supabase session rather than shipping secrets to
  the browser.
- **Typed relational UI:** domain types model client relations, meeting status,
  interaction types, and quote results instead of passing unstructured data
  through every component.
- **Responsive operational UX:** loading skeletons, searchable tables, status
  filters, transition states, empty states, and inline error states support
  repeated admin use.
- **Reproducible automation:** n8n exports live in the repository alongside
  the application, making the external workflow layer inspectable and
  portable.

## Project Status

This repository is a working demo of the product and integration architecture.
The public funnel, Supabase-backed CRM views, authentication flow, calculator,
booking experience, and n8n contracts are implemented. Production hardening
would naturally include server-side webhook mediation or signature validation,
real availability checks against calendar data, automated tests, and more
granular per-user authorization than the current single-admin RLS model.