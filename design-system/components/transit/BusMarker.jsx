import React from "react";

/**
 * BusNET map marker — a bus tagged with its route number, colored by route.
 * The route NUMBER stays upright and legible at map scale (~32–40px); a
 * directional nub rotates to the `bearing` so the marker points where the
 * bus is heading.
 *
 * state:
 *   "moving"   — default, full color
 *   "stopped"  — dimmed with a pause tick (at a stop / red light)
 *   "selected" — enlarged, white ring + glow, elevated above others
 */
export function BusMarker({
  route = "30",
  color = "var(--route-1)",
  bearing = 0,
  state = "moving",
  size = 40,
  onClick,
  style = {},
  ...rest
}) {
  const selected = state === "selected";
  const stopped = state === "stopped";
  const scale = selected ? 1.18 : 1;
  const badgeH = size;
  const fontSize = Math.round(size * 0.44);

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{
        position: "relative",
        width: badgeH,
        height: badgeH,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        transition: "transform var(--dur-base) var(--ease-spring)",
        cursor: onClick ? "pointer" : "default",
        filter: stopped ? "saturate(0.55)" : "none",
        zIndex: selected ? 5 : 1,
        ...style,
      }}
      {...rest}
    >
      {/* Direction nub — rotates with bearing around the badge center */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `rotate(${bearing}deg)`,
        transition: "transform var(--dur-slow) var(--ease-standard)",
        pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: -6, left: "50%", marginLeft: -6,
          width: 0, height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `9px solid ${color}`,
        }} />
      </div>

      {/* Route badge */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "50%",
        background: color,
        color: "#08130D",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-extrabold)",
        fontSize,
        letterSpacing: "-0.02em",
        border: selected ? "3px solid #fff" : "2px solid rgba(8,19,13,0.35)",
        boxShadow: selected ? "0 6px 16px rgba(0,0,0,0.5), 0 0 0 6px rgba(255,255,255,0.14)" : "var(--shadow-marker)",
      }}>
        {route}
      </div>

      {/* Stopped indicator */}
      {stopped && (
        <div style={{
          position: "absolute", bottom: -3, right: -3,
          width: 14, height: 14, borderRadius: "50%",
          background: "var(--surface)", border: "2px solid var(--text-tertiary)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5,
        }}>
          <span style={{ width: 2, height: 5, background: "var(--text-secondary)", borderRadius: 1 }} />
          <span style={{ width: 2, height: 5, background: "var(--text-secondary)", borderRadius: 1 }} />
        </div>
      )}
    </div>
  );
}
