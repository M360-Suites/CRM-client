# CRM360 — Client

The web app for CRM360, a CRM that helps teams manage contacts, companies, deals and customer conversations in one place. It talks to the CRM360 backend API through a small proxy built into the app.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS 4** and **[shadcn/ui](https://ui.shadcn.com)** components (Radix UI) with **lucide-react** icons
- **[TanStack Query](https://tanstack.com/query)** for server data and **[Zustand](https://zustand.docs.pmnd.rs)** for client state
- **React Hook Form** + **Zod** for forms and validation
- **Axios** for API calls, **Sonner** for toasts
- **Recharts** for charts, **React Big Calendar** for the calendar, **@dnd-kit** for the pipeline board
- **Serwist** for the service worker, so the app can be installed as a PWA

> This version of Next.js has breaking changes compared with older releases. Before changing framework code, check the guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

You need **Node.js 20+** and **pnpm**.

```bash
pnpm install
cp .env.example .env   # then fill in the values (see below)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root. It is gitignored, so never commit real values.

| Variable | Required | What it's for |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Yes | Base URL of the CRM360 backend API. |
| `API_BASE_URL` | No | Server-only override for the API URL used by the proxy. Falls back to `NEXT_PUBLIC_BASE_URL`. |

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Production build (uses webpack, which the service worker setup needs). |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | Run ESLint. |

The service worker is disabled in development, so PWA behaviour only shows up in a production build.

## How it works

### Talking to the API

The browser never calls the backend directly. Every request goes to **`/api/proxy/...`** (`app/api/proxy/[...path]/route.ts`), which forwards it to the backend. This avoids CORS issues and keeps the backend URL server-side.

Requests flow through three layers:

```
component  →  hooks/<module>/*.ts  →  services/<module>/*.ts  →  services/apiclient.ts  →  /api/proxy  →  backend
             (TanStack Query hook)    (one function per endpoint)   (Axios + auth header)
```

- **`services/`** — one function per endpoint, using the shared `apiClient`.
- **`hooks/`** — TanStack Query `useQuery` / `useMutation` wrappers around those services. Components use these, not the services directly.
- **`services/apiclient.ts`** adds the access token from cookies to each request and sends the user to `/login` on a `401`.

### Authentication

- Tokens live in cookies (names in `lib/handler.ts`).
- **`proxy.ts`** (Next.js 16's replacement for `middleware.ts`) redirects signed-out users away from protected routes and signed-in users away from `/login`.
- `GET /api/auth-status` reports whether the current session is valid.

### State

- **Server data** (contacts, deals, tasks…) — TanStack Query, through the hooks above.
- **UI state shared across components** (import wizard steps, the selected record, the active sidebar link…) — Zustand stores in `stores/`.

## Project structure

```
app/
  (auth)/            Login, register, OTP, password reset, invites, onboarding
  (dashboard)/       Main app pages, wrapped in the sidebar + navbar layout
  api/               Proxy to the backend and auth-status route
  sw.ts              Service worker (Serwist)
components/
  ui/                shadcn/ui primitives (button, dialog, popover, table…)
  custom/common/     Shared app components (CustomButton, CustomInput, CustomDrawer,
                     CustomPagination, phone input, import mapping…)
  <module>/          Each module's header, body and forms
hooks/<module>/      TanStack Query hooks
services/<module>/   API calls
stores/<module>/     Zustand stores
types/               Shared TypeScript types
lib/                 Helpers (utils, cookie names, auth checks, import parsing)
validation/          Zod schemas
proxy.ts             Route protection
```

Each module follows the same pattern: a page in `app/(dashboard)/<module>/page.tsx` renders a `Header` and `Body` from `components/<module>/`, and data comes from `hooks/<module>/`.

## Modules

| Module | Route | Status |
| --- | --- | --- |
| Dashboard | `/dashboard` | Live |
| Contacts (with CSV import/export) | `/contacts` | Live |
| Companies (with CSV import) | `/companies` | Live |
| Pipelines (drag-and-drop deal board) | `/pipeline` | Live |
| Tasks & Calendar | `/tasks`, `/calendar` | Live |
| Inbox (Gmail and WhatsApp) | `/inbox` | Live |
| Documents | `/documents` | Live |
| AI Writer | `/ai-writer` | Live |
| Analytics & Reports | `/analytics`, `/report` | Live |
| Settings (profile, staff, roles, lead settings) | `/settings` | Live |
| Bulk Email | `/bulk-email` | UI in progress, not yet connected to the API |
| Automations | `/automations` | UI in progress, not yet connected to the API |

## Conventions

- **Imports** use the `@/` alias for the project root.
- **Files** use `snake_case` (e.g. `add_contact.tsx`, `get_contacts.ts`); components are `PascalCase`.
- **Styling** is Tailwind utility classes. Reuse the components in `components/custom/common/` and `components/ui/` before writing new ones.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`…
- **Branches** are named after the work, e.g. `feat/bulk-email-ui`, `fix/...`, `docs/...`, and merged into `main` through pull requests.
