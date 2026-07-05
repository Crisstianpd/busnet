# BusNET 🚌

**Plataforma inteligente de movilidad para el transporte público de El Salvador.**
Buscá tu destino y BusNET traza el viaje completo: qué bus tomar, dónde transbordar, cuánto caminar, cuánto cuesta y cuándo llega tu ruta — en tiempo real.

Proyecto del **Buildathon AI Labs** · Equipo: Cristian, Frank, Alexander, Eduardo.

## Los 4 entregables de la demo

1. **Trip Planner** estilo Waze — destino → plan multi-tramo automático (motor geométrico con Turf.js sobre GeoJSONs de rutas reales)
2. **Tracking en vivo** — buses moviéndose en el mapa (simulado sobre trazados reales; misma arquitectura que producción con GPS)
3. **BusNET Fleet** — dashboard empresarial con checking digital: lo que hoy se hace con papel y libretas en cada terminal del país
4. **Pitch** — moat de data operativa local + modelo de 3 pilares (usuarios freemium / gremiales SaaS / BusNET for Business)

## Quickstart

```bash
git clone https://github.com/Crisstianpd/busnet
cd busnet
npm install
cp .env.example .env    # ElevenLabs, n8n webhook, LLM API key
npm run dev             # cliente + server
```

- App usuario: `http://localhost:5173/` (mobile-first — abrir con device toolbar a 375px)
- Fleet dashboard: `http://localhost:5173/fleet`

## Documentación (leer antes de tocar código)

| Doc | Qué es |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Constitución del repo + protocolo de orquestación de agentes |
| [`docs/GUARDRAILS.md`](./docs/GUARDRAILS.md) | Límites duros (el motor es intocable, etc.) |
| [`docs/ULTRAPLAN.md`](./docs/ULTRAPLAN.md) | Plan maestro, fases y estrategia |
| [`docs/SPRINT.md`](./docs/SPRINT.md) | Tareas atómicas y estado real (checkboxes) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Contratos de datos y estructura |
| [`docs/prompts/`](./docs/prompts/) | Kickoff, brief de Claude Design y prompts por fase |

## Stack

React + MapLibre GL + Turf.js + TanStack Query · Node/Express + WebSocket · GeoJSON · Claude Design system (`design-system/`) · ElevenLabs · n8n · Nominatim + LLM fallback

## Regla de oro

> El motor de rutas es intocable. El diseño solo usa tokens del `design-system/`. Si no está en `docs/SPRINT.md`, no se construye.
