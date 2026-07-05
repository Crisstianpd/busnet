import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET KPI card for the Fleet dashboard. Big number, label, optional
 * delta trend and icon. tone tints the icon chip + delta.
 */
export function KpiCard({
  label,
  value,
  unit,
  icon,
  delta,
  deltaDirection = "up",
  tone = "green",
  style = {},
  ...rest
}) {
  const tones = {
    green: "var(--busnet-green)",
    amber: "var(--amber)",
    info: "var(--info)",
    red: "var(--red)",
    neutral: "var(--text-secondary)",
  };
  const c = tones[tone] || tones.green;
  const deltaGood = deltaDirection === "up";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 20,
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-secondary)", letterSpacing: "0.01em" }}>{label}</span>
        {icon && (
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 34, height: 34, borderRadius: "var(--radius-md)",
            background: "color-mix(in srgb, " + c + " 16%, transparent)", color: c,
          }}>
            <Icon name={icon} size={18} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: "var(--weight-extrabold)", color: "var(--text-primary)", lineHeight: 1, letterSpacing: "var(--tracking-tight)" }}>{value}</span>
        {unit && <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-secondary)" }}>{unit}</span>}
      </div>
      {delta != null && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: deltaGood ? "var(--busnet-green)" : "var(--red)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}>
          <Icon name={deltaGood ? "chevron-up" : "chevron-down"} size={15} strokeWidth={2.6} />
          <span>{delta}</span>
          <span style={{ color: "var(--text-tertiary)", fontWeight: "var(--weight-medium)" }}>vs. ayer</span>
        </div>
      )}
    </div>
  );
}
