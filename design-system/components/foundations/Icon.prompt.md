# Icon

BusNET's line-icon primitive — a curated Lucide-geometry set (MIT) covering the transit glyphs the product uses. Inherits `currentColor` and takes `size` / `strokeWidth`. Use it anywhere you need an icon; don't hand-roll SVG.

```jsx
<span style={{ color: "var(--busnet-green)" }}>
  <Icon name="bus" size={20} />
</span>
<Icon name="footprints" size={16} strokeWidth={2.25} />
```

Common names: `search`, `bus`, `footprints` (caminar), `repeat` (transbordo), `clock` (ETA), `dollar-sign` (costo), `volume-2` (voz), `lock` / `star` (premium), `triangle-alert`, `check` / `check-check`, `map-pin`, `navigation`, `crosshair`, `circle-dot` (parada), `zap` (en vivo). Read `ICON_NAMES` for the full list.
