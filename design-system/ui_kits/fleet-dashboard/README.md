# Fleet Dashboard UI kit

Desktop dashboard (1440 px) for transport operators — BusNET's B2B surface and the moat story in the pitch.

Open **`index.html`**.

## What it shows (`Dashboard.jsx`)
- **Sidebar** — BusNET Fleet nav (Resumen, Unidades, Checking, Rutas, Reportes) + operator account.
- **KPI row** — Unidades activas, Vueltas hoy, Puntualidad, Checkings hoy (`KpiCard`). The checkings counter ticks up live.
- **Unidades en vivo** — live units table with route, driver, status, laps, punctuality (`TableRow` + `Badge`).
- **Checking digital** — the log that **fills in real time**: every ~2.6 s a new checking event flashes in at the top (`TableRow entering`). This is the pitch climax — "hoy esto es un papel en un casillero".
- **Mini mapa** — compact night map with a few buses (`BusMarker`).

Composed entirely from design-system components via `_ds_bundle.js`.
