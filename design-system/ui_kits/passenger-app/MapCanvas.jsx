/* global React */
// Faux dark "night map" for BusNET mockups — a stylized street network
// on the #0B1220 canvas with painted bus-route polylines. Not a real map
// engine (MapLibre in production); this reproduces the look for the kit.
// Children render absolutely over the map (markers, pins).

const STREETS = [
  // long avenues (diagonals)
  "M-20,120 L420,300", "M-20,470 L420,250", "M60,-20 L260,760",
  // grid-ish arterials with slight jitter
  "M-20,80 L420,90", "M-20,210 L420,225", "M-20,340 L420,330",
  "M-20,470 L420,485", "M-20,600 L420,590",
  "M70,-20 L60,760", "M170,-20 L185,760", "M280,-20 L270,760", "M360,-20 L370,760",
];

function MapCanvas({ routes = [], children, style = {}, dim = false, width = 375, height = 720 }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background:
      "radial-gradient(120% 90% at 70% 12%, #14203a 0%, #0B1220 62%)", ...style }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}>
        {/* park / green space */}
        <path d="M200,360 q40,-40 90,-20 q30,40 -10,90 q-60,30 -90,-10 z" fill="#12261d" opacity="0.7" />
        {/* river */}
        <path d="M-20,540 C80,520 120,600 220,560 S360,520 420,560 L420,760 L-20,760 Z" fill="#0e1a2e" opacity="0.9" />
        <path d="M-20,540 C80,520 120,600 220,560 S360,520 420,560" fill="none" stroke="#16324e" strokeWidth="6" opacity="0.6" />
        {/* street network */}
        {STREETS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1c2740" strokeWidth={i < 3 ? 7 : 3.5} strokeLinecap="round" />
        ))}
        {/* painted routes */}
        {routes.map((r, i) => (
          <g key={i} opacity={dim && !r.active ? 0.28 : 1}>
            <path d={r.d} fill="none" stroke={r.color} strokeWidth={r.active ? 6 : 4}
              strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: r.active ? "drop-shadow(0 0 6px " + r.color + ")" : "none" }} />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}

window.MapCanvas = MapCanvas;
