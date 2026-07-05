/* global React */
// BusNET Live tracking — buses moving on the map (animated), a selected bus
// with a Premium "llega en 6 min" sheet. This is the "wow" screen.

function LiveTrackingScreen({ onBack }) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { BottomSheet, Badge, Button, Icon, BusMarker } = DS;
  const R = window.BN_ROUTES;
  const routes = [{ ...R.r30b, active: true }, { ...R.r7d, active: false }, { ...R.r42, active: false }, { ...R.r12, active: false }];

  // waypoint tracks for the animated buses
  const tracks = React.useMemo(() => ({
    b1: [[150, 360], [175, 300], [140, 250], [110, 320], [150, 360]],
    b2: [[300, 460], [260, 500], [210, 520], [250, 470], [300, 460]],
    b3: [[300, 330], [240, 350], [180, 360], [120, 300], [300, 330]],
    b4: [[280, 560], [200, 540], [120, 470], [200, 540], [280, 560]],
  }), []);

  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 2400);
    return () => clearInterval(id);
  }, []);

  const bearing = (track, i) => {
    const a = track[i % track.length], b = track[(i + 1) % track.length];
    return (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180) / Math.PI;
  };
  const pos = (track, i) => track[i % track.length];

  const buses = [
    { id: "b1", route: "30B", color: "var(--route-1)", state: "selected" },
    { id: "b2", route: "7D", color: "var(--route-6)", state: "moving" },
    { id: "b3", route: "42", color: "var(--route-4)", state: "moving" },
    { id: "b4", route: "12", color: "var(--route-5)", state: "stopped" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <window.MapCanvas routes={routes} dim>
        {buses.map((b) => {
          const p = pos(tracks[b.id], step);
          return (
            <div key={b.id} style={{ position: "absolute", left: p[0], top: p[1], transform: "translate(-50%,-50%)", transition: "left 2.3s linear, top 2.3s linear", zIndex: b.state === "selected" ? 6 : 2 }}>
              <BusMarker route={b.route} color={b.color} bearing={bearing(tracks[b.id], step)} state={b.state} size={b.state === "selected" ? 42 : 36} />
            </div>
          );
        })}
      </window.MapCanvas>

      <div style={{ position: "relative", zIndex: 20, background: "var(--scrim-top)", paddingBottom: 18 }}>
        <window.StatusBar />
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="chevron-right" size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <Badge variant="live">En vivo</Badge>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <BottomSheet snap="half" showHandle heights={{ collapsed: 110, half: 340, expanded: 480 }}
        header={<div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", height: 30, padding: "0 12px", borderRadius: "var(--radius-pill)", background: "var(--route-1)", color: "#08130D", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800 }}>30B</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Ruta 30B</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)" }}>Metrocentro → Centro</div>
          </div>
          <Badge variant="premium">Premium</Badge>
        </div>}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "6px 0 4px" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-secondary)" }}>Llega a tu parada en</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, color: "var(--amber)", lineHeight: 1, letterSpacing: "-0.02em" }}>6</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>min</span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, color: "var(--text-tertiary)", fontSize: 12 }}>
              <Icon name="crosshair" size={13} /> Actualizado hace 2 s
            </span>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Metrocentro", "2 paradas antes"], ["Parque Cuscatlán", "1 parada antes"], ["Tu parada · Hospital Bloom", "6 min"]].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: i === arr.length - 1 ? "var(--amber)" : "var(--surface-raised)", border: `2px solid ${i === arr.length - 1 ? "var(--amber)" : "var(--hairline-strong)"}`, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: i === arr.length - 1 ? 700 : 500, color: i === arr.length - 1 ? "var(--text-primary)" : "var(--text-secondary)" }}>{s[0]}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-tertiary)" }}>{s[1]}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <Button variant="secondary" size="md" iconLeft="bell" fullWidth>Avísame cuando esté a 2 paradas</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
window.LiveTrackingScreen = LiveTrackingScreen;
