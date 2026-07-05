import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET map pin (teardrop). variant:
 *   "origin"      — your location (person), green
 *   "destination" — destination flag, amber
 *   "stop"        — Smart Stop, night surface with green ring
 * Optional `label` renders a small caption chip above the pin.
 */
export function MapPin({ variant = "destination", label, size = 44, style = {}, ...rest }) {
  const config = {
    origin: { bg: "var(--busnet-green)", fg: "#08130D", icon: "user", ring: "rgba(0,210,106,0.28)" },
    destination: { bg: "var(--amber)", fg: "var(--text-on-amber)", icon: "flag", ring: "rgba(255,176,32,0.28)" },
    stop: { bg: "var(--surface-raised)", fg: "var(--busnet-green)", icon: "circle-dot", ring: "rgba(0,210,106,0.22)" },
  }[variant] || {};
  const iconSize = Math.round(size * 0.42);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, ...style }} {...rest}>
      {label && (
        <span style={{
          padding: "3px 9px", borderRadius: "var(--radius-pill)",
          background: "var(--surface)", border: "1px solid var(--hairline)",
          color: "var(--text-primary)", fontFamily: "var(--font-ui)",
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)",
          whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)",
        }}>{label}</span>
      )}
      <div style={{ position: "relative", width: size, height: size * 1.28 }}>
        {/* teardrop */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: size, height: size,
          background: config.bg,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(45deg)",
          boxShadow: `var(--shadow-marker), 0 0 0 4px ${config.ring}`,
          border: variant === "stop" ? "2px solid var(--busnet-green)" : "2px solid rgba(8,19,13,0.25)",
        }} />
        {/* icon (upright) */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: size, height: size,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: config.fg,
        }}>
          <Icon name={config.icon} size={iconSize} strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}
