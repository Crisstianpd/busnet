# ARCHITECTURE — BusNET Demo

## Vista general

```
┌─────────────────────────────  Frontend (React, mobile-first)  ─────────────────────────────┐
│                                                                                             │
│  App Usuario (/)                                    Fleet Dashboard (/fleet)                │
│  ├─ MapView (MapLibre + Carto basemap)              ├─ LiveUnitsTable (WS)                  │
│  ├─ SearchBar (Nominatim → LLM fallback)            ├─ CheckingLog (WS, tiempo real)        │
│  ├─ TripOptionsSheet (2–4 alternativas)             ├─ KpiCards (vueltas, activas, % OTP)   │
│  ├─ TripStepper (paso a paso + 🔊 ElevenLabs)       └─ SimpleChart (frecuencia/hora)        │
│  ├─ LiveBusLayer (markers WS, anim. interpolada)                                            │
│  └─ BusDetailSheet (premium: ETA a tu parada)                                               │
└───────────────┬─────────────────────────────────────────────┬──────────────────────────────┘
                │ HTTP (TanStack Query)                        │ WebSocket (fallback polling 2s)
┌───────────────▼─────────────────────────────────────────────▼──────────────────────────────┐
│                              Backend (Node + Express)                                       │
│  /routes                → GeoJSONs de rutas (estático)                                      │
│  /plan?from&to          → MOTOR DE RUTAS (existente, read-only)                             │
│  /geocode?q             → Nominatim + fallback LLM (Codex API)                              │
│  /speak (POST plan)     → ElevenLabs TTS → mp3 (cache en public/audio/)                     │
│  /buses (WS)            → posiciones del simulador cada 2s                                  │
│  /fleet/summary         → KPIs agregados del simulador                                      │
│  simulator.js           → interpola unidades sobre polylines, geofence checking,            │
│                           emite WS + webhook n8n                                            │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │ webhook
                                  n8n workflow → Telegram/WhatsApp "empresario" + dashboard
```

## Contratos de datos (estables — la UI se construye contra esto)

### TripPlan (output de `/plan`, adaptado en `server/adapters/planAdapter.ts` si el motor difiere)

```ts
type TripPlan = {
  id: string;
  totalMinutes: number;
  totalCostUSD: number;
  transfers: number;
  legs: Leg[];
};

type Leg =
  | { type: "walk"; fromName: string; toName: string; meters: number; minutes: number;
      geometry: GeoJSON.LineString }
  | { type: "bus"; routeId: string; routeNumber: string; boardStop: string; alightStop: string;
      minutes: number; costUSD: number; headwayMinutes: number;   // frecuencia estimada
      geometry: GeoJSON.LineString };
```

### BusPosition (WebSocket `/buses`)

```ts
type BusPosition = {
  unitId: string;        // "SM-042"
  routeNumber: string;   // "30B"
  lng: number; lat: number;
  bearing: number;       // para rotar el icono
  speedKmh: number;
  status: "moving" | "at_stop" | "paused";
  nextCheckpointId?: string;
  ts: number;
};
```

### CheckingEvent (geofence del simulador → dashboard + n8n)

```ts
type CheckingEvent = {
  id: string;
  unitId: string;
  routeNumber: string;
  checkpointId: string;   // de data/checkpoints/
  checkpointName: string; // "Terminal de Oriente"
  ts: number;
  lapNumber: number;      // vuelta del día
};
```

**Regla:** estos tres tipos viven en `shared/types.ts` (o equivalente) y son importados por cliente y servidor. Cambiarlos requiere aprobación del orquestador + actualización de este archivo.

## Estructura de directorios objetivo

> El repo ya existe (`Crisstianpd/busnet`). F0.2 inventaría lo real y **adapta esta estructura a lo existente sin mover código del motor**. Lo nuevo se crea siguiendo este layout; lo viejo no se reubica.

```
busnet/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── ULTRAPLAN.md
│   ├── SPRINT.md
│   ├── ARCHITECTURE.md
│   ├── GUARDRAILS.md
│   └── prompts/
│       ├── KICKOFF-PROMPT.md
│       ├── CLAUDE-DESIGN-BRIEF.md
│       └── PHASE-PROMPTS.md
├── design-system/            ← export de Claude Design (vendored, read-only)
├── data/
│   ├── routes/*.geojson      ← canónico (20 rutas)
│   ├── checkpoints/*.json    ← puntos de checking por ruta (F3)
│   └── seed/fleet.json       ← unidades, motoristas, horarios (F4)
├── shared/types.ts
├── server/
│   ├── index.ts              ← Express + WS
│   ├── engine/…              ← MOTOR EXISTENTE (paths reales en GUARDRAILS §1)
│   ├── adapters/planAdapter.ts
│   ├── simulator.ts
│   └── services/{elevenlabs,geocode,n8n}.ts
├── src/  (o client/)
│   ├── App / router (/ y /fleet)
│   ├── components/{map,trip,fleet,ui}/
│   ├── hooks/{useBusesWS,usePlan,useSpeak}.ts
│   └── styles/ (tokens sincronizados del design-system)
└── public/audio/             ← mp3 pre-generados del demo script
```

## Integración del design system

1. Claude Design genera el sistema (ver `docs/prompts/CLAUDE-DESIGN-BRIEF.md`) → export zip → commit en `design-system/`.
2. En Claude Code: `/design-sync` para mapear tokens (colores, tipografía, radii, spacing) a la config de Tailwind/NativeWind del repo.
3. Componentes base (Button, Sheet, Card, Badge, Input) se generan una vez en `src/components/ui/` desde el design system y se reutilizan — no se re-generan por pantalla.
4. Regla dura (GUARDRAILS §4): cero estilos ad-hoc fuera de tokens.

## Decisiones fijadas

| Decisión | Valor | Razón |
|---|---|---|
| Un solo repo, un solo deploy | frontend + backend juntos | Cero overhead de infra a horas del deadline |
| Dashboard = ruta `/fleet` | misma SPA | Ídem |
| WS con fallback polling | 2s | Deploy resiliente (ULTRAPLAN §11) |
| GPS | simulado sobre polylines | ULTRAPLAN §6 |
| Estado servidor en memoria | sin DB | Demo de una noche; seed reproducible |
| Deploy | Netlify (front) + Railway/Render (server) | Créditos del buildathon + rapidez |

---

## Estado real (inventario F0.2 — repo `Crisstianpd/busnet`)

> Anotado en F0.2. La estructura objetivo de arriba es la aspiración; esto es lo que **existe hoy**. Lo nuevo se adapta a esto; el motor no se reubica.

### Estructura real: monorepo `backend/` + `frontend/` (no `server/`+`src/`+`shared/`+`data/`)

```
busnet/
├── .gitignore                 (node_modules, .env, dist, .cache, .DS_Store)
├── backend/                   (Node + Express 5, ESM, PORT 3000)
│   ├── index.js               ← Express: /routes, /routes/:route, /search, /plan (POST)
│   ├── config/routing.js      ← MOTOR (config)
│   ├── services/
│   │   ├── routePlanner.js     ← MOTOR (núcleo)
│   │   ├── geojsonNormalizer.js← MOTOR
│   │   └── planRequestValidator.js ← MOTOR (contrato entrada)
│   ├── geojson/*.geojson       ← 21 rutas canónicas (NO data/routes/)
│   ├── tests/*.test.js         ← node --test
│   └── package.json            (turf, express, cors, axios, dotenv; nodemon)
├── frontend/                  (React 19 + Vite 8, ESM)
│   └── src/
│       ├── main.jsx, main.css
│       ├── pages/Home.jsx
│       ├── components/Map/MapView.jsx, Trip/TripOptions.jsx
│       ├── hooks/useLocation.jsx
│       ├── services/api.js     ← ya llama /plan, /routes, Nominatim
│       └── utils/colors.js
└── docs/ (BUSNET-MASTER-PLAN.md, TRIP-PLANNER.md, ideas iniciales)
```

### Desviaciones vs objetivo (gaps que la UI/adapters deben absorber)

1. **Rutas**: viven en `backend/geojson/` (21 archivos), no `data/routes/`. Se cargan en RAM al boot.
2. **Motor**: en `backend/services/`, no `server/engine/`. Paths exactos en GUARDRAILS §1.
3. **`/plan` es POST con JSON**, no `GET /plan?from&to`. Body: `{ origin:{latitude,longitude}, destination:{latitude,longitude}, options:{maximumRadiusMeters?} }`.
4. **El output real de `/plan` ≠ contrato `TripPlan`.** Forma real:
   ```
   { search:{originRadiusMeters,destinationRadiusMeters,maximumRadiusMeters},
     bestOption: Option | null,
     alternatives: Option[] }   // máx 4 total, ordenadas por caminata→radio→transbordos
   Option = { type:"direct"|"transfer", routes:[...], routeDetails:[{route,name,color}],
     transfers, walkingDistanceMeters, boardingDistanceMeters, destinationDistanceMeters,
     transferWalkDistanceMeters, radiusUsedMeters,
     boardingPoint:{latitude,longitude}, dropoffPoint:{...},
     transferFromPoint?, transferToPoint?, *Label }
   ```
   **NO trae**: `minutes`, `costUSD`, `headwayMinutes`, geometría por leg, ni nombres de parada.
   → `planAdapter` (F2.1) debe **sintetizar** tiempo/costo/frecuencia y **derivar geometría de leg**
   recortando el GeoJSON de `/routes/:route` entre boarding/transfer/dropoff (snap points). Gap grande.
5. **No existe `design-system/`** aún (F0.3 bloqueado en el export de Claude Design).
6. **Solo existen 4 endpoints**: `/routes`, `/routes/:route`, `/search`, `/plan`. Faltan `/geocode`, `/speak`, WS `/buses`, `/fleet/*`, `simulator` (F1.5, F2.5, F3, F4).
7. **`/search`** ya existe en backend (busca dentro de features de rutas) — distinto del geocode Nominatim que el frontend ya hace client-side en `api.js`.
8. **Frontend**: React 19 + Vite 8 + maplibre-gl 5. **Falta** react-router (rutas `/` y `/fleet`), TanStack Query y Tailwind/tokens. `api.js` hardcodea `http://localhost:3000`.
9. **Gestor de paquetes mixto**: hay lockfiles pnpm (backend+frontend) y también `package-lock.json` (frontend). Decidir uno.
10. **Puertos**: backend 3000; frontend Vite 5173 (default). El README dice app en 5173 y fleet en 5173/fleet — coherente con frontend, pero el router aún no existe.

### Implicación para el plan
- El **motor funciona** y ya está consumido por `frontend/src/services/api.js::planTrip`. F2.6 ("conectar motor real") está parcialmente hecho de facto.
- El costo real está en el **planAdapter** (sintetizar minutos/costo/frecuencia + geometría de legs) y en todo lo que no existe (design-system, router, simulador, fleet, integraciones).
