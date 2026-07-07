import React from "react";

/**
 * BusNET bottom sheet. Three snap states: "collapsed" | "half" | "expanded".
 * Rounded 24px top corners, grabber handle, soft upward shadow. Meant to
 * float over the map. Controlled via `snap` + `onSnapChange`, or left
 * uncontrolled (drag the handle to cycle states).
 *
 * This is a presentational sheet — height is driven by `snap`. The handle
 * cycles collapsed → half → expanded → half on tap for demo/prototyping.
 */
export function BottomSheet({
  snap = "half",
  onSnapChange,
  heights = { collapsed: 96, half: 360, expanded: 620 },
  header,
  children,
  showHandle = true,
  style = {},
  ...rest
}) {
  const h = heights[snap] ?? heights.half;

  const cycle = () => {
    if (!onSnapChange) return;
    const order = ["collapsed", "half", "expanded"];
    const i = order.indexOf(snap);
    onSnapChange(order[(i + 1) % order.length]);
  };

  return (
    <section
      className="bn-sheet"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: h,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        borderTopLeftRadius: "var(--radius-sheet)",
        borderTopRightRadius: "var(--radius-sheet)",
        boxShadow: "var(--shadow-sheet)",
        borderTop: "1px solid var(--hairline)",
        transition: "height var(--dur-sheet) var(--ease-spring)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {showHandle && (
        <button
          type="button"
          onClick={cycle}
          aria-label="Ajustar panel"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 26, border: "none", background: "transparent", cursor: "pointer",
            flexShrink: 0, paddingTop: 8,
          }}
        >
          <span style={{ width: "var(--sheet-handle)", height: 5, borderRadius: 999, background: "var(--hairline-strong)" }} />
        </button>
      )}
      {header && <div style={{ padding: "4px 20px 0", flexShrink: 0 }}>{header}</div>}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 20px 20px", WebkitOverflowScrolling: "touch" }}>
        {children}
      </div>
    </section>
  );
}
