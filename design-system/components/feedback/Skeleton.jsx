import React from "react";

/**
 * BusNET skeleton placeholder. Shimmering block used while trip options,
 * bus lists, or dashboard rows load. Compose several to mimic layout.
 */
export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-md)", style = {}, ...rest }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--surface-raised) 0%, #26324a 50%, var(--surface-raised) 100%)",
        backgroundSize: "200% 100%",
        animation: "bn-shimmer 1.3s ease-in-out infinite",
        ...style,
      }}
      {...rest}
    >
      <style>{`@keyframes bn-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </span>
  );
}
