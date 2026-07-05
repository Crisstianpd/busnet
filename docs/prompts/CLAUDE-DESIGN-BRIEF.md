# Brief para Claude Design — BusNET Design System

> Cómo usarlo: llenar los campos del formulario de Claude Design con la sección §1, pegar el prompt de §2 como descripción/instrucción principal, generar, iterar con §3, exportar zip → commit en `design-system/` → `/design-sync` en Claude Code (SPRINT F0.3–F0.4).

---

## §1 — Parámetros exactos para los campos

| Campo (o equivalente) | Valor |
|---|---|
| **Project name** | BusNET |
| **One-liner / description** | Plataforma de movilidad para el transporte público de El Salvador: trip planning multi-tramo, tracking de buses en tiempo real y dashboard operativo para empresas de transporte. |
| **Audience** | (1) Pasajeros salvadoreños 16–55, uso en la calle bajo sol, celulares de gama media; (2) operadores/empresarios de transporte en desktop. |
| **Platform** | Mobile-first web app (viewport base 375px) + un dashboard desktop. |
| **Style keywords** | Modern transit app, dark map UI, friendly, high-contrast, trustworthy, Waze-meets-Moovit, toque cálido latinoamericano (no corporativo frío). |
| **Color — primary** | Verde BusNET `#00D26A` (acción, rutas activas, éxito) |
| **Color — background/surface** | Azul noche `#0B1220` (fondo app/mapa oscuro) · superficie `#141C2B` · superficie elevada `#1D2839` |
| **Color — accent** | Ámbar `#FFB020` (alertas, ETA, premium) · Rojo `#FF4D4D` solo errores/emergencia |
| **Color — texto** | `#F3F6FB` primario · `#93A1B5` secundario |
| **Route palette** | 8 colores categóricos vivos y distinguibles sobre fondo oscuro (para pintar rutas de bus distintas): sugerir desde verde/cian/violeta/ámbar/rosa/azul/lima/naranja. |
| **Typography** | Display/UI: **Manrope** (o Inter) — bold para números de ruta y ETAs grandes; mono opcional para placas/códigos. |
| **Corner radius / vibe** | Redondeado amable (12–16px), sheets con radius 24px arriba, sombras suaves, botones grandes (touch targets ≥44px, uso en la calle). |
| **Dark/Light** | Dark como principal (mapa nocturno); light opcional solo si es gratis de generar. |
| **Idioma del copy en mockups** | Español ("¿A dónde vas?", "Tu bus llega en 6 min"). |

## §2 — Prompt principal (pegar completo)

```
Diseña el design system completo y los mockups de BusNET, una app de transporte
público para El Salvador que combina lo mejor de Waze (mapa vivo, navegación,
ETA prominente) y Moovit (trip planning multi-tramo con instrucciones paso a paso),
más un dashboard B2B para empresas de buses.

CONTEXTO DE USO: pasajeros usando el celular en la calle, a pleno sol, esperando
el bus. Todo debe ser de alto contraste, tipografía grande, touch targets generosos
y jerarquía obvia. El mapa es oscuro (azul noche #0B1220) y las rutas de bus se
pintan con colores vivos categóricos. La marca es el verde #00D26A.

GENERAR:

1. TOKENS: paleta completa (primario, superficies, texto, semánticos, paleta
   categórica de 8 colores para rutas), tipografía (Manrope), spacing, radii
   (12–16px, sheets 24px), sombras, estados (hover/pressed/disabled).

2. LOGO + ICONOGRAFÍA:
   - Logo BusNET (wordmark + isotipo de bus estilizado con señal/onda de red)
   - Icono de BUS para el mapa: visto desde arriba o 3/4, con placa de color de
     ruta y el NÚMERO de ruta legible encima (ej. "30B"), rotable por bearing;
     variantes: en movimiento / detenido / seleccionado
   - Icono de PARADA (Smart Stop), pin de destino, pin de origen (persona)
   - Set de iconos UI: buscar, caminar, transbordo, reloj/ETA, costo $, voz 🔊,
     premium (candado/estrella), alerta, checking ✓

3. COMPONENTES (con estados): Button (primary/secondary/ghost), Input de búsqueda
   grande "¿A dónde vas?", BottomSheet (colapsado/medio/expandido), Card de
   alternativa de viaje (línea de tramos: 🚌 30B → 🚶 4 min → 🚌 7D · 42 min ·
   $0.50), Step item del paso a paso, Badge (ruta, Premium, EN VIVO), Toast/Alert,
   KpiCard, Table row, Tab bar, Spinner/skeleton.

4. MOCKUPS (mobile 375px salvo el dashboard):
   a. Home: mapa oscuro con rutas desvanecidas + search bar prominente
   b. Resultados: bottom sheet con 3 alternativas de viaje ordenadas por tiempo
   c. Viaje activo: ruta pintada en el mapa + paso a paso + botón de voz
   d. Tracking en vivo: buses con número de ruta moviéndose + bus seleccionado
      con sheet "llega a tu parada en 6 min" y badge Premium
   e. Fleet Dashboard (desktop 1440px): KPIs (unidades activas, vueltas hoy,
      % puntualidad), tabla de unidades en vivo, log de "checking digital"
      llenándose en tiempo real, mini mapa
   f. Splash/branding con el logo (para el pitch)

5. MICRO-ANIMACIONES (spec escrita o ejemplos): bus deslizándose entre posiciones,
   pulso "EN VIVO", entrada de fila nueva en el checking log, transición del
   bottom sheet, trazado progresivo de la ruta al seleccionarla.

TONO: moderno, confiable y humano — transporte público digno, no corporativo frío.
Copy de los mockups en español salvadoreño neutro. Exportar todo como sistema
consistente y reutilizable (tokens + componentes React si el export lo permite).
```

## §3 — Checklist de iteración antes de exportar

- [ ] El número de ruta sobre el icono de bus es legible a tamaño de marker de mapa (~32–40px)
- [ ] La paleta de rutas se distingue sobre el fondo `#0B1220` (probar los 8 colores juntos)
- [ ] La Card de alternativa comunica tramos + tiempo + costo sin leer dos veces
- [ ] El checking log del dashboard se ve "vivo" (ese frame es el clímax del pitch)
- [ ] Contraste AA en texto secundario sobre superficies
- [ ] Logo funciona en 1 color (para el QR slide y favicon)

## §4 — Integración post-export (resumen; detalle en SPRINT F0)

1. Zip → `design-system/` en el repo, commit (vendored, read-only — GUARDRAILS §4).
2. Claude Code: `/design-sync` para mapear tokens a Tailwind/NativeWind. Como usamos componentes React, priorizar el export de componentes React de Claude Design y adaptarlos en `src/components/ui/` — fidelidad máxima con mínimo retrabajo.
3. Assets (logo, iconos de bus, pins) → `public/brand/` referenciados desde tokens.
4. Los mockups del export son la referencia visual de aceptación en cada Phase Gate.
