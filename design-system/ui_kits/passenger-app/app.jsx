/* global React */
// Wires the four passenger screens into a click-through prototype.

function PassengerApp() {
  const [screen, setScreen] = React.useState("home");
  const screens = {
    home: <window.HomeScreen onSearch={() => setScreen("results")} />,
    results: <window.ResultsScreen onSelect={() => setScreen("active")} onBack={() => setScreen("home")} />,
    active: <window.ActiveTripScreen onBack={() => setScreen("results")} />,
    live: <window.LiveTrackingScreen onBack={() => setScreen("home")} />,
  };
  const tabs = [
    ["home", "Home", "Mapa + búsqueda"],
    ["results", "Resultados", "3 alternativas"],
    ["active", "Viaje activo", "Paso a paso + voz"],
    ["live", "Tracking en vivo", "Buses + Premium"],
  ];

  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start", justifyContent: "center", padding: "36px 24px" }}>
      {/* switcher rail */}
      <div style={{ width: 260, paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <img src="../../assets/logo/busnet-badge.svg" style={{ width: 34, borderRadius: 10 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Bus<span style={{ color: "var(--busnet-green)" }}>NET</span></div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)" }}>App de pasajero</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tabs.map(([id, label, sub]) => {
            const on = screen === id;
            return (
              <button key={id} onClick={() => setScreen(id)} style={{
                textAlign: "left", padding: "12px 14px", borderRadius: "var(--radius-md)", cursor: "pointer",
                background: on ? "var(--state-selected)" : "var(--surface)",
                border: `1px solid ${on ? "var(--busnet-green)" : "var(--hairline)"}`,
              }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 700, color: on ? "var(--busnet-green)" : "var(--text-primary)" }}>{label}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{sub}</div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 18, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
          Toca la búsqueda en Home para seguir el flujo hasta el viaje activo.
        </div>
      </div>

      {/* phone frame */}
      <div style={{
        position: "relative", width: 375, height: 760, borderRadius: 44,
        background: "#000", padding: 6, boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 2px #1c2740",
        flexShrink: 0,
      }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 38, overflow: "hidden", background: "var(--night)" }}>
          {screens[screen]}
          {/* home indicator */}
          <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.5)", zIndex: 40 }} />
        </div>
      </div>
    </div>
  );
}
window.PassengerApp = PassengerApp;
