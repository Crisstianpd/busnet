# ULTRAPLAN v2 — BusNET Buildathon

> v2 actualiza el Master Plan original con: (a) fase explícita de design system (Claude Design), (b) modelo de orquestación Opus→Sonnet, (c) SPRINT.md como única fuente de tareas. Las secciones de estrategia del plan original (reverse engineering §2, moat y 3 pilares §3, demo script §10, riesgos §11) **siguen vigentes sin cambios** — este archivo las referencia, no las repite.

## Los 4 entregables (sin cambios)

1. **Trip Planner estilo Waze** (motor existente + UI nueva)
2. **Tracking en vivo simulado** (simulator.js sobre polylines)
3. **BusNET Fleet dashboard** (checking digital = moat B2B)
4. **Pitch + demo script ensayado** (últimas 2h reservadas)

## Cambios v1 → v2

| Cambio | Detalle |
|---|---|
| +F0: Design System & Repo Setup | Claude Design genera el sistema completo (tokens, componentes, mockups, logo, iconos de bus) ANTES de construir UI. Export vendored en `design-system/`, sincronizado con `/design-sync`. |
| Workstreams (§8 v1) → SPRINT.md | El plan de tareas por persona del v1 se reorganiza en fases secuenciales orquestables por agentes. `docs/SPRINT.md` es ahora la única fuente de tareas y estado. |
| Ejecución | Opus orquesta, Sonnet construye, Reviewer audita, en loops autónomos (protocolo en CLAUDE.md). Eduardo supervisa gates de fase. El motor sigue siendo humano (compañero) y read-only para agentes. |
| Motor de rutas | Sale del sprint de agentes: lo termina el compañero en paralelo. La UI se construye contra el contrato `TripPlan` (ARCHITECTURE.md) usando el `planAdapter` con datos mock hasta que el motor real conecte (F2.6). |

## Fases (detalle atómico en SPRINT.md)

| Fase | Nombre | Output verificable | Est. |
|---|---|---|---|
| **F0** | Design System & Repo Setup | `design-system/` vendored, tokens sincronizados, componentes base `ui/`, docs en el repo, inventario del motor en GUARDRAILS §1 | 1.5–2h |
| **F1** | App Shell & Map | Mapa MapLibre con 20 rutas, search con Nominatim+LLM, layout mobile 375px con el design system | 2h |
| **F2** | Trip Planner UI | Bottom sheet de alternativas, render del plan en mapa, step-by-step, 🔊 ElevenLabs, conexión al motor real | 2.5–3h |
| **F3** | Live Tracking | simulator.ts, capa de buses animada, BusDetailSheet premium, checkpoints geofence | 2.5h |
| **F4** | Fleet & Integraciones | Dashboard /fleet, checking log en vivo, KPIs, webhook n8n → Telegram | 2h |
| **F5** | Integración & Deploy | Styling pass, estados vacíos, deploy Netlify+Railway, QR, prueba en 2 celulares, video de respaldo | 1.5h |
| **F6** | Pitch | Slides (assets Fal), ensayos cronometrados, one-pager Q&A | 1.5–2h (Frank en paralelo desde F2) |

**Ruta crítica:** F0 → F1 → F2 → F3 → F5. F4 puede solaparse con F3 (segundo agente/worktree). F6 corre en paralelo humano.

**Freeze:** T-2h. Post-freeze solo `fix(demo):` (GUARDRAILS §7).

## Presupuesto de tiempo revisado

Con orquestación autónoma, el cuello de botella no es tipeo sino **verificación**. Regla: Eduardo revisa visualmente el output de cada Phase Gate (5–10 min por fase) en el celular. No delegar el gate visual a agentes — los agentes verifican criterios, Eduardo verifica que "se ve impresionante".

## Referencias al plan original (vigentes)

- §2 Reverse engineering (Waze/Moovit/Uber) → decisiones de UX ya bajadas al CLAUDE-DESIGN-BRIEF y a las tareas de F1–F3
- §3 Moat y 3 pilares → narrativa del pitch (F6)
- §6 Simulador GPS → spec de F3.1
- §9 Routing de herramientas → sin cambios (Codex=geocode/instrucciones, n8n=F4.4, ElevenLabs=F2.5)
- §10 Demo script → criterio de aceptación final de F5
- §11 Kill-switches → vigentes; el orquestador los conoce vía este archivo
