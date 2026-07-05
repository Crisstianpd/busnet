import React from "react";
import { Icon } from "../foundations/Icon.jsx";

/**
 * BusNET search input — the prominent "¿A dónde vas?" destination field.
 * Big, high-contrast, glass-friendly. Leading search icon, optional
 * clear button, optional voice/mic affordance. Focus ring is green.
 */
export function SearchInput({
  value = "",
  onChange,
  onClear,
  placeholder = "¿A dónde vas?",
  leadingIcon = "search",
  trailingIcon,
  size = "lg",
  autoFocus = false,
  style = {},
  ...rest
}) {
  const heights = { md: 48, lg: 56 };
  const h = heights[size] || 56;
  const showClear = value && onClear;

  return (
    <div
      className="bn-search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: h,
        padding: "0 16px",
        background: "var(--surface-raised)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
        ...style,
      }}
    >
      <Icon name={leadingIcon} size={22} style={{ color: "var(--busnet-green)", flexShrink: 0 }} />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--text-primary)",
          fontFamily: "var(--font-ui)",
          fontSize: size === "lg" ? "var(--text-body-lg)" : "var(--text-body)",
          fontWeight: "var(--weight-semibold)",
          letterSpacing: "0.005em",
        }}
        onFocus={(e) => {
          const box = e.currentTarget.closest(".bn-search");
          if (box) { box.style.borderColor = "var(--busnet-green)"; box.style.boxShadow = "var(--glow-green)"; }
        }}
        onBlur={(e) => {
          const box = e.currentTarget.closest(".bn-search");
          if (box) { box.style.borderColor = "var(--hairline-strong)"; box.style.boxShadow = "none"; }
        }}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "var(--radius-pill)",
            border: "none", background: "var(--surface)", color: "var(--text-secondary)",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <Icon name="x" size={16} />
        </button>
      ) : trailingIcon ? (
        <Icon name={trailingIcon} size={20} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
      ) : null}
      <style>{`.bn-search input::placeholder{color:var(--text-tertiary);font-weight:var(--weight-medium)}
        .bn-search input::-webkit-search-cancel-button{display:none}`}</style>
    </div>
  );
}
