/* global React */
// BusNET Home — dark map, prominent search, faded routes, recent destinations.

function HomeScreen({ onSearch }) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { SearchInput, BottomSheet, Icon, MapPin } = DS;
  const R = window.BN_ROUTES;
  const routes = [
    { ...R.r30b, active: false }, { ...R.r7d, active: false },
    { ...R.r42, active: false }, { ...R.r101, active: false }, { ...R.r12, active: false },
  ];

  const recents = [
    { icon: "map-pin", title: "Casa", sub: "Col. Escalón, San Salvador" },
    { icon: "map-pin", title: "Trabajo", sub: "Santa Elena, Antiguo Cuscatlán" },
    { icon: "clock", title: "Hospital Bloom", sub: "Búsqueda reciente" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <window.MapCanvas routes={routes} dim>
        {/* origin pin */}
        <div style={{ position: "absolute", left: 150, top: 358, transform: "translate(-50%,-100%)" }}>
          <MapPin variant="origin" label="Tú" size={40} />
        </div>
      </window.MapCanvas>

      {/* top scrim + header + search */}
      <div style={{ position: "relative", zIndex: 20, background: "var(--scrim-top)", paddingBottom: 24 }}>
        <window.StatusBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="../../assets/logo/busnet-badge.svg" style={{ width: 30, borderRadius: 9 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Bus<span style={{ color: "var(--busnet-green)" }}>NET</span></span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-raised)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <Icon name="user" size={18} />
          </div>
        </div>
        <div style={{ padding: "0 16px" }}>
          <div onClick={onSearch} style={{ cursor: "pointer" }}>
            <SearchInput placeholder="¿A dónde vas?" trailingIcon="crosshair" readOnly />
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <BottomSheet snap="half" showHandle heights={{ collapsed: 96, half: 300, expanded: 560 }}
        header={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 6 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>Destinos recientes</h2>
          <span style={{ color: "var(--busnet-green)", fontSize: 13, fontWeight: 700 }}>Editar</span>
        </div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {recents.map((r, i) => (
            <div key={i} onClick={onSearch} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 4px", cursor: "pointer", borderBottom: i < recents.length - 1 ? "1px solid var(--hairline)" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0 }}>
                <Icon name={r.icon} size={19} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{r.title}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</div>
              </div>
              <Icon name="chevron-right" size={18} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
window.HomeScreen = HomeScreen;
