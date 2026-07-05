# CLAUDE.md — BusNET (Buildathon AI Labs)

> Este archivo es la constitución del repo para todos los agentes. Si algo aquí contradice una instrucción ad-hoc del chat, **este archivo gana**, salvo que Eduardo lo edite explícitamente.

## Qué es este proyecto

BusNET: plataforma de movilidad para transporte público de El Salvador. Demo de buildathon con deadline duro (6:00 a.m.). El motor de rutas (geometría con Turf.js sobre GeoJSONs, endpoint `/plan`) **ya existe y funciona — es intocable** (ver GUARDRAILS.md). El trabajo restante es: UI/UX de usuario, simulador de tracking, Fleet dashboard, integraciones (ElevenLabs, n8n) y deploy.

## Jerarquía de fuentes de verdad

1. `docs/SPRINT.md` — estado real de tareas (checkboxes). Única fuente de "qué sigue".
2. `docs/ULTRAPLAN.md` — plan maestro, scope y fases.
3. `docs/ARCHITECTURE.md` — contratos de datos y estructura.
4. `docs/GUARDRAILS.md` — límites duros. Nunca se violan.
5. `design-system/` — export de Claude Design. Fuente única de tokens, colores, tipografía y componentes base. **No inventar estilos fuera de él.**

## Stack

- **Frontend:** React (mobile-first, viewport base 375px) + MapLibre GL + Turf.js + TanStack Query
- **Backend:** Node.js + Express (`/plan`, `/routes`, `/buses`, `/fleet/*`) + WebSocket (fallback: polling 2s)
- **Datos:** GeoJSONs en `data/routes/` (canónicos, nunca borrar)
- **Estilos:** tokens del `design-system/` (via `/design-sync`). Prohibido hex hardcodeado en componentes.
- **Copy:** UI en español; código, comments, commits e identificadores en inglés.

## Modelo de orquestación (Opus → Sonnet → Reviewer)

El **orquestador (Opus)** nunca escribe código de features. Su loop:

```
1. Leer docs/SPRINT.md → tomar la PRIMERA tarea sin checkbox de la fase activa
2. Despachar a un subagente Builder (Sonnet) con:
   - La tarea exacta (ID, descripción, acceptance criteria)
   - SOLO los archivos relevantes (no todo el repo)
   - Recordatorio: read before edit, tokens del design-system
3. Al terminar el Builder → despachar Reviewer con SOLO el diff/filepaths:
   - Verificar acceptance criteria uno por uno
   - Verificar guardrails (engine intacto, sin hex hardcodeado, sin deps nuevas no justificadas)
   - Veredicto: PASS | BLOCKING (lista de fixes) | MINOR (anotar y seguir)
4. Si PASS → marcar checkbox en SPRINT.md → git commit (un commit por tarea, mensaje: "F2.3: trip results bottom sheet")
5. Si BLOCKING → devolver al Builder con la lista, máx 2 iteraciones; a la 3ª, escalar a Eduardo
6. Repetir. Al cerrar una fase: correr el "Phase Gate" (ver abajo) antes de avanzar.
```

### Subagentes

| Rol | Modelo | Tools | Regla clave |
|---|---|---|---|
| Builder | Sonnet | read, write, bash | Implementa UNA tarea. No refactoriza fuera de scope. Devuelve filepaths + cómo verificó. |
| Reviewer | Sonnet (o Haiku si es trivial) | read, bash | Recibe solo el diff. Sin historial del Builder (review imparcial). |
| Integrator | Sonnet | read, write, bash | Solo en fase F5: merge, estilos, estados vacíos, deploy. |

### Phase Gate (al cerrar cada fase)

- [ ] Todos los checkboxes de la fase marcados
- [ ] `npm run build` (o dev server) sin errores ni warnings nuevos
- [ ] Los flujos del demo script afectados por la fase funcionan en viewport 375px
- [ ] Engine (`/plan` y sus módulos) sin diff — verificar con `git diff --stat <engine paths>`
- [ ] Commit de cierre de fase: `"phase F<N> complete"`

## Reglas de trabajo (todas las sesiones, todos los agentes)

- **Read before edit.** Nunca modificar un archivo sin leerlo en esta sesión.
- **`git status` antes de editar.** Árbol limpio o entender por qué no.
- **Un commit por tarea.** Nunca acumular 5 tareas en un commit.
- **No deps nuevas** sin anotarlo en el reporte de la tarea con justificación de una línea.
- **No tocar el motor.** Consumirlo por su API. Si el contrato del `/plan` no alcanza, escalar — no "arreglarlo".
- **Mobile-first.** Todo se desarrolla y verifica primero a 375px; desktop solo para el Fleet dashboard.
- **Sin trabajo especulativo.** Si no está en SPRINT.md, no se construye. Ideas nuevas → anotarlas en `docs/SPRINT.md §Backlog`, no implementarlas.
- **Demo script es sagrado.** Ante cualquier tradeoff, gana lo que hace funcionar los 4 escenarios del demo (ver ULTRAPLAN §10).

## Contexto mínimo por sesión nueva

Al iniciar cualquier sesión de Claude Code, cargar en este orden:

```
@CLAUDE.md
@docs/GUARDRAILS.md
@docs/SPRINT.md          ← identifica la fase activa y siguiente tarea
@docs/ARCHITECTURE.md    ← solo si la tarea toca contratos/estructura
```

## Escalación a Eduardo (parar y preguntar)

- Cualquier cambio que requiera tocar el motor de rutas
- Migración/restructura de directorios existentes
- Dep nueva de más de una línea de justificación
- Una tarea lleva 2 rechazos del Reviewer
- Cualquier operación destructiva (rm, reset, force push — prohibidas por GUARDRAILS)
- Después del freeze (T-2h): cualquier cambio fuera de bugs del demo script
