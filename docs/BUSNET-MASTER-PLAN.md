# BusNET — Master Plan del Buildathon
**Equipo:** Cristian · Frank · Alexander · Eduardo
**Deadline:** 6:00 a.m. (T-15h20m desde este momento)
**Estado del build:** Motor de rutas geométrico funcionando con ~20 rutas en GeoJSON, render con MapLibre.

---

## 0. Decisión de scope (leer esto primero)

**La demo gana o pierde en 4 entregables. Todo lo demás es ruido hasta que estos 4 estén cerrados:**

1. **Trip Planner estilo Waze** — el usuario escribe un destino y la app traza automáticamente el viaje completo: caminar → bus A → bajarse → caminar → bus B → destino, con ETA y costo. (Ya está al 60% con el motor de Cristian.)
2. **Bus Tracking en vivo — SIMULADO** — buses moviéndose en tiempo real sobre el mapa. No GPS real: interpolación sobre las polylines GeoJSON. Visualmente indistinguible de tracking real. Esta es la feature "wow" y el pilar premium.
3. **BusNET Fleet (dashboard empresarial)** — panel web con insights operativos generados desde la data simulada: vueltas por unidad, cumplimiento de horarios, checking digital. Es la materialización del moat B2B.
4. **Pitch + demo script ensayado** — reservar las últimas 2 horas. Un demo perfecto sin pitch pierde contra un demo bueno con pitch perfecto.

**Regla de oro de las próximas 15 horas:** si una tarea no acerca uno de estos 4 entregables, no se hace. Grafos: NO. Scraping de todas las rutas del país: NO (script como stretch). GPS de hardware: NO. React Native pulido en device físico: solo si sobra tiempo — web mobile-first es suficiente para demo.

---

## 1. Qué evalúan los jueces (criterio de éxito)

Un buildathon de 24h no premia el código más completo. Premia:

| Criterio | Cómo lo cubrimos |
|---|---|
| Demo funcional en vivo | Trip planner + tracking simulado corriendo sin crashes |
| Problema real y grande | 99% de la fuerza laboral se mueve en bus; cero digitalización |
| Diferenciación clara | Moat de data local (ver §3) vs Moovit/Google Maps |
| Modelo de negocio creíble | Los 3 pilares (usuarios / gremiales / sector privado) |
| Uso inteligente de las tools | Tracks de Codex, n8n y ElevenLabs integrados sin forzar |
| Storytelling | El checking manual en libretas → checking digital. Historia salvadoreña, imposible de copiar por una app global |

---

## 2. Reverse engineering — qué adoptar exactamente de cada plataforma

### 2.1 Waze (base de UX y navegación)

**Qué hace bien y por qué:**
- **Destino primero, ruta automática.** El usuario nunca "explora rutas": escribe a dónde va y Waze decide. Esto es exactamente el feedback que recibieron — adoptarlo literal.
- **La ruta activa domina la pantalla.** Ruta seleccionada en color sólido; alternativas en gris desvanecido (Cristian ya tenía esto en su doc — validado).
- **ETA siempre visible y actualizándose.** El número grande arriba. Genera confianza aunque sea estimado.
- **Iconografía de vehículos en movimiento.** En Waze son carritos reportados; en BusNET son **buses con el número de ruta encima** moviéndose sobre su polyline. Esto convierte el mapa en algo vivo.
- **Reportes crowdsourced.** No para la demo, pero mencionarlo en el pitch como fase 2: los usuarios reportan "bus lleno", "ruta desviada", "no pasó" — y esa data alimenta el moat.

**Adopción concreta para la demo:**
- Search bar prominente arriba ("¿A dónde vas?") con autocomplete Nominatim + fallback LLM.
- Bottom sheet con las 2–4 opciones de viaje ordenadas por tiempo total, estilo tarjetas Waze: `🚌 Ruta 30B → 🚶 4 min → 🚌 Ruta 7D · 42 min · $0.50`.
- Al seleccionar: la ruta se pinta, la cámara hace fly-to, y aparece el paso a paso.

### 2.2 Moovit (modelo de datos y trip planning multi-tramo)

**Qué hace bien:**
- **Trip plan multi-leg con instrucciones humanas:** "Camina 450m hasta la parada X → toma la ruta Y (cada ~12 min) → bájate en Z". Este formato de instrucciones es el estándar de la industria — copiarlo textualmente en el step-by-step.
- **GTFS como modelo de datos.** Moovit vive de datos GTFS (General Transit Feed Specification). El Salvador no tiene GTFS público completo. **Insight estratégico: BusNET, al digitalizar rutas + paradas + frecuencias, está construyendo el GTFS de facto del país.** Eso es un activo vendible (gobierno, Google, la propia Moovit compran/consumen GTFS).
- **Comunidad Mooviters.** Moovit mapeó ciudades enteras con editores voluntarios locales. Validación de que el approach de "nosotros trazamos las rutas manualmente" no es una debilidad — es exactamente como el líder mundial construyó su data. Decirlo así en el pitch.

**Por qué Moovit pierde en El Salvador (nuestro ángulo de ataque):**
- Data desactualizada/incompleta para SV; no modela la realidad informal (rutas que "existen en la memoria colectiva").
- No tiene relación con los operadores locales: cero data operativa (vueltas, checking, cumplimiento). Moovit ve el sistema desde afuera; BusNET desde adentro.
- No resuelve nada para gremiales ni empresas — es solo B2C.

### 2.3 Uber (modelo de negocio y two-sided platform)

**Qué adoptar:**
- **Arquitectura de dos lados:** app de pasajero + app/panel de operador. BusNET Driver (minimalista: iniciar ruta / finalizar / emergencia) es el equivalente al driver app de Uber. Para la demo basta mockearlo o mostrar el flujo en el dashboard.
- **Uber for Business = el pilar del sector privado.** Uber vende a empresas el control y pago de la movilidad de sus empleados (viajes de trabajo, commuting, reporting centralizado). BusNET replica esto para bus: *"Tu empresa sabe que tus empleados llegan, con qué rutas, y puede subsidiar su pase"*. Nombrarlo **BusNET for Business** en el pitch — los jueces reconocen el patrón al instante.
- **ETA/ML como ventaja compuesta:** Uber mejora sus ETAs con cada viaje. BusNET mejora sus frecuencias estimadas con cada tracking. Efecto de red de data: más usuarios → mejores datos → mejor producto → más usuarios.

---

## 3. Moat y modelo de negocio — los 3 pilares

**Tesis del moat (para decirla en una frase):**
> "Google Maps y Moovit ven el transporte salvadoreño desde el satélite. BusNET lo ve desde adentro: digitalizamos la operación real — el checking que hoy se hace con papel y libreta en cada terminal del país — y esa data operativa no la puede scrapear nadie."

### Pilar 1 — Usuarios (B2C, freemium)
- **Gratis:** motor de rutas, trip planning, paradas, instrucciones paso a paso. Adquisición masiva; genera la data.
- **Premium (~$1.99–2.99/mes):** tracking en tiempo real de tus rutas favoritas, alertas de salida ("tu ruta salió de la terminal"), predicción de llegada a tu parada, modo sin ansiedad.
- El free tier no es caridad: cada búsqueda y cada viaje es data de demanda origen-destino que alimenta los pilares 2 y 3.

### Pilar 2 — Gremiales / empresas de transporte (B2B SaaS)
El dolor real (conocimiento local, contarlo tal cual en el pitch): hoy el control de vueltas se hace con **checking manual** — el conductor se baja, apunta hora y fecha en un casillero de papel; las terminales llevan libretas de llegadas y pasajeros. Cero trazabilidad, cero histórico, fraude fácil.
- **BusNET Fleet** reemplaza eso: checking digital automático por geofence (el bus cruza el punto de control → registro con timestamp), dashboard de vueltas por unidad, cumplimiento de horarios, kilometraje, incidentes.
- Pricing tipo SaaS por unidad/mes (ej. $8–15/bus/mes). Una gremial con 80 unidades = contrato serio.
- **Este pilar es el moat:** la relación con operadores + su data operativa es la barrera que Moovit/Google no tienen y no van a construir para El Salvador.

### Pilar 3 — Sector privado (B2B, data & commuting)
- **BusNET for Business:** las empresas pagan por visibilidad/beneficios de commuting de sus empleados (llegadas, rutas seguras, subsidio de pase premium como prestación).
- **Data products:** demanda origen-destino agregada y anonimizada para retail (dónde abrir sucursal), bienes raíces, publicidad geolocalizada en paradas y en app, y gobierno/alcaldías (planificación, el pitch del panel Gov de Frank encaja aquí).

**Flywheel (dibujarlo en un slide):**
Usuarios usan la app gratis → generan data de demanda y tracking → BusNET la empaqueta para gremiales y empresas → gremiales instalan checking digital → mejora la data de frecuencias → el producto B2C mejora → más usuarios.

---

## 4. Alcance exacto de la demo (SÍ / NO)

### SÍ (entregables de las 6 a.m.)
- [ ] Mapa MapLibre + Carto, mobile-first, con las ~20 rutas cargadas
- [ ] Search de destino (Nominatim + fallback LLM)
- [ ] Trip planner multi-leg: caminata → bus → transbordo → bus → caminata, con ETA total y costo
- [ ] Step-by-step de instrucciones estilo Moovit
- [ ] **Simulador de buses en tiempo real** (§6) con 8–15 unidades moviéndose
- [ ] Vista premium: tocar un bus → ver su posición, próxima parada, ETA a tu parada
- [ ] **BusNET Fleet dashboard** (web): unidades activas, vueltas de hoy, cumplimiento, checking log digital
- [ ] Voz ElevenLabs: anuncio del trip plan ("Camina 4 minutos hasta la parada...") — track ElevenLabs
- [ ] Workflow n8n: alerta automática (ej. bus se desvía / inicia ruta → notificación a dashboard o Telegram/WhatsApp) — track n8n
- [ ] Deploy accesible (Netlify/Vercel) + QR para que los jueces lo abran
- [ ] Pitch de 3 min + demo script ensayado 2 veces

### NO (se dice en el pitch como roadmap, no se construye)
- Grafos / Dijkstra / OR-Tools — la geometría con Turf.js es suficiente y ya funciona
- GPS hardware real, apps nativas publicadas, pagos reales, auth completa
- Scraping de las 700+ rutas del país (stretch: script semiautomático KML→GeoJSON, §7)
- Panel de gobierno completo (un slide/mock basta; el Fleet dashboard ya demuestra la capa B2B)

---

## 5. Arquitectura de la demo

```
Frontend (web mobile-first o Expo web)
  React + MapLibre GL + Turf.js + TanStack Query
  ├── App Usuario: mapa, search, trip planner, tracking premium
  └── Fleet Dashboard: /fleet (misma app, ruta distinta — NO repo aparte)

Backend (Node + Express)
  ├── /routes            → sirve GeoJSONs de rutas
  ├── /plan?from&to      → motor de rutas (lógica actual de Cristian)
  ├── /buses (WebSocket o polling 2s) → posiciones del simulador
  ├── /fleet/summary     → métricas agregadas del simulador
  └── simulator.js       → mueve buses sobre las polylines (§6)

Servicios externos
  Nominatim (geocoding) · LLM fallback (Codex/GPT API — cuenta para track Codex)
  ElevenLabs (TTS del trip plan) · n8n (webhooks de eventos del simulador)
```

**Decisión:** un solo repo, un solo deploy. El dashboard es una ruta más del mismo frontend. Cero overhead de infra en las últimas horas.

---

## 6. El simulador de GPS — la jugada clave de la noche

**Problema:** tracking en tiempo real necesita GPS en buses. Imposible en 15 horas.
**Solución:** los buses "reales" de la demo son procesos del backend que interpolan posición a lo largo de la polyline GeoJSON de su ruta.

Especificación (una tarea de ~2–3 h para una persona):

```js
// simulator.js — pseudocódigo
for each unidad asignada a una ruta:
  velocidad = 20–35 km/h con ruido gaussiano
  posición(t) = turf.along(rutaLine, distanciaAcumulada(t))
  en semáforos/paradas (puntos marcados): pausa 15–60s
  al cruzar un "punto de checking" (geofence turf.booleanPointInPolygon):
    → registra evento {unidad, ruta, timestamp}  // el checking digital
    → dispara webhook a n8n                      // track n8n gratis
  emite posiciones por WebSocket cada 2s
```

**Por qué esto gana:**
- El mapa se ve vivo — buses con número de ruta moviéndose de verdad.
- El **checking digital** deja de ser un slide: los jueces ven el log llenándose en el Fleet dashboard en tiempo real, y tú narras "esto hoy se hace con papel en un casillero".
- Honestidad estratégica en el pitch: "las posiciones de esta demo son simuladas sobre trazados reales; en producción la misma arquitectura consume GPS de $15/unidad o la app del motorista". Los jueces respetan eso — evalúan arquitectura, no hardware.

---

## 7. Pipeline de rutas (stretch, no bloqueante)

Estado: 20 rutas extraídas manualmente vía cartorux.com → KML → JSON.

- **Para la demo: 20 rutas alcanzan.** Elegir rutas que se intersecten bien para que el trip planner luzca (verificar que los 3–4 escenarios del demo script tienen solución con transbordo).
- **Stretch (si alguien queda libre H8+):** script Node que tome un directorio de KMLs y produzca GeoJSONs normalizados (`togeojson` + limpieza + metadata `{numero, nombre, tarifa}`). Convierte el proceso manual en `node convert.js ./kml/`.
- **Firecrawl:** scrapear metadata de rutas (números, recorridos descritos, tarifas) de sitios públicos/VMT para enriquecer las 20 rutas — bajo esfuerzo, y justifica el crédito de Firecrawl en el pitch técnico.
- **En el pitch:** "hoy 20 rutas trazadas a mano; el pipeline está listo para escalar y el plan es comunidad de mapeadores locales — exactamente como Moovit mapeó 3,500 ciudades".

---

## 8. Plan atómico por workstream (owners y horas)

> Ajustar owners según fortalezas reales; asumo: **Cristian** = motor de rutas (es su doc), **Alexander** = frontend/UX, **Eduardo** = simulador + Fleet + integración tools (orquestas), **Frank** = pitch/negocio + dashboard UI + QA. T = horas desde ahora.

### Workstream A — Trip Planner (Cristian) · T0–T7
- [ ] A1 (1h) Endurecer `/plan`: manejar "sin ruta directa" → transbordo con punto más cercano entre líneas (ya especificado en su doc)
- [ ] A2 (1h) Output estructurado del plan: `[{tipo: walk|bus, ruta, distancia, tiempo, desde, hasta}]` — contrato para frontend y ElevenLabs
- [ ] A3 (1.5h) ETA y costo: tiempo = distancia/velocidad promedio por tramo + espera estimada por frecuencia; costo = $0.25 urbana / tarifa por ruta
- [ ] A4 (1h) Ranking de 2–4 alternativas (menos transbordos vs. menos tiempo)
- [ ] A5 (1.5h) Caché de planes calculados (su propia idea — Map en memoria basta)
- [ ] A6 (1h) Probar los 4 escenarios del demo script y fixear edge cases

### Workstream B — Frontend Usuario (Alexander) · T0–T10
- [ ] B1 (1h) Search bar + resultados Nominatim + fallback LLM
- [ ] B2 (2h) Bottom sheet de alternativas de viaje (tarjetas estilo Waze/Moovit)
- [ ] B3 (2h) Render del plan: tramos de bus en color por ruta, caminatas en línea punteada, resto del mapa desvanecido; fly-to de cámara
- [ ] B4 (1.5h) Step-by-step de instrucciones + botón 🔊 (ElevenLabs)
- [ ] B5 (2h) Capa de buses en vivo: markers con número de ruta consumiendo el WebSocket, animación suave entre updates
- [ ] B6 (1.5h) Vista premium: tap en bus → sheet con próxima parada, ETA, badge "Premium"

### Workstream C — Simulador + Fleet + Tools (Eduardo) · T0–T10
- [ ] C1 (2.5h) `simulator.js` según §6 (posición, paradas, checking geofence, WebSocket)
- [ ] C2 (0.5h) Definir 3–5 puntos de checking por ruta en los GeoJSONs
- [ ] C3 (2h) Fleet dashboard: tabla de unidades en vivo, log de checking en tiempo real, cards de KPIs (vueltas hoy, unidades activas, % puntualidad), gráfico simple
- [ ] C4 (1h) n8n: webhook `checking` / `inicio de ruta` → mensaje a Telegram/WhatsApp del "empresario" + fila en el dashboard — **demostrarlo en vivo para el track**
- [ ] C5 (1h) ElevenLabs: endpoint `/speak` que convierte el plan (A2) en audio con voz en español; cachear los audios del demo script
- [ ] C6 (1h) Deploy (Netlify/Vercel + backend en Railway/Render) + QR
- [ ] C7 (1h) Buffer de integración / bugs cross-stream

### Workstream D — Negocio + Pitch + QA (Frank) · T0–T15
- [ ] D1 (1.5h) Slides: problema → demo → moat (frase de §3) → 3 pilares → flywheel → roadmap → ask
- [ ] D2 (1h) Seed data creíble del Fleet: nombres de unidades, motoristas, horarios — que se sienta real
- [ ] D3 (1h) Diseñar el **demo script** (§10) con Eduardo
- [ ] D4 (2h, T8–T10) QA de los flujos del demo script en mobile + desktop; reportar bugs, no fixearlos él
- [ ] D5 (1h) One-pager / notas para preguntas de jueces (unit economics de los pilares, respuesta a "¿y si Moovit entra?")

### Integración final (todos) · T10–T13.5
- [ ] I1 (1.5h) Merge, styling pass (limpio > bonito: spacing, una paleta, dark map), estados vacíos
- [ ] I2 (1h) Deploy final + prueba en 2 celulares reales con datos móviles
- [ ] I3 (1h) Bug bash solo de los flujos del demo script — congelar código a T-2h

### Pitch (todos) · T13.5–T15
- [ ] P1 (0.5h) Ensayo 1 completo con tiempo
- [ ] P2 (0.5h) Ajustes + ensayo 2
- [ ] P3 (0.5h) Plan B: video screen-recording del demo por si falla el WiFi (**grabarlo sí o sí a T-2h**)

---

## 9. Routing de herramientas del Buildathon

| Tool | Uso asignado | Prioridad |
|---|---|---|
| **Cursor ($60)** | IDE principal de los 4; Composer para features multi-archivo | Alta — ya en uso |
| **Codex/ChatGPT API ($50)** | (a) Fallback del search en lenguaje natural ("el hospital de niños" → Hospital Bloom + coords), (b) generación del texto de instrucciones humanizadas del trip plan. **Es uso de producto, no solo de IDE → cuenta fuerte para el track Codex** | Alta — track |
| **n8n ($60)** | Workflow de alertas operativas (C4). Mostrar el canvas de n8n en el pitch 10 segundos | Alta — track |
| **ElevenLabs (Creator)** | Voz del trip plan en español + accesibilidad (usuarios con baja alfabetización — ángulo social fuerte) | Alta — track |
| **Firecrawl ($20)** | Scraping de metadata de rutas/tarifas de sitios públicos (§7) | Media |
| **Exa ($50)** | Research puntual durante la noche (frecuencias, tarifas, referencias de competidores) | Media |
| **Netlify ($20)** | Deploy del frontend | Media |
| **Devin ($40)** | Solo si un módulo aislado se atrasa (ej. el script KML→GeoJSON o el gráfico del dashboard): tarea autocontenida con spec clara. NO meterlo al repo principal a mitad de la noche | Baja — reserva |
| **Fal ($100/equipo)** | Logo/branding + imágenes del pitch deck (Smart Stops render, hero del slide) | Baja — Frank en D1 |
| **Zavu / DataMCP / Flow** | No forzar. Mencionar solo si surge uso natural | Ignorar |

**Regla:** los 3 tracks (Codex, n8n, ElevenLabs) ya están cubiertos con usos que fortalecen la demo en lugar de desviarla. No agregar más integraciones por codicia de tracks.

---

## 10. Demo script (3 minutos, ensayado)

1. **Hook (20s)** — "En El Salvador el 99% de la fuerza laboral se mueve en bus, y todo el sistema se controla con papel y libretas. Nadie sabe cuándo pasa su ruta. Esto es BusNET."
2. **Trip planner (60s)** — En vivo, en un celular: buscar "Hospital Bloom" (o el destino más confiable de los 4 escenarios probados). Sale el plan con transbordo. Tap en 🔊 → la voz de ElevenLabs lee las instrucciones.
3. **Tracking premium (40s)** — Abrir el mapa: buses moviéndose. Tap en uno: "está a 6 minutos de tu parada". "Esto es nuestra suscripción premium."
4. **Fleet — el moat (50s)** — Cambiar al dashboard: el log de checking llenándose solo. "Este registro hoy es un papel en un casillero. BusNET lo hace automático. Esta data operativa es lo que Google y Moovit nunca van a tener." Mostrar la alerta llegando por n8n al teléfono.
5. **Modelo + cierre (30s)** — Slide del flywheel y 3 pilares. "Gratis para el usuario, SaaS para las gremiales, data para las empresas. Empezamos con 20 rutas trazadas; el pipeline escala al país. Somos BusNET."

---

## 11. Riesgos y kill-switches

| Riesgo | Señal | Kill-switch |
|---|---|---|
| Trip planner con bugs en transbordos | T7 y A6 no pasa | Demo con los 2 escenarios que sí funcionan; hardcodear el plan del demo script si hace falta (nadie lo sabrá y es legítimo en demo) |
| WebSocket inestable en deploy | T11 | Polling cada 2s — visualmente idéntico |
| ElevenLabs latencia/créditos | T10 | Pre-generar los MP3 del demo script y servirlos estáticos |
| n8n no llega a tiempo | T11 | Cortar C4; el checking log en dashboard ya demuestra el concepto |
| Deploy roto a última hora | T-2h | Demo en localhost + hotspot; y el video Plan B (P3) siempre grabado |
| Cansancio → decisiones malas | T8+ | Turnos de siesta de 40 min escalonados entre T6 y T10; nadie decide arquitectura después de T10 |

---

## 12. Checklist de congelamiento (T-2h, 4:00 a.m.)

- [ ] Los 4 escenarios del demo script pasan en un celular real con datos móviles
- [ ] Video de respaldo grabado
- [ ] Slides exportados a PDF (por si no hay internet)
- [ ] QR del deploy en el último slide
- [ ] Ensayo cronometrado ≤ 3 min hecho 2 veces
- [ ] Respuestas listas: "¿cómo consiguen la data de todas las rutas?", "¿y si Moovit entra a SV?", "¿cuánto cobra el SaaS?", "¿el GPS es real?" (respuesta honesta de §6)

---

*Documento generado para la sesión del Buildathon AI Labs. Fuente de ejecución: este plan. Después del evento: writeback de resultados y decisiones al CKIS vault (`02-projects/busnet/_overview.md`).*
