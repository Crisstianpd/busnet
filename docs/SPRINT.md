# SPRINT — BusNET (fuente única de tareas y estado)

> Protocolo: el orquestador toma la primera tarea sin checkbox de la fase activa, la despacha a un Builder (Sonnet), el Reviewer audita contra los acceptance criteria (AC), y solo entonces se marca el checkbox y se commitea. Formato de commit: `F<fase>.<n>: <desc>`. Reglas completas en CLAUDE.md; límites en GUARDRAILS.md.
>
> **Fase activa:** F0

---

## F0 — Design System & Repo Setup

- [ ] **F0.1 — Commit de docs.** Copiar CLAUDE.md a la raíz y docs/ completo al repo.
  AC: `CLAUDE.md`, `docs/{ULTRAPLAN,SPRINT,ARCHITECTURE,GUARDRAILS}.md` y `docs/prompts/` existen en el repo y están commiteados.

- [ ] **F0.2 — Inventario del repo y del motor.** Leer todo el árbol del repo. Producir en el reporte: (a) estructura real, (b) paths exactos del motor de rutas, (c) formato real del output de `/plan`, (d) gaps vs ARCHITECTURE.md.
  AC: GUARDRAILS §1 actualizado con los paths del motor; ARCHITECTURE.md anotado con desviaciones reales (sección "Estado real" al final); ningún archivo de código modificado.

- [ ] **F0.3 — Vendor del design system.** Descomprimir el export de Claude Design en `design-system/` y commitearlo.
  AC: `design-system/` en el repo; incluye tokens (colores/tipografía/spacing) y componentes; nada del export editado.

- [ ] **F0.4 — Sync de tokens.** Correr `/design-sync` (o mapeo manual) para llevar los tokens a la config de Tailwind/NativeWind del repo.
  AC: la config de estilos expone `busnet.*` tokens; una página de prueba renderiza color primario, superficie, texto y tipografía correctos; cero hex hardcodeado.

- [ ] **F0.5 — Componentes base `ui/`.** Generar desde el design system: `Button`, `Sheet` (bottom sheet), `Card`, `Badge`, `Input`, `Spinner`.
  AC: los 6 componentes en `src/components/ui/`, tipados, usando solo tokens; render de prueba a 375px sin overflow.

- [ ] **F0.6 — shared/types.ts.** Crear los tipos `TripPlan`, `Leg`, `BusPosition`, `CheckingEvent` según ARCHITECTURE.md, importables por cliente y servidor.
  AC: compila; cliente y servidor pueden importar sin duplicar tipos.

**Phase Gate F0:** build limpio · motor sin diff · Eduardo aprueba visualmente los componentes base.

---

## F1 — App Shell & Map

- [ ] **F1.1 — Router y shell.** Rutas `/` (usuario) y `/fleet` (dashboard vacío placeholder). Layout mobile-first con safe areas.
  AC: navegación funciona; `/` muestra contenedor de mapa a pantalla completa a 375px.

- [ ] **F1.2 — Mapa base.** MapLibre + Carto basemap (estilo oscuro del design system), centrado en San Salvador, con controles mínimos.
  AC: mapa interactivo fluido en mobile; sin claves expuestas en cliente más allá de lo permitido por Carto.

- [ ] **F1.3 — Capa de rutas.** Cargar los 20 GeoJSONs desde `/routes` y pintarlos con la paleta de rutas del design system, desvanecidos por defecto.
  AC: 20 rutas visibles; colores desde tokens; performance sin jank al pan/zoom.

- [ ] **F1.4 — SearchBar.** "¿A dónde vas?" prominente. Query → `/geocode` (Nominatim); sin resultados → fallback LLM (Codex API) que devuelve nombre + coords.
  AC: "Hospital Bloom" resuelve por Nominatim; una referencia coloquial (ej. "el hospital de niños") resuelve por fallback; errores muestran estado vacío del design system.

- [ ] **F1.5 — Endpoint `/geocode`.** Implementar en server: Nominatim con `countrycodes=sv`, timeout 3s, fallback LLM, cache en memoria.
  AC: responde `{name, lng, lat, source: "nominatim"|"llm"}`; probado con 5 destinos del demo script.

**Phase Gate F1:** buscar un destino centra el mapa con marker · Eduardo aprueba look del mapa.

---

## F2 — Trip Planner UI

- [ ] **F2.1 — planAdapter + mock.** `server/adapters/planAdapter.ts` convierte el output real del motor al contrato `TripPlan`. Mientras el motor no esté conectado: `planAdapter.mock.ts` con 3 planes realistas (directo, 1 transbordo, 2 transbordos) sobre rutas reales.
  AC: `GET /plan?from&to` responde `TripPlan[]` válido (mock); flag de env `USE_MOCK_PLAN`.

- [ ] **F2.2 — TripOptionsSheet.** Bottom sheet con 2–4 alternativas: `🚌 30B → 🚶 4 min → 🚌 7D · 42 min · $0.50 · 1 transbordo`, ordenadas por tiempo.
  AC: tarjetas con componentes `ui/`; seleccionar una emite el plan elegido; cerrable con gesto.

- [ ] **F2.3 — Render del plan en mapa.** Tramos bus en color sólido por ruta, caminatas punteadas, resto del mapa desvanecido; fly-to con `fitBounds` del plan.
  AC: los 3 planes mock renderizan correctos; deseleccionar restaura el mapa.

- [ ] **F2.4 — TripStepper.** Paso a paso estilo Moovit: "Caminá 450 m hasta…", "Tomá la Ruta 30B (cada ~12 min)", "Bajate en…". Copy en voseo salvadoreño suave o tuteo neutro — decidir con Eduardo en el gate.
  AC: pasos generados desde `TripPlan.legs`; iconografía del design system; scrolleable dentro del sheet.

- [ ] **F2.5 — Voz ElevenLabs.** Botón 🔊 en el stepper → `POST /speak` con el plan → mp3 en español, cacheado en `public/audio/` (key = hash del plan).
  AC: audio se reproduce en mobile; segunda petición del mismo plan sirve del cache; sin API key en cliente.

- [ ] **F2.6 — Conexión al motor real.** Con el compañero: apagar `USE_MOCK_PLAN`, ajustar `planAdapter` al output real, correr los 4 escenarios del demo script.
  AC: los 4 escenarios devuelven plan real y renderizan; escenarios y resultados documentados al final de este archivo (§Demo Scenarios). **Requiere presencia de Eduardo.**

**Phase Gate F2:** demo script pasos 1–2 completos en un celular real.

---

## F3 — Live Tracking (simulador)

- [ ] **F3.1 — simulator.ts.** Por unidad: velocidad 20–35 km/h con ruido, `turf.along()` sobre su polyline, pausas de 15–60s en paradas, loop al terminar la ruta. 8–15 unidades distribuidas en las rutas del demo. Tick 2s.
  AC: log del server muestra posiciones coherentes que avanzan sobre las rutas; CPU estable.

- [ ] **F3.2 — WebSocket /buses + fallback.** Broadcast `BusPosition[]` cada 2s; endpoint `GET /buses` equivalente para polling.
  AC: cliente recibe updates; matar el WS activa polling sin que la UI lo note.

- [ ] **F3.3 — LiveBusLayer.** Markers de bus (icono del design system) con número de ruta, rotados por `bearing`, animación interpolada entre ticks.
  AC: buses se mueven suave (sin saltos) a 375px; tap en bus abre F3.4.

- [ ] **F3.4 — BusDetailSheet (premium).** Sheet con: unidad, ruta, próxima parada, ETA a la parada del usuario (distancia sobre polyline / velocidad), badge "Premium".
  AC: ETA cambia en tiempo real; diseño con tokens; badge visible para la narrativa del pitch.

- [ ] **F3.5 — Checkpoints + geofence.** `data/checkpoints/` con 3–5 puntos por ruta del demo; el simulador emite `CheckingEvent` al cruzarlos (radio ~60m) con `lapNumber` incremental.
  AC: eventos aparecen en el log del server con timestamps y vueltas coherentes.

**Phase Gate F3:** demo script paso 3 completo · mapa "se ve vivo" (aprobación visual Eduardo).

---

## F4 — Fleet Dashboard & n8n *(paralelizable con F3 en worktree separado)*

- [ ] **F4.1 — Seed fleet.** `data/seed/fleet.json`: 12 unidades con placas tipo `SM-###`, motoristas (nombres comunes salvadoreños), ruta asignada, horario.
  AC: el simulador consume el seed (unidades del mapa == unidades del dashboard).

- [ ] **F4.2 — Layout /fleet.** Dashboard desktop-first con el design system: header, `KpiCards` (unidades activas, vueltas hoy, % puntualidad), grid.
  AC: renderiza con datos de `/fleet/summary`; también legible en mobile.

- [ ] **F4.3 — LiveUnitsTable + CheckingLog.** Tabla de unidades en vivo (WS) y log de checking que se llena en tiempo real con animación de entrada por fila.
  AC: al cruzar un checkpoint en el mapa, la fila aparece en el log en <3s. **Este es el momento clave del pitch — debe verse perfecto.**

- [ ] **F4.4 — Webhook n8n.** El simulador POSTea `CheckingEvent` e `inicio de ruta` a un webhook n8n; workflow envía mensaje a Telegram/WhatsApp del "empresario".
  AC: mensaje llega en <10s; workflow guardado y screenshoteado para el pitch (track n8n); URL del webhook en `.env`.

- [ ] **F4.5 — `/fleet/summary`.** KPIs agregados calculados del estado del simulador.
  AC: números consistentes con la tabla y el log.

**Phase Gate F4:** demo script paso 4 completo end-to-end (checkpoint → log → Telegram).

---

## F5 — Integración, Styling & Deploy

- [ ] **F5.1 — Styling pass.** Integrator revisa todas las pantallas contra el design system: spacing, jerarquía, estados vacíos, loading (Spinner), dark map consistente.
  AC: cero hex hardcodeado (`grep` de `#[0-9a-fA-F]{3,6}` en componentes = solo tokens/config); capturas de cada pantalla en el reporte.

- [ ] **F5.2 — Pre-generar audios.** Correr `/speak` para los 4 escenarios del demo script; commitear mp3 en `public/audio/`.
  AC: demo funciona con ElevenLabs API apagada.

- [ ] **F5.3 — Deploy.** Frontend a Netlify, server a Railway/Render; env vars configuradas; CORS correcto.
  AC: URL pública funciona en 2 celulares reales con datos móviles; WS o polling activo en producción.

- [ ] **F5.4 — QR + smoke test.** QR de la URL para el slide final; correr los 4 escenarios completos en producción.
  AC: 4/4 escenarios pasan en producción; QR verificado.

- [ ] **F5.5 — Video de respaldo.** Screen-recording del demo completo (mobile + dashboard) ANTES del freeze.
  AC: video ≥ pasos 2–4 del demo script, guardado fuera del repo (Drive) y en el teléfono de dos personas.

**Phase Gate F5 = FREEZE (T-2h).** Post-gate solo `fix(demo):`.

---

## F6 — Pitch (humano: Frank + equipo, en paralelo desde F2)

- [ ] F6.1 — Slides: problema → demo en vivo → moat (frase ULTRAPLAN v1 §3) → 3 pilares → flywheel → roadmap → ask. Assets con Fal.
- [ ] F6.2 — One-pager Q&A: data de rutas, "¿y si Moovit entra?", pricing SaaS, "¿el GPS es real?" (respuesta honesta).
- [ ] F6.3 — Ensayo cronometrado ×2 (≤3 min) con la app en producción.
- [ ] F6.4 — Slides exportados a PDF + QR embebido.

---

## Demo Scenarios (completar en F2.6 — criterio final de F5)

| # | Origen | Destino | Resultado esperado | Estado |
|---|---|---|---|---|
| 1 | (GPS actual) | Hospital Bloom | 1 transbordo, con voz | ⬜ |
| 2 | Soyapango | Centro Histórico | 2 alternativas | ⬜ |
| 3 | Metrocentro | ISSS General | directo | ⬜ |
| 4 | (elegir con rutas reales) | (elegir) | tracking premium visible | ⬜ |

## Backlog (ideas nuevas van aquí — NO se ejecutan sin aprobación)

- Script KML→GeoJSON batch (`node scripts/convert.js ./kml/`) — stretch ULTRAPLAN §7
- Firecrawl metadata de rutas/tarifas
- Reportes ciudadanos (fase 2 post-buildathon)
