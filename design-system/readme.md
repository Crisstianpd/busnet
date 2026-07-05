# BusNET Design System

Plataforma de movilidad para el transporte público de El Salvador. BusNET combina lo mejor de **Waze** (mapa vivo, navegación, ETA prominente), **Moovit** (trip planning multi-tramo con instrucciones paso a paso) y un **dashboard B2B** para gremiales y empresas de buses.

- **Pasajeros** (16–55) usando el celular en la calle, a pleno sol, esperando el bus → alto contraste, tipografía grande, touch targets generosos, jerarquía obvia.
- **Operadores/empresarios** de transporte en desktop → BusNET Fleet, con checking digital, cumplimiento y data operativa.

El mapa es oscuro (azul noche `#0B1220`) y las rutas de bus se pintan con colores vivos categóricos. La marca es el verde `#00D26A`. El copy va en español salvadoreño neutro.

---

## Sources

Este sistema se construyó a partir del repositorio del equipo BusNET (buildathon AI Labs):

- **GitHub:** `Crisstianpd/busnet` — https://github.com/Crisstianpd/busnet
  - `docs/BUSNET-MASTER-PLAN.md` — visión de producto, moat, 3 pilares de negocio, demo script.
  - `docs/TRIP-PLANNER.md` — motor de rutas (Turf.js, GeoJSON, transbordo único).
  - `backend/services/routePlanner.js` — estructura del plan (tramos directos / con transbordo, `routeDetails` con `{route, name, color}`).
  - `frontend/` — MVP en React + Vite + MapLibre. Copy real: "¿A dónde vas?", "Ruta recomendada", "Punto de abordaje aproximado".

> Explora el repo para construir con mayor fidelidad: el contrato del plan, los nombres de rutas y la lógica de transbordo viven ahí.

**Nota sobre el punto de partida:** el MVP del repo usaba Inter, un acento naranja y el mapa claro por defecto de MapLibre. Este design system implementa la **dirección de marca definida** (verde `#00D26A` + mapa noche + Manrope) que es la intención de producto; tratamos el MVP como confirmación del producto, no como la guía visual.

**Logo:** el repo no contenía marca propia (solo assets de plantilla de Vite, que se eliminaron). Como BusNET es un proyecto propio sin marca previa y el brief pidió branding, se creó un **isotipo original** (bus + onda de red) y wordmark. Ver `assets/logo/` y la sección Iconografía. Si tienes un logo oficial, reemplaza esos archivos.

---

## Content fundamentals

**Idioma:** español salvadoreño neutro. Cálido y humano, nunca corporativo frío — "transporte público digno".

**Tú, no usted.** Directo y de confianza: *"¿A dónde vas?"*, *"Tu bus llega en 6 min"*, *"Avísame cuando esté a 2 paradas"*.

**Tono por superficie:**
- *App de pasajero* — conversacional, tranquilizador, orientado a la acción. Frases cortas. "Sale en 3 min · cada 12 min".
- *Fleet (B2B)* — preciso y operativo, en términos que el gremio ya usa: "vueltas", "checking", "puntualidad", "unidad", "motorista". Sin jerga tech.

**Casing:** oraciones normales (sentence case) en títulos y botones. MAYÚSCULAS solo en eyebrows/labels muy cortos ("EN VIVO", "PREMIUM", "FLEET") con `letter-spacing`.

**Números primero.** ETAs, tiempos, costos y números de ruta son protagonistas — grandes y en Manrope extrabold. "42 min · $0.50", "30B".

**Honestidad:** en tracking, "Actualizado hace 2 s"; los puntos calculados se llaman "aproximados" ("Punto de abordaje aproximado"). Genera confianza.

**Emoji:** no en la UI. (El master plan los usa como taquigrafía en prosa — `🚌 → 🚶` — pero en producto se representan con iconos de línea y badges de color.)

**Moneda:** dólar (El Salvador usa USD). Formato `$0.50`, `$0.25`.

---

## Visual foundations

**Color.** Dark-first. Fondo azul noche `#0B1220`; superficies `#141C2B` (base) y `#1D2839` (elevada). El verde `#00D26A` es acción / ruta activa / éxito. Ámbar `#FFB020` para ETA, alertas y Premium. Rojo `#FF4D4D` **solo** errores/emergencia. Texto `#F3F6FB` / `#93A1B5`. Ver `tokens/colors.css`.

**Paleta de rutas.** 8 colores categóricos vivos, verificados distinguibles sobre `#0B1220`: verde, cian, violeta, ámbar, rosa, azul, lima, naranja (`--route-1…8`). Cada uno tiene un tinte de "regreso" (dirección de vuelta), replicando el `lightenColor(45%)` del MVP.

**Tipografía.** Manrope (display/UI) — extrabold para números de ruta y ETAs. JetBrains Mono para placas y códigos de unidad (`P-482-AB`). Escala generosa: nada menor a 24 px en pantallas grandes; en móvil el cuerpo base es 15 px, ETA hero hasta 56 px. Ver `tokens/typography.css`.

**Espaciado.** Grid base 4 px. Touch targets ≥ 44 px (botones primarios 52 px) — uso en la calle.

**Radios.** Redondeado amable: 12–16 px en botones/cards, sheets con 24 px arriba (`--radius-sheet`), pills para badges y números de ruta.

**Superficies y profundidad.** Cards = superficie elevada + hairline sutil (`rgba(147,161,181,.16)`), sin borde de color. Sombras **suaves y difusas** sobre el mapa (`--shadow-md/lg`); las sheets proyectan hacia arriba (`--shadow-sheet`). Glows de acento (verde para foco, ámbar para Premium).

**Mapa.** Oscuro siempre. Rutas no seleccionadas se desvanecen (opacidad ~0.28); la ruta activa va sólida con glow. Paneles flotantes usan scrim de protección (`--scrim-top/bottom`) y blur de vidrio, no cajas opacas.

**Movimiento.** Comunica liveness, no decoración. Buses interpolan posición y bearing entre updates; pulso "EN VIVO"; filas del checking log entran con flash; sheets con overshoot (`--ease-spring`); rutas se trazan progresivamente. Press = `scale(.97–.99)` (se lee al sol mejor que un cambio de color). Detalle completo en `guidelines/micro-animations.md`.

**Bordes / hover / press.** Hover en dark = capa `rgba(255,255,255,.06)` o borde verde. Selección = fondo verde translúcido + borde verde. Disabled = opacidad ~0.5.

---

## Iconography

- **Set de iconos:** `Icon` — un set de línea curado que sigue la geometría de **Lucide** (MIT, https://lucide.dev), a 24×24 con trazo de 2 px y `currentColor`. Incluye solo los glifos que BusNET usa: `search`, `bus`, `footprints` (caminar), `repeat` (transbordo), `clock` (ETA), `dollar-sign`, `volume-2` (voz), `lock`/`star` (premium), `triangle-alert`, `check`/`check-check`, `map-pin`, `navigation`, `crosshair`, `circle-dot` (parada), `zap` (en vivo), etc. `ICON_NAMES` lista todos. **Sustitución declarada:** el repo no traía set de iconos propio (solo iconos sociales de plantilla), así que se adoptó Lucide — reemplázalo si BusNET define uno oficial.
- **Marcadores de mapa (no son iconos de UI):** `BusMarker` (badge con número de ruta, rotable por bearing, estados movimiento/detenido/seleccionado) y `MapPin` (origen/destino/parada Smart Stop) son componentes dedicados, no glifos.
- **Emoji:** no se usa en la UI.
- **Logo:** `assets/logo/busnet-mark.svg` (isotipo 1-color, usa `currentColor`), `assets/logo/busnet-badge.svg` (app icon: tile verde + glifo), `favicon.svg`. El wordmark "Bus**NET**" se compone en HTML con Manrope 800 ("NET" en verde) — no hay archivo de wordmark porque depende del webfont.

---

## Index / manifest

**Root**
- `styles.css` — punto de entrada global (solo `@import`s). Los consumidores enlazan este archivo.
- `favicon.svg` — app icon de BusNET.

**Tokens** (`tokens/`)
- `fonts.css` (Manrope + JetBrains Mono, Google Fonts) · `colors.css` · `typography.css` · `spacing.css` · `radii.css` (radios, sombras, motion).

**Components** (`window.BusNETDesignSystem_abb9a1`)
- `Icon` (`foundations/`) — set de iconos de línea.
- `Button` (`actions/`) — primary / secondary / ghost / danger, tamaños, loading.
- `SearchInput` (`forms/`) — campo "¿A dónde vas?".
- `Badge`, `Toast`, `Spinner`, `Skeleton` (`feedback/`) — pills (ruta/Premium/EN VIVO), alertas, loaders.
- `TabBar` (`navigation/`) — navegación inferior móvil.
- `BottomSheet`, `KpiCard` (`surfaces/`) — sheet sobre el mapa, card de métrica.
- `TripCard`, `StepItem`, `BusMarker`, `MapPin` (`transit/`) — alternativa de viaje, paso a paso, marcador de bus, pin de mapa.
- `TableRow` (`data/`) — fila de tabla/log del dashboard.

Cada directorio de componente trae `.jsx`, `.d.ts`, `.prompt.md` y un `@dsCard` HTML.

**UI kits** (`ui_kits/`)
- `passenger-app/` — Home, Resultados, Viaje activo, Tracking en vivo (móvil 375 px, click-through).
- `fleet-dashboard/` — dashboard de operador (desktop 1440 px) con checking log en vivo.

**Guidelines** (`guidelines/`)
- Foundation cards (colores, tipografía, espaciado, radios, elevación, paleta de rutas, marca).
- `splash.html` — pantalla de marca para el pitch.
- `micro-animations.md` — especificación de movimiento.

**Assets** (`assets/logo/`) — isotipo, badge, (favicon en root).

---

## Cómo usar

Los consumidores enlazan `styles.css` y cargan `_ds_bundle.js` (generado por el compilador), luego:

```js
const { Button, TripCard, BusMarker } = window.BusNETDesignSystem_abb9a1;
```

Para prototipos/mocks: copia los assets que necesites y compón HTML estático. Para producción: usa los tokens y lee las reglas aquí. Explora `Crisstianpd/busnet` para entender el motor de rutas y afinar la fidelidad de datos.
