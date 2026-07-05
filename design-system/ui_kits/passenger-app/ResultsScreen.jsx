/* global React */
// BusNET Results — destination set, sheet with 3 trip alternatives by time.

function ResultsScreen({ onSelect, onBack }) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { BottomSheet, TripCard, Icon, MapPin } = DS;
  const R = window.BN_ROUTES;
  const routes = [
    { ...R.r30b, active: true }, { ...R.r7d, active: true },
    { ...R.r42, active: false }, { ...R.r101, active: false }, { ...R.r12, active: false },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <window.MapCanvas routes={routes} dim>
        <div style={{ position: "absolute", left: 40, top: 150, transform: "translate(-50%,-100%)" }}>
          <MapPin variant="origin" label="Tú" size={38} />
        </div>
        <div style={{ position: "absolute", left: 340, top: 240, transform: "translate(-50%,-100%)" }}>
          <MapPin variant="destination" label="Hospital Bloom" size={40} />
        </div>
      </window.MapCanvas>

      <div style={{ position: "relative", zIndex: 20, background: "var(--scrim-top)", paddingBottom: 16 }}>
        <window.StatusBar />
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="chevron-right" size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <div style={{ flex: 1, height: 48, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
            <Icon name="flag" size={18} style={{ color: "var(--amber)" }} />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Hospital Bloom</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <BottomSheet snap="expanded" showHandle heights={{ collapsed: 120, half: 380, expanded: 560 }}
        header={<div style={{ paddingBottom: 6 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>3 rutas hacia Hospital Bloom</h2>
          <div style={{ marginTop: 3, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)" }}>Ordenadas por tiempo total</div>
        </div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TripCard recommended totalMinutes={42} fare="$0.50" departLabel="Sale en 3 min · cada 12 min" onClick={onSelect}
            legs={[{ type: "walk", minutes: 4 }, { type: "bus", route: "30B", color: "var(--route-1)" }, { type: "bus", route: "7D", color: "var(--route-6)" }]} />
          <TripCard totalMinutes={48} fare="$0.35" departLabel="Sale en 6 min" onClick={onSelect}
            legs={[{ type: "walk", minutes: 7 }, { type: "bus", route: "42", color: "var(--route-4)" }]} />
          <TripCard totalMinutes={55} fare="$0.50" departLabel="Cada ~15 min" onClick={onSelect}
            legs={[{ type: "walk", minutes: 3 }, { type: "bus", route: "101", color: "var(--route-3)" }, { type: "bus", route: "12", color: "var(--route-5)" }]} />
        </div>
      </BottomSheet>
    </div>
  );
}
window.ResultsScreen = ResultsScreen;
