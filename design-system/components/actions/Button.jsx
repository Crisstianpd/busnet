import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET button. Large touch targets for on-street use (≥44px, primary 52px).
 * Variants: primary (green), secondary (raised surface), ghost (transparent),
 * danger (emergency/red). Optional leading/trailing icon by name.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  loading = false,
  style = {},
  ...rest
}) {
  const heights = { sm: 40, md: 44, lg: 52 };
  const fontSizes = { sm: "var(--text-sm)", md: "var(--text-body)", lg: "var(--text-body-lg)" };
  const pads = { sm: "0 14px", md: "0 18px", lg: "0 22px" };

  const variants = {
    primary: {
      background: "var(--busnet-green)",
      color: "var(--text-on-green)",
      border: "none",
      boxShadow: "var(--shadow-sm)",
    },
    secondary: {
      background: "var(--surface-raised)",
      color: "var(--text-primary)",
      border: "1px solid var(--hairline-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent",
    },
    danger: {
      background: "var(--red)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--shadow-sm)",
    },
  };

  const iconSize = size === "lg" ? 20 : size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`bn-btn bn-btn--${variant} bn-btn--${size}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: heights[size],
        minHeight: heights[size],
        padding: pads[size],
        width: fullWidth ? "100%" : "auto",
        fontFamily: "var(--font-ui)",
        fontSize: fontSizes[size],
        fontWeight: "var(--weight-bold)",
        lineHeight: 1,
        letterSpacing: "0.01em",
        borderRadius: "var(--radius-md)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "transform var(--dur-fast) var(--ease-standard), filter var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)",
        WebkitTapHighlightColor: "transparent",
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {loading ? (
        <span className="bn-btn__spinner" style={{
          width: iconSize, height: iconSize, borderRadius: "50%",
          border: "2px solid currentColor", borderTopColor: "transparent",
          animation: "bn-spin 0.7s linear infinite", opacity: 0.9,
        }} />
      ) : (
        <>
          {iconLeft && <Icon name={iconLeft} size={iconSize} />}
          {children && <span>{children}</span>}
          {iconRight && <Icon name={iconRight} size={iconSize} />}
        </>
      )}
      <style>{`@keyframes bn-spin{to{transform:rotate(360deg)}}
        .bn-btn--primary:hover:not(:disabled){filter:brightness(1.06)}
        .bn-btn--primary:active:not(:disabled){background:var(--busnet-green-600)!important}
        .bn-btn--secondary:hover:not(:disabled){background:#243349!important}
        .bn-btn--ghost:hover:not(:disabled){background:var(--state-hover)!important}
        .bn-btn--danger:hover:not(:disabled){filter:brightness(1.06)}
        .bn-btn--danger:active:not(:disabled){background:var(--red-600)!important}`}</style>
    </button>
  );
}
