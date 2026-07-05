# BusNET · Micro-animaciones

Motion tokens live in `tokens/radii.css`:

- `--ease-standard` `cubic-bezier(.2,0,.2,1)` — most UI transitions
- `--ease-emphasized` `cubic-bezier(.2,0,0,1)` — entrances, camera moves
- `--ease-spring` `cubic-bezier(.34,1.56,.64,1)` — sheet snaps, marker pops
- `--dur-fast 120ms` · `--dur-base 200ms` · `--dur-slow 320ms` · `--dur-sheet 360ms`

Principle: motion communicates **liveness and position**, never decoration. On the street, in sunlight, animation must clarify — where's my bus, did it move, is this real-time. Keep it subtle and fast; respect `prefers-reduced-motion`.

---

### 1. Bus deslizándose entre posiciones (the core "wow")
Buses arrive as discrete WebSocket/polling updates (~2 s). Never teleport. Tween position **and** bearing between the last and next point.

- **What:** `left`/`top` (or transform) transition, `2.3s linear` (slightly under the 2.5 s update so it settles before the next).
- **Bearing:** rotate the direction nub over `--dur-slow` with `--ease-standard`.
- **Impl:** `transition: left 2.3s linear, top 2.3s linear;` on the marker wrapper; recompute bearing = `atan2(dx, -dy)`. See `ui_kits/passenger-app/LiveTrackingScreen.jsx`.

### 2. Pulso "EN VIVO"
Communicates a live feed. The green dot emits an expanding ring.
```css
@keyframes bn-live-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0,210,106,.55); }
  70%  { box-shadow: 0 0 0 6px rgba(0,210,106,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,210,106,0); }
}
```
`1.4s var(--ease-standard) infinite`. Used by `Badge variant="live"`. One pulse per surface — don't stack.

### 3. Entrada de fila nueva en el checking log (pitch climax)
Every new checking event flashes in at the top of the log so the operator *sees* it happen.
```css
@keyframes bn-row-enter {
  0%   { background: var(--state-selected); transform: translateY(-4px); opacity: 0; }
  100% { background: transparent;           transform: translateY(0);    opacity: 1; }
}
```
`0.7s var(--ease-standard)`. Built into `TableRow entering`. New rows prepend; the list clips overflow so old rows fall away.

### 4. Transición del bottom sheet
Snap between collapsed / half / expanded with a slight overshoot for a physical feel.
- `transition: height var(--dur-sheet) var(--ease-spring);`
- Backdrop scrim (if used) fades `--dur-base var(--ease-standard)`.
- On drag, follow the finger 1:1; on release, snap to the nearest state.

### 5. Trazado progresivo de la ruta al seleccionarla
When a trip/route is chosen, the polyline draws from origin to destination instead of appearing at once.
```css
path { stroke-dasharray: <len>; stroke-dashoffset: <len>; animation: bn-draw .9s var(--ease-emphasized) forwards; }
@keyframes bn-draw { to { stroke-dashoffset: 0; } }
```
Pair with a camera `fly-to`/`fitBounds` easing over ~600 ms. The splash screen (`guidelines/splash.html`) demonstrates the draw.

### 6. Press & entrance (global)
- **Buttons / cards press:** `transform: scale(.97–.99)` over `--dur-fast`. No color-only feedback — scale reads in sunlight.
- **Sheet content entrance:** stagger children `translateY(14px)→0` + fade, `--dur-slow var(--ease-emphasized)`, 60–80 ms apart.
- **Marker select:** pop to `scale(1.18)` with `--ease-spring`, add white ring + glow.

### Reduced motion
Wrap non-essential keyframes in `@media (prefers-reduced-motion: no-preference)`. The live pulse, row-flash, and bus tween may stay (they convey data) but should shorten; purely decorative entrances should drop to a plain fade or none.
