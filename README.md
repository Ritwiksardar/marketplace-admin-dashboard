# ServiceHub Admin Panel (UI only, dummy data)

A React + TypeScript admin panel for a multi-service booking platform (provider app + customer app already exist — this is just the admin console UI, wired to in-memory dummy data so every screen is clickable).

## Features included

- **Provider approval** — review submitted documents, verify/reject each one, approve or reject the provider
- **Categories** — add / edit / activate-deactivate / delete
- **Sub-categories** — add / edit / activate-deactivate / delete, linked to a category
- **Services** — add / edit / activate-deactivate / delete, linked to a sub-category, with price & duration
- **Banners** — add / edit / activate-deactivate / delete, with display order and optional link to a category/service
- **Bookings** — full list, filter by status, view details
- **Assign provider** — match an unassigned booking to an approved, active provider
- **Booking status update** — change status (pending → assigned → in progress → completed / cancelled)
- **Customers** — list, search, activate/deactivate
- **Providers** — list, search, activate/deactivate, view profile

All data lives in `src/data/dummyData.ts` and in React state (`src/App.tsx`) — nothing is persisted or calls a real API yet. Swap the `useState` calls for real API calls when your backend is ready; the component props are already shaped like the data you'll get from an API.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Project structure

```
src/
  types/index.ts        - all TypeScript interfaces (Category, Service, Booking, Provider, ...)
  data/dummyData.ts      - dummy/mock data
  components/
    Sidebar.tsx          - left navigation
    Modal.tsx            - reusable modal
    Controls.tsx         - ToggleSwitch, status badges, confirm dialog
  pages/
    DashboardPage.tsx
    CategoriesPage.tsx
    SubCategoriesPage.tsx
    ServicesPage.tsx
    BannersPage.tsx
    BookingsPage.tsx
    AssignServicePage.tsx
    ProviderApprovalPage.tsx
    ProvidersPage.tsx
    CustomersPage.tsx
  App.tsx                - layout + navigation state + shared data state
  index.css              - design system (colors, tables, buttons, badges, modal, etc.)
```

## Wiring it to a real backend

Each page receives its data and a setter as props from `App.tsx`. To connect it to your real APIs:

1. Replace the `useState(initialX)` calls in `App.tsx` with data fetched from your admin API (e.g. in a `useEffect`).
2. Replace the local `setCategories`/`setBookings`/etc. updates inside each page's `save`, `toggleStatus`, `remove`, `updateStatus`, and `confirmAssign` functions with API calls (POST/PUT/DELETE), then update state from the response.
3. The document viewer in **Provider approval** currently just links to `doc.fileUrl` — point that at your real, signed document URLs.

No other structural changes should be needed — the UI, validation, and flows are already built.
