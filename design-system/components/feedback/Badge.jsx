import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET badge. Variants:
 *  - "route"   : route-number pill colored by route (pass `color`)
 *  - "premium" : amber "Premium" chip with lock/star
 *  - "live"    : pulsing "EN VIVO" chip
 *  - "success" / "warning" / "danger" / "neutral" : semantic status chips
 */
export function Badge({
  children,
  variant = "neutral",
  color,
  icon,
  size = "md",
  style = {},
  ...rest
}) {
  const sm = size === "sm";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: sm ? 4 : 6,
    height: sm ? 20 : 26,
    padding: sm ? "0 8px" : "0 10px",
    borderRadius: "var(--radius-pill)",
    fontFamily: "var(--font-ui)",
    fontSize: sm ? "var(--text-xs)" : "var(--text-sm)",
    fontWeight: "var(--weight-bold)",
    lineHeight: 1,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  };

  if (variant === "route") {
    const c = color || "var(--route-1)";
    return (
      <span style={{ ...base, background: c, color: "#08130D", fontWeight: "var(--weight-extrabold)", fontSize: sm ? "var(--text-sm)" : "var(--text-body)", letterSpacing: "0.01em", ...style }} {...rest}>
        {children}
      </span>
    );
  }

  if (variant === "premium") {
    return (
      <span style={{ ...base, background: "var(--amber)", color: "var(--text-on-amber)", boxShadow: "var(--glow-premium)", ...style }} {...rest}>
        <Icon name={icon || "star"} size={sm ? 11 : 13} strokeWidth={2.5} />
        {children || "Premium"}
      </span>
    );
  }

  if (variant === "live") {
    return (
      <span className="bn-badge-live" style={{ ...base, background: "rgba(0,210,106,0.16)", color: "var(--busnet-green)", textTransform: "uppercase", ...style }} {...rest}>
        <span style={{ width: sm ? 6 : 7, height: sm ? 6 : 7, borderRadius: "50%", background: "var(--busnet-green)", animation: "bn-live-pulse 1.4s var(--ease-standard) infinite" }} />
        {children || "En vivo"}
        <style>{`@keyframes bn-live-pulse{0%{box-shadow:0 0 0 0 rgba(0,210,106,0.55)}70%{box-shadow:0 0 0 6px rgba(0,210,106,0)}100%{box-shadow:0 0 0 0 rgba(0,210,106,0)}}`}</style>
      </span>
    );
  }

  const semantic = {
    success: { background: "rgba(0,210,106,0.16)", color: "var(--busnet-green)" },
    warning: { background: "rgba(255,176,32,0.16)", color: "var(--amber)" },
    danger: { background: "rgba(255,77,77,0.16)", color: "var(--red)" },
    neutral: { background: "var(--surface-raised)", color: "var(--text-secondary)" },
  }[variant] || {};

  return (
    <span style={{ ...base, ...semantic, ...style }} {...rest}>
      {icon && <Icon name={icon} size={sm ? 11 : 13} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
