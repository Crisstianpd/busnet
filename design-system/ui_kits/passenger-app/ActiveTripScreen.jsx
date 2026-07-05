/* global React */
// BusNET Active trip — painted route, ETA header, step-by-step, voice button.

function ActiveTripScreen({ onBack }) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { BottomSheet, StepItem, Button, Icon, MapPin, BusMarker } = DS;
  const R = window.BN_ROUTES;
  const routes = [{ ...R.r30b, active: true }, { ...R.r7d, active: true }];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <window.MapCanvas routes={routes} dim>
        <div style={{ position: "absolute", left: 40, top: 150, transform: "translate(-50%,-100%)" }}>
          <MapPin variant="origin" size={34} />
        </div>
        <div style={{ position: "absolute", left: 150, top: 360, transform: "translate(-50%,-50%)" }}>
          <BusMarker route="30B" color="var(--route-1)" bearing={130} state="moving" size={38} />
        </div>
        <div style={{ position: "absolute", left: 340, top: 240, transform: "translate(-50%,-100%)" }}>
          <MapPin variant="destination" label="Bloom" size={38} />
        </div>
      </window.MapCanvas>

      {/* ETA header */}
      <div style={{ position: "relative", zIndex: 20, background: "var(--scrim-top)", paddingBottom: 20 }}>
        <window.StatusBar />
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="x" size={20} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "var(--busnet-green)", lineHeight: 1, letterSpacing: "-0.02em" }}>42</span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>min</span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-secondary)", marginLeft: 4 }}>· $0.50</span>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>Llegada estimada 10:23 · 1 transbordo</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <BottomSheet snap="expanded" showHandle heights={{ collapsed: 130, half: 360, expanded: 540 }}
        header={<div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8 }}>
          <Button variant="primary" size="md" iconLeft="volume-2" style={{ flex: 1 }}>Escuchar instrucciones</Button>
          <button style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="triangle-alert" size={19} style={{ color: "var(--amber)" }} />
          </button>
        </div>}>
        <div style={{ paddingTop: 4 }}>
          <StepItem type="origin" title="Tu ubicación" detail="Col. Escalón" />
          <StepItem type="walk" title="Camina hasta la parada" detail="Metrocentro, sobre Alameda Juan Pablo II" duration="4 min · 450 m" />
          <StepItem type="bus" route="30B" routeColor="var(--route-1)" title="Toma la ruta 30B" detail="Cada ~12 min · 6 paradas" duration="18 min" active />
          <StepItem type="transfer" title="Transbordo a la 7D" detail="Camina 120 m a la siguiente parada" duration="2 min" />
          <StepItem type="bus" route="7D" routeColor="var(--route-6)" title="Toma la ruta 7D" detail="4 paradas" duration="14 min" />
          <StepItem type="destination" title="Hospital Bloom" detail="Sobre 25 Avenida Norte" last />
        </div>
      </BottomSheet>
    </div>
  );
}
window.ActiveTripScreen = ActiveTripScreen;
