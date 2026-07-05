import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET step-by-step item (Moovit-style turn-by-turn). Renders one leg of
 * the plan on a vertical timeline: an icon node on a connector line, a
 * human instruction, and optional detail (route badge, distance, frequency).
 *
 * type: "walk" | "bus" | "transfer" | "origin" | "destination"
 */
export function StepItem({
  type = "walk",
  title,
  detail,
  route,
  routeColor = "var(--route-1)",
  duration,
  active = false,
  last = false,
  style = {},
  ...rest
}) {
  const nodes = {
    origin: { icon: "user", color: "var(--busnet-green)", bg: "var(--busnet-green)", fg: "#08130D" },
    walk: { icon: "footprints", color: "var(--text-secondary)", bg: "var(--surface-raised)", fg: "var(--text-secondary)" },
    bus: { icon: "bus", color: routeColor, bg: routeColor, fg: "#08130D" },
    transfer: { icon: "repeat", color: "var(--amber)", bg: "var(--surface-raised)", fg: "var(--amber)" },
    destination: { icon: "flag", color: "var(--amber)", bg: "var(--amber)", fg: "var(--text-on-amber)" },
  }[type] || {};

  return (
    <div style={{ display: "flex", gap: 14, ...style }} {...rest}>
      {/* Timeline column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: nodes.bg, color: nodes.fg,
          border: active ? "2px solid #fff" : "none",
          boxShadow: active ? "var(--glow-green)" : "none",
          flexShrink: 0,
        }}>
          <Icon name={nodes.icon} size={18} strokeWidth={2.3} />
        </div>
        {!last && (
          <div style={{
            flex: 1, width: 2.5, minHeight: 20, marginTop: 4,
            borderRadius: 2,
            background: type === "walk" || type === "transfer"
              ? "repeating-linear-gradient(var(--hairline-strong) 0 5px, transparent 5px 10px)"
              : nodes.color,
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: last ? 0 : 20, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {route && (
            <span style={{
              display: "inline-flex", alignItems: "center", height: 24, padding: "0 9px",
              borderRadius: "var(--radius-pill)", background: routeColor, color: "#08130D",
              fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-extrabold)",
            }}>{route}</span>
          )}
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-body-lg)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)", lineHeight: "var(--lh-snug)" }}>{title}</span>
        </div>
        {detail && (
          <div style={{ marginTop: 4, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--lh-normal)" }}>{detail}</div>
        )}
        {duration && (
          <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, color: "var(--text-tertiary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>
            <Icon name="clock" size={13} /> {duration}
          </div>
        )}
      </div>
    </div>
  );
}
