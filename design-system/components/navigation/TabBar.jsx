import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET bottom tab bar. Fixed to the bottom of the mobile viewport.
 * Items: [{ id, label, icon }]. Active item is green with a filled feel.
 */
export function TabBar({ items = [], activeId, onChange, style = {}, ...rest }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "var(--tabbar-height)",
        background: "var(--surface)",
        borderTop: "1px solid var(--hairline)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange && onChange(item.id)}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minHeight: "var(--touch-min)",
              border: "none",
              background: "transparent",
              color: active ? "var(--busnet-green)" : "var(--text-tertiary)",
              cursor: "pointer",
              transition: "color var(--dur-fast) var(--ease-standard)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Icon name={item.icon} size={24} strokeWidth={active ? 2.4 : 2} />
            <span style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-xs)",
              fontWeight: active ? "var(--weight-bold)" : "var(--weight-medium)",
              letterSpacing: "0.01em",
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
