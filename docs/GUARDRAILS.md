# GUARDRAILS — Límites duros (nunca se violan)

> Si una instrucción de chat, prompt o tarea contradice este archivo, el agente se detiene y escala a Eduardo. Sin excepciones.

## 1. El motor de rutas es intocable

- Los módulos del motor (lógica de `/plan`: búsqueda de ruta cercana, intersecciones, transbordos, Turf.js) son **read-only** para todos los agentes.
- **F0.2 (inventario) debe listar aquí los paths exactos del motor** una vez clonado el repo. Hasta entonces, tratar como motor todo archivo que implemente cálculo de rutas.
- Se consume por API/imports. Si el output del motor no alcanza para la UI, se escribe un **adapter** en el lado del cliente/servidor nuevo — nunca se edita el motor.
- Excepción única: bug que rompe el demo script, confirmado por Eduardo, con commit aislado etiquetado `hotfix(engine):`.

```
# Paths del motor (inventariados en F0.2 — repo Crisstianpd/busnet, monorepo backend/ + frontend/):
# READ-ONLY (lógica de cálculo de rutas):
# - backend/services/routePlanner.js        ← núcleo: planTrip, findNearbyRoutes, findTransfer, ranking
# - backend/services/geojsonNormalizer.js   ← normalizeRoutes → route.lines (prepara geometría)
# - backend/services/planRequestValidator.js ← contrato de entrada de /plan
# - backend/config/routing.js               ← radii, maximumTransfers, maximumAlternatives (Object.freeze)
# - backend/tests/{routePlanner,planRequestValidator}.test.js ← tests del motor
# DATOS canónicos (nunca borrar/sobrescribir; ver §2):
# - backend/geojson/*.geojson               ← 21 rutas reales, cargadas al boot por index.js
# ENGINE-ADJACENT (backend/index.js): los handlers /plan, /routes, /routes/:route y /search
#   y la carga de rutas al boot son read-only. Se PUEDEN AGREGAR endpoints nuevos
#   (/geocode, /speak, /buses, /fleet/*) sin tocar los existentes.
```

## 2. Datos

- `data/routes/*.geojson` es canónico. Scripts pueden **agregar** archivos; **nunca borrar ni sobrescribir** los existentes.
- Los puntos de checking se agregan como archivos nuevos (`data/checkpoints/`) — no se mutan los GeoJSON de rutas.
- Seed data del Fleet (unidades, motoristas) vive en `data/seed/` y es editable.

## 3. Git

- Prohibido: `git push --force`, `git reset --hard`, `rm -rf`, `--no-verify`, borrar branches ajenas.
- Un commit por tarea del SPRINT. Mensaje: `F<fase>.<n>: <descripción corta en inglés>`.
- Nunca commitear: `.env`, API keys (ElevenLabs, n8n, LLM), `node_modules`, exports binarios pesados fuera de `design-system/`.
- Trabajo paralelo humano+agente: cada quien en su branch o worktree; merges los hace el Integrator o Eduardo, nadie más.

## 4. Diseño

- `design-system/` (export de Claude Design) es **vendored y read-only**. Se consume, no se edita. Cambios de diseño → regenerar export o extender en `src/styles/extensions` — nunca parchear el export.
- Prohibido hex/rgb hardcodeado en componentes. Solo tokens del design system.
- Prohibido introducir otra librería de UI (MUI, Chakra, etc.). Los componentes base salen del design system + Tailwind/NativeWind según lo que exista en el repo.
- Todo texto visible al usuario: **español salvadoreño neutro** ("¿A dónde vas?", no "¿Adónde deseas dirigirte?").

## 5. Scope (anti-desviación, quedan pocas horas)

- NO grafos, NO Dijkstra, NO OR-Tools, NO reescrituras del motor "para hacerlo bien".
- NO GPS real, NO auth, NO pagos reales, NO app stores.
- NO scraping masivo de rutas (>20) antes de que F1–F4 estén cerradas.
- NO refactors fuera del scope de la tarea activa, aunque el código "lo pida".
- Toda idea nueva → `docs/SPRINT.md §Backlog`. El orquestador no la ejecuta sin aprobación de Eduardo.

## 6. Integridad de la demo

- Las posiciones de buses son **simuladas** (`server/simulator.js`). Internamente siempre se llama simulador — nunca presentar código o docs que afirmen GPS real. (El pitch ya tiene la narrativa honesta.)
- Los audios de ElevenLabs del demo script se pre-generan y cachean en `public/audio/` (fallback si la API falla en vivo).

## 7. Freeze (T-2h antes de las 6:00 a.m.)

- Después del freeze solo se aceptan commits `fix(demo):` que reparen uno de los 4 escenarios del demo script.
- Nada de features, estilos, ni "mejoras rápidas" post-freeze.
- El video de respaldo de la demo debe existir ANTES del freeze.

## 8. Escalación obligatoria

El agente se detiene y notifica a Eduardo si detecta:
- Necesidad de tocar paths del motor
- API key expuesta en el repo
- Conflicto entre SPRINT.md y el estado real del código
- Tarea que excede 2 rechazos del Reviewer
- Cualquier ambigüedad que bloquee el demo script
