import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET trip-alternative card. Reads in one glance: the leg sequence
 * (bus routes as colored chips, walks as footprint+minutes), then the
 * total time and fare. `recommended` gives the green-bordered hero style.
 *
 * legs: [{ type: "bus", route, color, minutes? } | { type: "walk", minutes }]
 */
export function TripCard({
  legs = [],
  totalMinutes,
  fare,
  departLabel,
  recommended = false,
  selected = false,
  onClick,
  style = {},
  ...rest
}) {
  const transfers = legs.filter((l) => l.type === "bus").length - 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className="bn-tripcard"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: 16,
        background: recommended ? "var(--state-selected)" : "var(--surface-raised)",
        border: `1.5px solid ${recommended || selected ? "var(--busnet-green)" : "var(--hairline)"}`,
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        transition: "transform var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    >
      {recommended && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "var(--busnet-green)", fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-extrabold)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
          <Icon name="navigation" size={13} strokeWidth={2.6} /> Recomendada
        </div>
      )}

      {/* Leg sequence */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
        {legs.map((leg, i) => (
          <React.Fragment key={i}>
            {leg.type === "bus" ? (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                height: 28, padding: "0 10px", borderRadius: "var(--radius-pill)",
                background: leg.color || "var(--route-1)", color: "#08130D",
                fontFamily: "var(--font-display)", fontSize: "var(--text-body)",
                fontWeight: "var(--weight-extrabold)", letterSpacing: "-0.01em",
              }}>
                <Icon name="bus" size={15} strokeWidth={2.4} /> {leg.route}
              </span>
            ) : (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                height: 28, padding: "0 8px", borderRadius: "var(--radius-pill)",
                background: "var(--surface)", color: "var(--text-secondary)",
                fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)",
              }}>
                <Icon name="footprints" size={15} strokeWidth={2.2} /> {leg.minutes}m
              </span>
            )}
            {i < legs.length - 1 && (
              <Icon name="chevron-right" size={15} strokeWidth={2.4} style={{ color: "var(--text-tertiary)" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-extrabold)", color: "var(--text-primary)", lineHeight: 1, letterSpacing: "var(--tracking-tight)" }}>{totalMinutes}</span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-secondary)" }}>min</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--amber)", fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: "var(--weight-bold)" }}>
          {fare}
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, color: "var(--text-tertiary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>
          {transfers > 0 ? (
            <><Icon name="repeat" size={14} strokeWidth={2.2} /> {transfers} transbordo{transfers > 1 ? "s" : ""}</>
          ) : (
            <><Icon name="check" size={14} strokeWidth={2.6} /> Directo</>
          )}
        </span>
      </div>

      {departLabel && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>
          <Icon name="clock" size={14} /> {departLabel}
        </div>
      )}
      <style>{`.bn-tripcard:active{transform:scale(0.99)}.bn-tripcard:hover{border-color:var(--busnet-green-300)}`}</style>
    </button>
  );
}
