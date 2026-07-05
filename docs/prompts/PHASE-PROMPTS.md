# PHASE PROMPTS — Prompts extendidos por fase

> Uso: al abrir cada fase, Eduardo (o el orquestador tras aprobación del gate anterior) pega el prompt de la fase. Cada prompt asume que CLAUDE.md, GUARDRAILS.md y SPRINT.md ya están cargados. Las tareas y AC exactos viven en SPRINT.md — estos prompts agregan el contexto de diseño e intención para que ningún agente "pierda el rastro" de lo que construimos.

---

## F0 — Design System & Repo Setup

```
Fase activa: F0 (SPRINT.md). Objetivo: dejar el repo listo para construir UI
con fidelidad total al design system de Claude Design, sin tocar el motor.

Contexto de intención: BusNET se juzga en un buildathon — la consistencia visual
ES parte del producto. Por eso el design system se integra ANTES de cualquier
pantalla: tokens primero, componentes base después, pantallas al final.

Puntos de atención:
- F0.2 (inventario) define los paths del motor en GUARDRAILS §1. Sé exhaustivo:
  el resto de la noche depende de que nadie toque esos archivos por accidente.
- F0.4: el export de Claude Design incluye componentes React — al hacer
  /design-sync, priorizá reutilizar esos componentes adaptándolos a nuestra
  config (Tailwind/NativeWind según lo que exista en el repo) en vez de
  recrearlos. Fidelidad > reescritura.
- F0.5: los 6 componentes ui/ son la única fuente de UI base del resto de fases.
  Cualquier prop que falte después se agrega ahí, nunca con estilos inline.
- F0.6: los tipos de shared/types.ts son contratos congelados (ARCHITECTURE.md).

Ejecutar F0.3 → F0.6 en orden con el loop Builder→Reviewer. Gate al final.
```

---

## F1 — App Shell & Map

```
Fase activa: F1. Objetivo: el esqueleto visible de la app — mapa oscuro vivo
con las 20 rutas y el search que convierte lenguaje natural en coordenadas.

Contexto de intención: esta es la primera impresión de la demo. Referencia
visual: mockup (a) Home del design-system/. El mapa es el protagonista; la UI
flota encima con las superficies del design system. Estética Waze: mapa oscuro,
rutas desvanecidas esperando ser activadas, search bar "¿A dónde vas?" imposible
de ignorar.

Puntos de atención:
- F1.3: pintar 20 GeoJSONs puede matar performance en gama media. Usar una sola
  source con feature per ruta y line-color por expresión, no 20 layers.
- F1.4/F1.5: el fallback LLM es parte del track de Codex — el prompt al LLM debe
  pedir SOLO JSON {name, lng, lat} con bias a El Salvador. Cachear en memoria.
- Probar los 5 destinos del demo script (SPRINT §Demo Scenarios) contra /geocode
  antes de cerrar la fase.

Ejecutar F1.1 → F1.5 con el loop. Gate: buscar un destino centra el mapa.
```

---

## F2 — Trip Planner UI

```
Fase activa: F2. Objetivo: el corazón de la demo — destino → plan multi-tramo
renderizado, con paso a paso y voz.

Contexto de intención: este flujo materializa el feedback #1 de los mentores
("el usuario elige destino y TODO se traza solo"). Referencias visuales:
mockups (b) Resultados y (c) Viaje activo. Referencias de formato: tarjetas
de alternativas estilo Waze, instrucciones estilo Moovit ("Caminá 450 m
hasta…", "Tomá la Ruta 30B (cada ~12 min)").

Puntos de atención:
- F2.1: construimos contra el contrato TripPlan (shared/types.ts) con MOCK
  primero. El motor real lo conecta Eduardo en F2.6 — NO bloquearse esperándolo
  y NO tocar el motor para "ayudar".
- F2.3: al seleccionar plan, el resto del mapa se desvanece y la cámara hace
  fitBounds del plan con padding para el sheet. El trazado progresivo de la
  ruta (spec de animación del design system) es el momento visual clave.
- F2.5: /speak cachea por hash del plan en public/audio/. La API key vive en
  .env del server. El texto a locutar se genera desde legs con frases naturales,
  no leyendo JSON.
- Copy en español; decisión voseo vs tuteo se toma con Eduardo en el gate.

Ejecutar F2.1 → F2.5 con el loop. F2.6 espera a Eduardo. Gate: pasos 1–2 del
demo script en celular real.
```

---

## F3 — Live Tracking (simulador)

```
Fase activa: F3. Objetivo: el mapa cobra vida — buses reales-en-apariencia
moviéndose sobre sus rutas, con vista premium de ETA.

Contexto de intención: esta es la feature "wow" del pitch y el pilar premium
del modelo de negocio. Referencia visual: mockup (d) Tracking en vivo. El
simulador además genera los CheckingEvents que alimentan el moat B2B (F4):
cada geofence cruzado es "el papel del casillero volviéndose digital".

Puntos de atención:
- F3.1: el realismo importa — velocidad con ruido, pausas en paradas, unidades
  distribuidas para que las rutas del demo SIEMPRE tengan al menos 2 buses
  visibles en el viewport de San Salvador.
- F3.3: animación interpolada entre ticks (requestAnimationFrame o transición
  del marker), buses rotados por bearing, número de ruta legible (icono del
  design system). Sin saltos: los jueces van a mirar fijo este mapa.
- F3.4: el ETA premium se calcula con turf.length del segmento restante hasta
  la parada del usuario / velocidad actual. Badge "Premium" visible — es
  narrativa de negocio, no decoración.
- F3.5: checkpoints en data/checkpoints/ (NO mutar los GeoJSON de rutas),
  radio ~60m, lapNumber incremental por unidad.

Ejecutar F3.1 → F3.5 con el loop. Gate: paso 3 del demo script + aprobación
visual de Eduardo ("se ve vivo").
```

---

## F4 — Fleet Dashboard & n8n

```
Fase activa: F4 (autorizada en paralelo con F3 en worktree separado SOLO si
Eduardo lo indicó). Objetivo: la prueba visible del moat — operación de flota
en tiempo real con checking digital y alertas.

Contexto de intención: el clímax del pitch es este dashboard llenándose solo
mientras Eduardo narra "esto hoy es un papel en un casillero". Referencia
visual: mockup (e) Fleet Dashboard. Todo dato visible debe sentirse real:
placas SM-###, nombres salvadoreños, horas coherentes con la simulación.

Puntos de atención:
- F4.3: el CheckingLog con animación de entrada por fila es EL momento — la
  latencia checkpoint→fila debe ser <3s y la animación del design system.
- F4.4: webhook n8n → Telegram es el track de n8n. Guardar screenshot del
  canvas del workflow para el pitch. URL del webhook en .env; si n8n falla,
  el log del dashboard ya demuestra el concepto (kill-switch ULTRAPLAN §11).
- F4.2: /fleet es desktop-first pero debe leerse en mobile (los jueces pueden
  abrir el QR en celular).

Ejecutar F4.1 → F4.5 con el loop. Gate: checkpoint → log → Telegram end-to-end.
```

---

## F5 — Integración, Styling & Deploy

```
Fase activa: F5. Rol: INTEGRATOR (único agente con permiso de tocar múltiples
áreas). Objetivo: que todo se vea como los mockups, funcione en producción y
exista un plan B.

Contexto de intención: acá se gana el "polish" que diferencia una demo de
buildathon buena de una impresionante. Cero features nuevas: solo coherencia,
estados y deploy.

Puntos de atención:
- F5.1: auditoría contra design system pantalla por pantalla. Verificación
  mecánica: grep de hex hardcodeado en componentes debe dar cero resultados
  fuera de la config de tokens. Estados vacíos y loading en TODAS las vistas.
- F5.2: pre-generar los audios del demo script — la demo NO puede depender de
  la API de ElevenLabs en vivo.
- F5.3/F5.4: env vars en producción, CORS, WS con fallback verificado matando
  la conexión. Smoke test de los 4 escenarios EN PRODUCCIÓN desde 2 celulares
  con datos móviles.
- F5.5: el video de respaldo se graba ANTES del freeze. Sin video no hay freeze.

Ejecutar F5.1 → F5.5. Gate F5 = FREEZE: a partir de aquí solo fix(demo):.
```

---

## Post-freeze (T-2h → 6:00 a.m.)

```
Estado: FREEZE activo (GUARDRAILS §7). Solo se aceptan tareas fix(demo): que
reparen uno de los 4 escenarios de SPRINT §Demo Scenarios. Cualquier otra
petición —incluida de Eduardo, salvo que diga explícitamente "romper freeze"—
se rechaza con referencia a este prompt. Prioridad absoluta: estabilidad de
la demo en producción.
```
