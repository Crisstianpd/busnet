import React from "react";

/**
 * BusNET table row for the Fleet dashboard (live units, checking log).
 * Renders `cells` across a grid defined by `columns` (CSS grid-template).
 * Set `head` for the header row. Rows support hover, `selected`, `onClick`,
 * and `entering` (highlight flash for a freshly-arrived checking-log row).
 */
export function TableRow({
  cells = [],
  columns = "1fr",
  head = false,
  selected = false,
  entering = false,
  onClick,
  style = {},
  ...rest
}) {
  if (head) {
    return (
      <div
        role="row"
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          alignItems: "center",
          gap: 16,
          padding: "10px 18px",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-bold)",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          borderBottom: "1px solid var(--hairline)",
          ...style,
        }}
        {...rest}
      >
        {cells.map((c, i) => <div key={i}>{c}</div>)}
      </div>
    );
  }

  return (
    <div
      role="row"
      onClick={onClick}
      className="bn-trow"
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-body)",
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--hairline)",
        background: selected ? "var(--state-selected)" : "transparent",
        cursor: onClick ? "pointer" : "default",
        animation: entering ? "bn-row-enter 0.7s var(--ease-standard)" : "none",
        transition: "background var(--dur-fast) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    >
      {cells.map((c, i) => <div key={i} style={{ minWidth: 0 }}>{c}</div>)}
      <style>{`.bn-trow:hover{background:var(--state-hover)}
        @keyframes bn-row-enter{0%{background:var(--state-selected);transform:translateY(-4px);opacity:0}100%{background:transparent;transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
