import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET toast / inline alert. tone: info | success | warning | danger.
 * Use for transient confirmations, arrival alerts, service notices.
 */
export function Toast({
  title,
  message,
  tone = "info",
  icon,
  action,
  onClose,
  style = {},
  ...rest
}) {
  const tones = {
    info: { accent: "var(--info)", icon: "bell" },
    success: { accent: "var(--busnet-green)", icon: "check-check" },
    warning: { accent: "var(--amber)", icon: "triangle-alert" },
    danger: { accent: "var(--red)", icon: "triangle-alert" },
  };
  const t = tones[tone] || tones.info;

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        width: "100%",
        padding: "14px 14px 14px 14px",
        background: "var(--surface-raised)",
        border: "1px solid var(--hairline)",
        borderLeft: `3px solid ${t.accent}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        ...style,
      }}
      {...rest}
    >
      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 32, height: 32, borderRadius: "var(--radius-pill)", flexShrink: 0,
        background: "color-mix(in srgb, " + t.accent + " 18%, transparent)",
        color: t.accent,
      }}>
        <Icon name={icon || t.icon} size={18} strokeWidth={2.2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-body)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)", marginBottom: message ? 2 : 0 }}>{title}</div>}
        {message && <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", lineHeight: "var(--lh-normal)", color: "var(--text-secondary)" }}>{message}</div>}
        {action && <div style={{ marginTop: 10 }}>{action}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Cerrar" style={{
          border: "none", background: "transparent", color: "var(--text-tertiary)",
          cursor: "pointer", padding: 2, lineHeight: 0, flexShrink: 0,
        }}>
          <Icon name="x" size={18} />
        </button>
      )}
    </div>
  );
}
