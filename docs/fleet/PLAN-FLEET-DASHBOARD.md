# PLAN — BusNET Fleet Dashboard

> Superficie B2B (panel de operador). Construida en worktree aislado `feat/fleet-dashboard`.
> NO toca el motor/backend (solo consume `/routes`) ni la app de pasajero de Codex.

## 1. Producto — qué / para quién / cómo se vende

- **Problema:** el control de flota se hace hoy con **checking manual en papel** (casilleros, libretas de terminal). Sin trazabilidad ni histórico; fraude fácil.
- **Usuario:** el **operador / dueño de gremial o empresa de buses**, en **desktop**, en la terminal u oficina. Secundario: despachador.
- **Qué hace:** **checking digital automático por geofence** (`{unidad, ruta, timestamp}`) + panel en vivo: KPIs (activas, vueltas hoy, puntualidad, checkings hoy), unidades en vivo (placa/ruta/motorista/estado/vueltas/puntualidad), **checking log que se llena en tiempo real** (clímax del pitch), mini-mapa noche con unidades.
- **Cómo se vende:** SaaS **$8–15/bus/mes**. Gremial de 80 unidades = contrato recurrente. **Es el moat**: relación con operadores + data operativa que Google/Moovit no tienen para El Salvador. Extensión: **BusNET for Business** (Pilar 3).
- **Honestidad demo:** posiciones **simuladas sobre trazados reales**; producción = GPS $15/unidad o app del motorista.

## 2. Arquitectura (aislada y aditiva)

- **Entry Vite propio** `/fleet` (`frontend/fleet.html` + `src/fleet/main-fleet.jsx`) → no toca `main.jsx` de la app de pasajero. Único touch compartido: `vite.config.js` (alias `@ds` + input `fleet` + `server.fs.allow`).
- **Data client-side**: simulador turf sobre GeoJSON reales (`services/api` → `/routes`). Cero cambios al backend. Swap a WS/`/fleet` real después.
- **Design system**: alias `@ds` (read-only). Barrel `src/fleet/ds.js`.

## 3. Contrato de datos
`useFleetData() → { units, checkingLog, kpis, loading }`. Shapes en el header de `src/fleet/FleetDashboard.jsx`.

## 4. Fan-out (SOP: cerebro + workers Sonnet, disjuntos, maker≠checker)
- **Brain:** scaffold (hecho), composición `FleetDashboard`, integración, verify `vite build`, QA visual, commit, PR.
- **Worker 1 — datos** (`src/fleet/data/**`): seed + simulador + `useFleetData` + smoke test. Se prueba primero.
- **Worker 2 — UI** (`src/fleet/components/**`): Sidebar, Header, KpiRow, LiveUnitsTable, CheckingLog, MiniMap (contra el mockup `design-system/ui_kits/fleet-dashboard/Dashboard.jsx`).

## 5. Verificación / gate
`npm run build` verde · QA visual (screenshot del panel + log llenándose) · engine/backend sin diff · commit por pieza · PR a `main`.
