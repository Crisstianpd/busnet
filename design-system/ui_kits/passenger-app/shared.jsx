/* global React */
// Shared route polyline data + a status bar, reused across passenger screens.

window.BN_ROUTES = {
  r30b: { color: "var(--route-1)", d: "M40,150 C90,220 60,320 150,360 S250,430 210,520" },
  r7d:  { color: "var(--route-6)", d: "M210,520 C260,470 330,500 350,430 S300,300 340,240" },
  r42:  { color: "var(--route-4)", d: "M20,300 C120,280 180,360 300,330 S360,250 380,200" },
  r101: { color: "var(--route-3)", d: "M70,60 C120,160 220,140 260,240 S220,420 300,480" },
  r12:  { color: "var(--route-5)", d: "M10,440 C120,420 160,520 280,560" },
};

function StatusBar({ dark = false }) {
  const c = dark ? "var(--text-primary)" : "var(--text-primary)";
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 22px", color: c, fontFamily: "var(--font-ui)", flexShrink: 0, position: "relative", zIndex: 30 }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 700 }}>
        <span>5G</span>
        <span style={{ display: "inline-block", width: 22, height: 11, border: "1.5px solid currentColor", borderRadius: 3, position: "relative" }}>
          <span style={{ position: "absolute", inset: 1.5, right: 6, background: "currentColor", borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
}
window.StatusBar = StatusBar;
