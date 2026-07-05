import React from "react";

/**
 * BusNET spinner. Circular indeterminate loader in brand green (default).
 * Sizes in px via `size`; `tone` picks the stroke color.
 */
export function Spinner({ size = 24, tone = "green", strokeWidth = 3, style = {}, ...rest }) {
  const tones = {
    green: "var(--busnet-green)",
    white: "var(--text-primary)",
    amber: "var(--amber)",
    muted: "var(--text-secondary)",
  };
  return (
    <span
      role="progressbar"
      aria-label="Cargando"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${strokeWidth}px solid var(--hairline-strong)`,
        borderTopColor: tones[tone] || tones.green,
        animation: "bn-spinner 0.7s linear infinite",
        ...style,
      }}
      {...rest}
    >
      <style>{`@keyframes bn-spinner{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}
