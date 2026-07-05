/* @ds-bundle: {"format":4,"namespace":"BusNETDesignSystem_abb9a1","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"TableRow","sourcePath":"components/data/TableRow.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Icon","sourcePath":"components/foundations/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/foundations/Icon.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"BottomSheet","sourcePath":"components/surfaces/BottomSheet.jsx"},{"name":"KpiCard","sourcePath":"components/surfaces/KpiCard.jsx"},{"name":"BusMarker","sourcePath":"components/transit/BusMarker.jsx"},{"name":"MapPin","sourcePath":"components/transit/MapPin.jsx"},{"name":"StepItem","sourcePath":"components/transit/StepItem.jsx"},{"name":"TripCard","sourcePath":"components/transit/TripCard.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"cab82c9eddce","components/data/TableRow.jsx":"4e0e5b1bb50a","components/feedback/Badge.jsx":"150d117edef2","components/feedback/Skeleton.jsx":"200af5596f3c","components/feedback/Spinner.jsx":"2241fbb3c2b1","components/feedback/Toast.jsx":"059faefdd3ed","components/forms/SearchInput.jsx":"20ffcfd04d75","components/foundations/Icon.jsx":"dbefd215dfae","components/navigation/TabBar.jsx":"c8e4fb8eea5a","components/surfaces/BottomSheet.jsx":"65bd5f35d843","components/surfaces/KpiCard.jsx":"58906dc3ee8e","components/transit/BusMarker.jsx":"7d1a75bc75d2","components/transit/MapPin.jsx":"c0e345db32d8","components/transit/StepItem.jsx":"e3319c328abd","components/transit/TripCard.jsx":"cefd392a0f8f","ui_kits/fleet-dashboard/Dashboard.jsx":"4b59d5d2ddaf","ui_kits/passenger-app/ActiveTripScreen.jsx":"f4c0b120262f","ui_kits/passenger-app/HomeScreen.jsx":"bc6642a6a6be","ui_kits/passenger-app/LiveTrackingScreen.jsx":"2c32c1757f1e","ui_kits/passenger-app/MapCanvas.jsx":"0865e5841d6d","ui_kits/passenger-app/ResultsScreen.jsx":"9fc3831af813","ui_kits/passenger-app/app.jsx":"b325293019cd","ui_kits/passenger-app/shared.jsx":"b43bd331b8a5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BusNETDesignSystem_abb9a1 = window.BusNETDesignSystem_abb9a1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/TableRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET table row for the Fleet dashboard (live units, checking log).
 * Renders `cells` across a grid defined by `columns` (CSS grid-template).
 * Set `head` for the header row. Rows support hover, `selected`, `onClick`,
 * and `entering` (highlight flash for a freshly-arrived checking-log row).
 */
function TableRow({
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
    return /*#__PURE__*/React.createElement("div", _extends({
      role: "row",
      style: {
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
        ...style
      }
    }, rest), cells.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, c)));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "row",
    onClick: onClick,
    className: "bn-trow",
    style: {
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
      ...style
    }
  }, rest), cells.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minWidth: 0
    }
  }, c)), /*#__PURE__*/React.createElement("style", null, `.bn-trow:hover{background:var(--state-hover)}
        @keyframes bn-row-enter{0%{background:var(--state-selected);transform:translateY(-4px);opacity:0}100%{background:transparent;transform:translateY(0);opacity:1}}`));
}
Object.assign(__ds_scope, { TableRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TableRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET skeleton placeholder. Shimmering block used while trip options,
 * bus lists, or dashboard rows load. Compose several to mimic layout.
 */
function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--radius-md)",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: "block",
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--surface-raised) 0%, #26324a 50%, var(--surface-raised) 100%)",
      backgroundSize: "200% 100%",
      animation: "bn-shimmer 1.3s ease-in-out infinite",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, `@keyframes bn-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`));
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET spinner. Circular indeterminate loader in brand green (default).
 * Sizes in px via `size`; `tone` picks the stroke color.
 */
function Spinner({
  size = 24,
  tone = "green",
  strokeWidth = 3,
  style = {},
  ...rest
}) {
  const tones = {
    green: "var(--busnet-green)",
    white: "var(--text-primary)",
    amber: "var(--amber)",
    muted: "var(--text-secondary)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "progressbar",
    "aria-label": "Cargando",
    style: {
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${strokeWidth}px solid var(--hairline-strong)`,
      borderTopColor: tones[tone] || tones.green,
      animation: "bn-spinner 0.7s linear infinite",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, `@keyframes bn-spinner{to{transform:rotate(360deg)}}`));
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/foundations/Icon.jsx
try { (() => {
/**
 * BusNET icon set. Geometry follows Lucide (MIT, https://lucide.dev)
 * at 24×24 with a 2px stroke, using currentColor so icons inherit
 * text color. Only the transit-relevant glyphs BusNET uses are
 * included — add more by pasting the Lucide path data below.
 */
const PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  "dollar-sign": '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  "volume-2": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "check-check": '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "chevron-up": '<path d="m18 15-6-6-6 6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  crosshair: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
  footprints: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  "circle-dot": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  "more-vertical": '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>'
};
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  className = "",
  style = {},
  ...rest
}) {
  const d = PATHS[name];
  if (!d) {
    if (typeof console !== "undefined") console.warn(`[BusNET Icon] unknown icon "${name}"`);
    return null;
  }
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `busnet-icon ${className}`.trim(),
    style,
    "aria-hidden": true,
    dangerouslySetInnerHTML: {
      __html: d
    },
    ...rest
  });
}

/** Names available in this build — handy for pickers/tests. */
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundations/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET button. Large touch targets for on-street use (≥44px, primary 52px).
 * Variants: primary (green), secondary (raised surface), ghost (transparent),
 * danger (emergency/red). Optional leading/trailing icon by name.
 */
function Button({
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
  const heights = {
    sm: 40,
    md: 44,
    lg: 52
  };
  const fontSizes = {
    sm: "var(--text-sm)",
    md: "var(--text-body)",
    lg: "var(--text-body-lg)"
  };
  const pads = {
    sm: "0 14px",
    md: "0 18px",
    lg: "0 22px"
  };
  const variants = {
    primary: {
      background: "var(--busnet-green)",
      color: "var(--text-on-green)",
      border: "none",
      boxShadow: "var(--shadow-sm)"
    },
    secondary: {
      background: "var(--surface-raised)",
      color: "var(--text-primary)",
      border: "1px solid var(--hairline-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    },
    danger: {
      background: "var(--red)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--shadow-sm)"
    }
  };
  const iconSize = size === "lg" ? 20 : size === "sm" ? 16 : 18;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled || loading,
    className: `bn-btn bn-btn--${variant} bn-btn--${size}`,
    style: {
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
      ...style
    },
    onMouseDown: e => {
      if (!disabled && !loading) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    className: "bn-btn__spinner",
    style: {
      width: iconSize,
      height: iconSize,
      borderRadius: "50%",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      animation: "bn-spin 0.7s linear infinite",
      opacity: 0.9
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: iconSize
  }), children && /*#__PURE__*/React.createElement("span", null, children), iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: iconSize
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes bn-spin{to{transform:rotate(360deg)}}
        .bn-btn--primary:hover:not(:disabled){filter:brightness(1.06)}
        .bn-btn--primary:active:not(:disabled){background:var(--busnet-green-600)!important}
        .bn-btn--secondary:hover:not(:disabled){background:#243349!important}
        .bn-btn--ghost:hover:not(:disabled){background:var(--state-hover)!important}
        .bn-btn--danger:hover:not(:disabled){filter:brightness(1.06)}
        .bn-btn--danger:active:not(:disabled){background:var(--red-600)!important}`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET badge. Variants:
 *  - "route"   : route-number pill colored by route (pass `color`)
 *  - "premium" : amber "Premium" chip with lock/star
 *  - "live"    : pulsing "EN VIVO" chip
 *  - "success" / "warning" / "danger" / "neutral" : semantic status chips
 */
function Badge({
  children,
  variant = "neutral",
  color,
  icon,
  size = "md",
  style = {},
  ...rest
}) {
  const sm = size === "sm";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: sm ? 4 : 6,
    height: sm ? 20 : 26,
    padding: sm ? "0 8px" : "0 10px",
    borderRadius: "var(--radius-pill)",
    fontFamily: "var(--font-ui)",
    fontSize: sm ? "var(--text-xs)" : "var(--text-sm)",
    fontWeight: "var(--weight-bold)",
    lineHeight: 1,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap"
  };
  if (variant === "route") {
    const c = color || "var(--route-1)";
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        ...base,
        background: c,
        color: "#08130D",
        fontWeight: "var(--weight-extrabold)",
        fontSize: sm ? "var(--text-sm)" : "var(--text-body)",
        letterSpacing: "0.01em",
        ...style
      }
    }, rest), children);
  }
  if (variant === "premium") {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        ...base,
        background: "var(--amber)",
        color: "var(--text-on-amber)",
        boxShadow: "var(--glow-premium)",
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: icon || "star",
      size: sm ? 11 : 13,
      strokeWidth: 2.5
    }), children || "Premium");
  }
  if (variant === "live") {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: "bn-badge-live",
      style: {
        ...base,
        background: "rgba(0,210,106,0.16)",
        color: "var(--busnet-green)",
        textTransform: "uppercase",
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      style: {
        width: sm ? 6 : 7,
        height: sm ? 6 : 7,
        borderRadius: "50%",
        background: "var(--busnet-green)",
        animation: "bn-live-pulse 1.4s var(--ease-standard) infinite"
      }
    }), children || "En vivo", /*#__PURE__*/React.createElement("style", null, `@keyframes bn-live-pulse{0%{box-shadow:0 0 0 0 rgba(0,210,106,0.55)}70%{box-shadow:0 0 0 6px rgba(0,210,106,0)}100%{box-shadow:0 0 0 0 rgba(0,210,106,0)}}`));
  }
  const semantic = {
    success: {
      background: "rgba(0,210,106,0.16)",
      color: "var(--busnet-green)"
    },
    warning: {
      background: "rgba(255,176,32,0.16)",
      color: "var(--amber)"
    },
    danger: {
      background: "rgba(255,77,77,0.16)",
      color: "var(--red)"
    },
    neutral: {
      background: "var(--surface-raised)",
      color: "var(--text-secondary)"
    }
  }[variant] || {};
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...semantic,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: sm ? 11 : 13,
    strokeWidth: 2.4
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET toast / inline alert. tone: info | success | warning | danger.
 * Use for transient confirmations, arrival alerts, service notices.
 */
function Toast({
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
    info: {
      accent: "var(--info)",
      icon: "bell"
    },
    success: {
      accent: "var(--busnet-green)",
      icon: "check-check"
    },
    warning: {
      accent: "var(--amber)",
      icon: "triangle-alert"
    },
    danger: {
      accent: "var(--red)",
      icon: "triangle-alert"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: "var(--radius-pill)",
      flexShrink: 0,
      background: "color-mix(in srgb, " + t.accent + " 18%, transparent)",
      color: t.accent
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: 18,
    strokeWidth: 2.2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--weight-bold)",
      color: "var(--text-primary)",
      marginBottom: message ? 2 : 0
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--lh-normal)",
      color: "var(--text-secondary)"
    }
  }, message), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, action)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Cerrar",
    style: {
      border: "none",
      background: "transparent",
      color: "var(--text-tertiary)",
      cursor: "pointer",
      padding: 2,
      lineHeight: 0,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET search input — the prominent "¿A dónde vas?" destination field.
 * Big, high-contrast, glass-friendly. Leading search icon, optional
 * clear button, optional voice/mic affordance. Focus ring is green.
 */
function SearchInput({
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
  const heights = {
    md: 48,
    lg: 56
  };
  const h = heights[size] || 56;
  const showClear = value && onClear;
  return /*#__PURE__*/React.createElement("div", {
    className: "bn-search",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      height: h,
      padding: "0 16px",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline-strong)",
      borderRadius: "var(--radius-md)",
      transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 22,
    style: {
      color: "var(--busnet-green)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    autoFocus: autoFocus,
    style: {
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
      letterSpacing: "0.005em"
    },
    onFocus: e => {
      const box = e.currentTarget.closest(".bn-search");
      if (box) {
        box.style.borderColor = "var(--busnet-green)";
        box.style.boxShadow = "var(--glow-green)";
      }
    },
    onBlur: e => {
      const box = e.currentTarget.closest(".bn-search");
      if (box) {
        box.style.borderColor = "var(--hairline-strong)";
        box.style.boxShadow = "none";
      }
    }
  }, rest)), showClear ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Limpiar",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "var(--radius-pill)",
      border: "none",
      background: "var(--surface)",
      color: "var(--text-secondary)",
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })) : trailingIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 20,
    style: {
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }) : null, /*#__PURE__*/React.createElement("style", null, `.bn-search input::placeholder{color:var(--text-tertiary);font-weight:var(--weight-medium)}
        .bn-search input::-webkit-search-cancel-button{display:none}`));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET bottom tab bar. Fixed to the bottom of the mobile viewport.
 * Items: [{ id, label, icon }]. Active item is green with a filled feel.
 */
function TabBar({
  items = [],
  activeId,
  onChange,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      alignItems: "stretch",
      height: "var(--tabbar-height)",
      background: "var(--surface)",
      borderTop: "1px solid var(--hairline)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      ...style
    }
  }, rest), items.map(item => {
    const active = item.id === activeId;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      type: "button",
      onClick: () => onChange && onChange(item.id),
      "aria-current": active ? "page" : undefined,
      style: {
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
        WebkitTapHighlightColor: "transparent"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: item.icon,
      size: 24,
      strokeWidth: active ? 2.4 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-xs)",
        fontWeight: active ? "var(--weight-bold)" : "var(--weight-medium)",
        letterSpacing: "0.01em"
      }
    }, item.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/BottomSheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET bottom sheet. Three snap states: "collapsed" | "half" | "expanded".
 * Rounded 24px top corners, grabber handle, soft upward shadow. Meant to
 * float over the map. Controlled via `snap` + `onSnapChange`, or left
 * uncontrolled (drag the handle to cycle states).
 *
 * This is a presentational sheet — height is driven by `snap`. The handle
 * cycles collapsed → half → expanded → half on tap for demo/prototyping.
 */
function BottomSheet({
  snap = "half",
  onSnapChange,
  heights = {
    collapsed: 96,
    half: 360,
    expanded: 620
  },
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
  return /*#__PURE__*/React.createElement("section", _extends({
    className: "bn-sheet",
    style: {
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
      ...style
    }
  }, rest), showHandle && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: cycle,
    "aria-label": "Ajustar panel",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 26,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      flexShrink: 0,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "var(--sheet-handle)",
      height: 5,
      borderRadius: 999,
      background: "var(--hairline-strong)"
    }
  })), header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 20px 0",
      flexShrink: 0
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      padding: "12px 20px 20px",
      WebkitOverflowScrolling: "touch"
    }
  }, children));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/KpiCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET KPI card for the Fleet dashboard. Big number, label, optional
 * delta trend and icon. tone tints the icon chip + delta.
 */
function KpiCard({
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
    neutral: "var(--text-secondary)"
  };
  const c = tones[tone] || tones.green;
  const deltaGood = deltaDirection === "up";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      padding: 20,
      background: "var(--surface)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-secondary)",
      letterSpacing: "0.01em"
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      borderRadius: "var(--radius-md)",
      background: "color-mix(in srgb, " + c + " 16%, transparent)",
      color: c
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    strokeWidth: 2.2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-display)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--text-primary)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)"
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-secondary)"
    }
  }, unit)), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: deltaGood ? "var(--busnet-green)" : "var(--red)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: deltaGood ? "chevron-up" : "chevron-down",
    size: 15,
    strokeWidth: 2.6
  }), /*#__PURE__*/React.createElement("span", null, delta), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-tertiary)",
      fontWeight: "var(--weight-medium)"
    }
  }, "vs. ayer")));
}
Object.assign(__ds_scope, { KpiCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/transit/BusMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET map marker — a bus tagged with its route number, colored by route.
 * The route NUMBER stays upright and legible at map scale (~32–40px); a
 * directional nub rotates to the `bearing` so the marker points where the
 * bus is heading.
 *
 * state:
 *   "moving"   — default, full color
 *   "stopped"  — dimmed with a pause tick (at a stop / red light)
 *   "selected" — enlarged, white ring + glow, elevated above others
 */
function BusMarker({
  route = "30",
  color = "var(--route-1)",
  bearing = 0,
  state = "moving",
  size = 40,
  onClick,
  style = {},
  ...rest
}) {
  const selected = state === "selected";
  const stopped = state === "stopped";
  const scale = selected ? 1.18 : 1;
  const badgeH = size;
  const fontSize = Math.round(size * 0.44);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    role: onClick ? "button" : undefined,
    style: {
      position: "relative",
      width: badgeH,
      height: badgeH,
      transform: `scale(${scale})`,
      transformOrigin: "center",
      transition: "transform var(--dur-base) var(--ease-spring)",
      cursor: onClick ? "pointer" : "default",
      filter: stopped ? "saturate(0.55)" : "none",
      zIndex: selected ? 5 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      transform: `rotate(${bearing}deg)`,
      transition: "transform var(--dur-slow) var(--ease-standard)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -6,
      left: "50%",
      marginLeft: -6,
      width: 0,
      height: 0,
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderBottom: `9px solid ${color}`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: color,
      color: "#08130D",
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-extrabold)",
      fontSize,
      letterSpacing: "-0.02em",
      border: selected ? "3px solid #fff" : "2px solid rgba(8,19,13,0.35)",
      boxShadow: selected ? "0 6px 16px rgba(0,0,0,0.5), 0 0 0 6px rgba(255,255,255,0.14)" : "var(--shadow-marker)"
    }
  }, route), stopped && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -3,
      right: -3,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "var(--surface)",
      border: "2px solid var(--text-tertiary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 5,
      background: "var(--text-secondary)",
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 5,
      background: "var(--text-secondary)",
      borderRadius: 1
    }
  })));
}
Object.assign(__ds_scope, { BusMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/transit/BusMarker.jsx", error: String((e && e.message) || e) }); }

// components/transit/MapPin.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET map pin (teardrop). variant:
 *   "origin"      — your location (person), green
 *   "destination" — destination flag, amber
 *   "stop"        — Smart Stop, night surface with green ring
 * Optional `label` renders a small caption chip above the pin.
 */
function MapPin({
  variant = "destination",
  label,
  size = 44,
  style = {},
  ...rest
}) {
  const config = {
    origin: {
      bg: "var(--busnet-green)",
      fg: "#08130D",
      icon: "user",
      ring: "rgba(0,210,106,0.28)"
    },
    destination: {
      bg: "var(--amber)",
      fg: "var(--text-on-amber)",
      icon: "flag",
      ring: "rgba(255,176,32,0.28)"
    },
    stop: {
      bg: "var(--surface-raised)",
      fg: "var(--busnet-green)",
      icon: "circle-dot",
      ring: "rgba(0,210,106,0.22)"
    }
  }[variant] || {};
  const iconSize = Math.round(size * 0.42);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "3px 9px",
      borderRadius: "var(--radius-pill)",
      background: "var(--surface)",
      border: "1px solid var(--hairline)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      whiteSpace: "nowrap",
      boxShadow: "var(--shadow-sm)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size * 1.28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: size,
      height: size,
      background: config.bg,
      borderRadius: "50% 50% 50% 0",
      transform: "rotate(45deg)",
      boxShadow: `var(--shadow-marker), 0 0 0 4px ${config.ring}`,
      border: variant === "stop" ? "2px solid var(--busnet-green)" : "2px solid rgba(8,19,13,0.25)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: config.fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: config.icon,
    size: iconSize,
    strokeWidth: 2.4
  }))));
}
Object.assign(__ds_scope, { MapPin });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/transit/MapPin.jsx", error: String((e && e.message) || e) }); }

// components/transit/StepItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET step-by-step item (Moovit-style turn-by-turn). Renders one leg of
 * the plan on a vertical timeline: an icon node on a connector line, a
 * human instruction, and optional detail (route badge, distance, frequency).
 *
 * type: "walk" | "bus" | "transfer" | "origin" | "destination"
 */
function StepItem({
  type = "walk",
  title,
  detail,
  route,
  routeColor = "var(--route-1)",
  duration,
  active = false,
  last = false,
  style = {},
  ...rest
}) {
  const nodes = {
    origin: {
      icon: "user",
      color: "var(--busnet-green)",
      bg: "var(--busnet-green)",
      fg: "#08130D"
    },
    walk: {
      icon: "footprints",
      color: "var(--text-secondary)",
      bg: "var(--surface-raised)",
      fg: "var(--text-secondary)"
    },
    bus: {
      icon: "bus",
      color: routeColor,
      bg: routeColor,
      fg: "#08130D"
    },
    transfer: {
      icon: "repeat",
      color: "var(--amber)",
      bg: "var(--surface-raised)",
      fg: "var(--amber)"
    },
    destination: {
      icon: "flag",
      color: "var(--amber)",
      bg: "var(--amber)",
      fg: "var(--text-on-amber)"
    }
  }[type] || {};
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: 14,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: nodes.bg,
      color: nodes.fg,
      border: active ? "2px solid #fff" : "none",
      boxShadow: active ? "var(--glow-green)" : "none",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: nodes.icon,
    size: 18,
    strokeWidth: 2.3
  })), !last && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: 2.5,
      minHeight: 20,
      marginTop: 4,
      borderRadius: 2,
      background: type === "walk" || type === "transfer" ? "repeating-linear-gradient(var(--hairline-strong) 0 5px, transparent 5px 10px)" : nodes.color
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      paddingBottom: last ? 0 : 20,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, route && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 24,
      padding: "0 9px",
      borderRadius: "var(--radius-pill)",
      background: routeColor,
      color: "#08130D",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-extrabold)"
    }
  }, route), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-body-lg)",
      fontWeight: "var(--weight-bold)",
      color: "var(--text-primary)",
      lineHeight: "var(--lh-snug)"
    }
  }, title)), detail && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      lineHeight: "var(--lh-normal)"
    }
  }, detail), duration && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      color: "var(--text-tertiary)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 13
  }), " ", duration)));
}
Object.assign(__ds_scope, { StepItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/transit/StepItem.jsx", error: String((e && e.message) || e) }); }

// components/transit/TripCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BusNET trip-alternative card. Reads in one glance: the leg sequence
 * (bus routes as colored chips, walks as footprint+minutes), then the
 * total time and fare. `recommended` gives the green-bordered hero style.
 *
 * legs: [{ type: "bus", route, color, minutes? } | { type: "walk", minutes }]
 */
function TripCard({
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
  const transfers = legs.filter(l => l.type === "bus").length - 1;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    className: "bn-tripcard",
    style: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: 16,
      background: recommended ? "var(--state-selected)" : "var(--surface-raised)",
      border: `1.5px solid ${recommended || selected ? "var(--busnet-green)" : "var(--hairline)"}`,
      borderRadius: "var(--radius-lg)",
      cursor: "pointer",
      transition: "transform var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest), recommended && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 10,
      color: "var(--busnet-green)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-extrabold)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "navigation",
    size: 13,
    strokeWidth: 2.6
  }), " Recomendada"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 7,
      marginBottom: 14
    }
  }, legs.map((leg, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, leg.type === "bus" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 28,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      background: leg.color || "var(--route-1)",
      color: "#08130D",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--weight-extrabold)",
      letterSpacing: "-0.01em"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bus",
    size: 15,
    strokeWidth: 2.4
  }), " ", leg.route) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      height: 28,
      padding: "0 8px",
      borderRadius: "var(--radius-pill)",
      background: "var(--surface)",
      color: "var(--text-secondary)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "footprints",
    size: 15,
    strokeWidth: 2.2
  }), " ", leg.minutes, "m"), i < legs.length - 1 && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 15,
    strokeWidth: 2.4,
    style: {
      color: "var(--text-tertiary)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--text-primary)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)"
    }
  }, totalMinutes), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-secondary)"
    }
  }, "min")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      color: "var(--amber)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h3)",
      fontWeight: "var(--weight-bold)"
    }
  }, fare), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "var(--text-tertiary)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)"
    }
  }, transfers > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "repeat",
    size: 14,
    strokeWidth: 2.2
  }), " ", transfers, " transbordo", transfers > 1 ? "s" : "") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.6
  }), " Directo"))), departLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "var(--text-secondary)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 14
  }), " ", departLabel), /*#__PURE__*/React.createElement("style", null, `.bn-tripcard:active{transform:scale(0.99)}.bn-tripcard:hover{border-color:var(--busnet-green-300)}`));
}
Object.assign(__ds_scope, { TripCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/transit/TripCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fleet-dashboard/Dashboard.jsx
try { (() => {
/* global React */
// BusNET Fleet — desktop dashboard for transport operators. KPIs, live units
// table, a checking log that fills in real time (the pitch climax), mini map.

function MiniMap() {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    BusMarker
  } = DS;
  const streets = ["M-10,60 L420,90", "M-10,150 L420,130", "M-10,220 L420,240", "M60,-10 L50,300", "M170,-10 L185,300", "M300,-10 L290,300"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 260,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--hairline)",
      background: "radial-gradient(120% 90% at 60% 10%, #14203a, #0B1220 65%)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 260",
    width: "100%",
    height: "100%",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: "absolute",
      inset: 0
    }
  }, streets.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d,
    fill: "none",
    stroke: "#1c2740",
    strokeWidth: i < 3 ? 6 : 3,
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M30,220 C120,180 180,240 260,180 S360,120 400,150",
    fill: "none",
    stroke: "var(--route-1)",
    strokeWidth: "4",
    opacity: "0.9",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20,80 C120,120 200,60 300,110",
    fill: "none",
    stroke: "var(--route-6)",
    strokeWidth: "4",
    opacity: "0.9",
    strokeLinecap: "round"
  })), [["30B", "var(--route-1)", 120, 190, 40], ["7D", "var(--route-6)", 250, 90, 200], ["42", "var(--route-4)", 300, 200, 120]].map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: b[2],
      top: b[3],
      transform: "translate(-50%,-50%)"
    }
  }, /*#__PURE__*/React.createElement(BusMarker, {
    route: b[0],
    color: b[1],
    bearing: b[4],
    size: 30,
    state: i === 0 ? "selected" : "moving"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(DS.Badge, {
    variant: "live"
  }, "En vivo")));
}
function Dashboard() {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    KpiCard,
    TableRow,
    Badge,
    Icon
  } = DS;
  const cols = "132px 70px 1fr 130px 74px 96px";
  const units = [["P-482-AB", "30B", "var(--route-1)", "José Martínez", "success", "En ruta", "7", "96%"], ["P-118-CD", "7D", "var(--route-6)", "María Alvarado", "success", "En ruta", "5", "92%"], ["P-903-EF", "42", "var(--route-4)", "Carlos Rivas", "neutral", "Detenido", "6", "88%"], ["P-256-GH", "101", "var(--route-3)", "Ana Beltrán", "warning", "Retraso", "4", "79%"], ["P-771-IJ", "12", "var(--route-5)", "Luis Portillo", "success", "En ruta", "8", "97%"], ["P-640-KL", "2B", "var(--route-2)", "Sofía Cruz", "success", "En ruta", "6", "94%"], ["P-329-MN", "8", "var(--route-7)", "Óscar Díaz", "neutral", "Detenido", "5", "90%"]];

  // checking log fills in real time
  const seed = [{
    u: "P-118-CD",
    r: "7D",
    c: "var(--route-6)",
    pt: "Terminal Occidente",
    t: "10:14:02"
  }, {
    u: "P-482-AB",
    r: "30B",
    c: "var(--route-1)",
    pt: "Punto Metrocentro",
    t: "10:13:41"
  }, {
    u: "P-771-IJ",
    r: "12",
    c: "var(--route-5)",
    pt: "Redondel Masferrer",
    t: "10:13:08"
  }];
  const pool = [{
    u: "P-640-KL",
    r: "2B",
    c: "var(--route-2)",
    pt: "Terminal Oriente"
  }, {
    u: "P-903-EF",
    r: "42",
    c: "var(--route-4)",
    pt: "Parque Cuscatlán"
  }, {
    u: "P-329-MN",
    r: "8",
    c: "var(--route-7)",
    pt: "Plaza Salvador del Mundo"
  }, {
    u: "P-256-GH",
    r: "101",
    c: "var(--route-3)",
    pt: "Terminal Occidente"
  }, {
    u: "P-482-AB",
    r: "30B",
    c: "var(--route-1)",
    pt: "Hospital Bloom"
  }];
  const [log, setLog] = React.useState(seed);
  const [count, setCount] = React.useState(1240);
  React.useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      const base = pool[n % pool.length];
      const now = new Date();
      const t = `10:${String(14 + n % 40).padStart(2, "0")}:${String(n * 7 % 60).padStart(2, "0")}`;
      setLog(prev => [{
        ...base,
        t,
        fresh: true
      }, ...prev].slice(0, 9));
      setCount(c => c + 1);
      n++;
    }, 2600);
    return () => clearInterval(id);
  }, []);
  const nav = [["gauge", "Resumen", true], ["bus", "Unidades", false], ["check-check", "Checking", false], ["route", "Rutas", false], ["activity", "Reportes", false]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1440,
      minHeight: 900,
      display: "flex",
      background: "var(--night)",
      fontFamily: "var(--font-ui)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      flexShrink: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--hairline)",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 8px 20px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/busnet-badge.svg",
    style: {
      width: 34,
      borderRadius: 10
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 800,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em"
    }
  }, "Bus", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--busnet-green)"
    }
  }, "NET")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--amber)",
      letterSpacing: "0.04em"
    }
  }, "FLEET"))), nav.map(([ic, label, on]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 12px",
      borderRadius: "var(--radius-md)",
      color: on ? "var(--text-primary)" : "var(--text-secondary)",
      background: on ? "var(--state-selected)" : "transparent",
      fontWeight: on ? 700 : 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 19,
    style: {
      color: on ? "var(--busnet-green)" : "var(--text-tertiary)"
    }
  }), " ", label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: 14,
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "Ruta 30 S.A. de C.V."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, "Plan Flota \xB7 80 unidades"))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: "28px 32px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 26,
      fontWeight: 800,
      color: "var(--text-primary)",
      letterSpacing: "-0.01em"
    }
  }, "Resumen operativo"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 14,
      color: "var(--text-secondary)"
    }
  }, "Viernes 4 de julio \xB7 10:14 a.m.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "live"
  }, "En vivo"), /*#__PURE__*/React.createElement("button", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 42,
      padding: "0 16px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 17
  }), " Exportar reporte"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(KpiCard, {
    label: "Unidades activas",
    value: "42",
    unit: "/ 80",
    icon: "bus",
    delta: "+4",
    deltaDirection: "up"
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Vueltas hoy",
    value: "318",
    icon: "repeat",
    delta: "+12%",
    deltaDirection: "up",
    tone: "info"
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Puntualidad",
    value: "91",
    unit: "%",
    icon: "gauge",
    tone: "amber",
    delta: "-2%",
    deltaDirection: "down"
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Checkings hoy",
    value: count.toLocaleString("es"),
    icon: "check-check",
    tone: "green"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.55fr 1fr",
      gap: 20,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 800,
      color: "var(--text-primary)"
    }
  }, "Unidades en vivo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, "42 en ruta")), /*#__PURE__*/React.createElement(TableRow, {
    head: true,
    columns: cols,
    cells: ["Unidad", "Ruta", "Motorista", "Estado", "Vueltas", "Puntual."]
  }), units.map((u, i) => /*#__PURE__*/React.createElement(TableRow, {
    key: i,
    columns: cols,
    cells: [/*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 13,
        color: "var(--text-primary)"
      }
    }, u[0]), /*#__PURE__*/React.createElement(Badge, {
      variant: "route",
      color: u[2]
    }, u[1]), u[3], /*#__PURE__*/React.createElement(Badge, {
      variant: u[4],
      icon: u[4] === "warning" ? "triangle-alert" : u[4] === "success" ? "check" : undefined
    }, u[5]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, u[6]), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontWeight: 600
      }
    }, u[7])]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(MiniMap, null), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-check",
    size: 18,
    style: {
      color: "var(--busnet-green)"
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 800,
      color: "var(--text-primary)"
    }
  }, "Checking digital"), /*#__PURE__*/React.createElement(Badge, {
    variant: "live"
  }, "Vivo")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "hidden"
    }
  }, log.map((e, i) => /*#__PURE__*/React.createElement(TableRow, {
    key: e.u + e.t + i,
    entering: e.fresh,
    columns: "60px 1fr 88px",
    cells: [/*#__PURE__*/React.createElement(Badge, {
      variant: "route",
      color: e.c,
      size: "sm"
    }, e.r), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 700,
        color: "var(--text-primary)"
      }
    }, e.u), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, e.pt)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-tertiary)"
      }
    }, e.t)]
  }))))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fleet-dashboard/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/ActiveTripScreen.jsx
try { (() => {
/* global React */
// BusNET Active trip — painted route, ETA header, step-by-step, voice button.

function ActiveTripScreen({
  onBack
}) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    BottomSheet,
    StepItem,
    Button,
    Icon,
    MapPin,
    BusMarker
  } = DS;
  const R = window.BN_ROUTES;
  const routes = [{
    ...R.r30b,
    active: true
  }, {
    ...R.r7d,
    active: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(window.MapCanvas, {
    routes: routes,
    dim: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 40,
      top: 150,
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    variant: "origin",
    size: 34
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 150,
      top: 360,
      transform: "translate(-50%,-50%)"
    }
  }, /*#__PURE__*/React.createElement(BusMarker, {
    route: "30B",
    color: "var(--route-1)",
    bearing: 130,
    state: "moving",
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 340,
      top: 240,
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    variant: "destination",
    label: "Bloom",
    size: 38
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      background: "var(--scrim-top)",
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 40,
      fontWeight: 800,
      color: "var(--busnet-green)",
      lineHeight: 1,
      letterSpacing: "-0.02em"
    }
  }, "42"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "min"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-secondary)",
      marginLeft: 4
    }
  }, "\xB7 $0.50")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, "Llegada estimada 10:23 \xB7 1 transbordo")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(BottomSheet, {
    snap: "expanded",
    showHandle: true,
    heights: {
      collapsed: 130,
      half: 360,
      expanded: 540
    },
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "md",
      iconLeft: "volume-2",
      style: {
        flex: 1
      }
    }, "Escuchar instrucciones"), /*#__PURE__*/React.createElement("button", {
      style: {
        width: 44,
        height: 44,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-raised)",
        border: "1px solid var(--hairline)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 19,
      style: {
        color: "var(--amber)"
      }
    })))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement(StepItem, {
    type: "origin",
    title: "Tu ubicaci\xF3n",
    detail: "Col. Escal\xF3n"
  }), /*#__PURE__*/React.createElement(StepItem, {
    type: "walk",
    title: "Camina hasta la parada",
    detail: "Metrocentro, sobre Alameda Juan Pablo II",
    duration: "4 min \xB7 450 m"
  }), /*#__PURE__*/React.createElement(StepItem, {
    type: "bus",
    route: "30B",
    routeColor: "var(--route-1)",
    title: "Toma la ruta 30B",
    detail: "Cada ~12 min \xB7 6 paradas",
    duration: "18 min",
    active: true
  }), /*#__PURE__*/React.createElement(StepItem, {
    type: "transfer",
    title: "Transbordo a la 7D",
    detail: "Camina 120 m a la siguiente parada",
    duration: "2 min"
  }), /*#__PURE__*/React.createElement(StepItem, {
    type: "bus",
    route: "7D",
    routeColor: "var(--route-6)",
    title: "Toma la ruta 7D",
    detail: "4 paradas",
    duration: "14 min"
  }), /*#__PURE__*/React.createElement(StepItem, {
    type: "destination",
    title: "Hospital Bloom",
    detail: "Sobre 25 Avenida Norte",
    last: true
  }))));
}
window.ActiveTripScreen = ActiveTripScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/ActiveTripScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/HomeScreen.jsx
try { (() => {
/* global React */
// BusNET Home — dark map, prominent search, faded routes, recent destinations.

function HomeScreen({
  onSearch
}) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    SearchInput,
    BottomSheet,
    Icon,
    MapPin
  } = DS;
  const R = window.BN_ROUTES;
  const routes = [{
    ...R.r30b,
    active: false
  }, {
    ...R.r7d,
    active: false
  }, {
    ...R.r42,
    active: false
  }, {
    ...R.r101,
    active: false
  }, {
    ...R.r12,
    active: false
  }];
  const recents = [{
    icon: "map-pin",
    title: "Casa",
    sub: "Col. Escalón, San Salvador"
  }, {
    icon: "map-pin",
    title: "Trabajo",
    sub: "Santa Elena, Antiguo Cuscatlán"
  }, {
    icon: "clock",
    title: "Hospital Bloom",
    sub: "Búsqueda reciente"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(window.MapCanvas, {
    routes: routes,
    dim: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 150,
      top: 358,
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    variant: "origin",
    label: "T\xFA",
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      background: "var(--scrim-top)",
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/busnet-badge.svg",
    style: {
      width: 30,
      borderRadius: 9
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 800,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em"
    }
  }, "Bus", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--busnet-green)"
    }
  }, "NET"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onSearch,
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(SearchInput, {
    placeholder: "\xBFA d\xF3nde vas?",
    trailingIcon: "crosshair",
    readOnly: true
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(BottomSheet, {
    snap: "half",
    showHandle: true,
    heights: {
      collapsed: 96,
      half: 300,
      expanded: 560
    },
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 6
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: "var(--font-display)",
        fontSize: 17,
        fontWeight: 800,
        color: "var(--text-primary)"
      }
    }, "Destinos recientes"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--busnet-green)",
        fontSize: 13,
        fontWeight: 700
      }
    }, "Editar"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, recents.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: onSearch,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 4px",
      cursor: "pointer",
      borderBottom: i < recents.length - 1 ? "1px solid var(--hairline)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.icon,
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.sub)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    style: {
      color: "var(--text-tertiary)",
      flexShrink: 0
    }
  }))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/LiveTrackingScreen.jsx
try { (() => {
/* global React */
// BusNET Live tracking — buses moving on the map (animated), a selected bus
// with a Premium "llega en 6 min" sheet. This is the "wow" screen.

function LiveTrackingScreen({
  onBack
}) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    BottomSheet,
    Badge,
    Button,
    Icon,
    BusMarker
  } = DS;
  const R = window.BN_ROUTES;
  const routes = [{
    ...R.r30b,
    active: true
  }, {
    ...R.r7d,
    active: false
  }, {
    ...R.r42,
    active: false
  }, {
    ...R.r12,
    active: false
  }];

  // waypoint tracks for the animated buses
  const tracks = React.useMemo(() => ({
    b1: [[150, 360], [175, 300], [140, 250], [110, 320], [150, 360]],
    b2: [[300, 460], [260, 500], [210, 520], [250, 470], [300, 460]],
    b3: [[300, 330], [240, 350], [180, 360], [120, 300], [300, 330]],
    b4: [[280, 560], [200, 540], [120, 470], [200, 540], [280, 560]]
  }), []);
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setStep(s => s + 1), 2400);
    return () => clearInterval(id);
  }, []);
  const bearing = (track, i) => {
    const a = track[i % track.length],
      b = track[(i + 1) % track.length];
    return Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180 / Math.PI;
  };
  const pos = (track, i) => track[i % track.length];
  const buses = [{
    id: "b1",
    route: "30B",
    color: "var(--route-1)",
    state: "selected"
  }, {
    id: "b2",
    route: "7D",
    color: "var(--route-6)",
    state: "moving"
  }, {
    id: "b3",
    route: "42",
    color: "var(--route-4)",
    state: "moving"
  }, {
    id: "b4",
    route: "12",
    color: "var(--route-5)",
    state: "stopped"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(window.MapCanvas, {
    routes: routes,
    dim: true
  }, buses.map(b => {
    const p = pos(tracks[b.id], step);
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      style: {
        position: "absolute",
        left: p[0],
        top: p[1],
        transform: "translate(-50%,-50%)",
        transition: "left 2.3s linear, top 2.3s linear",
        zIndex: b.state === "selected" ? 6 : 2
      }
    }, /*#__PURE__*/React.createElement(BusMarker, {
      route: b.route,
      color: b.color,
      bearing: bearing(tracks[b.id], step),
      state: b.state,
      size: b.state === "selected" ? 42 : 36
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      background: "var(--scrim-top)",
      paddingBottom: 18
    }
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    style: {
      transform: "rotate(180deg)"
    }
  })), /*#__PURE__*/React.createElement(Badge, {
    variant: "live"
  }, "En vivo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(BottomSheet, {
    snap: "half",
    showHandle: true,
    heights: {
      collapsed: 110,
      half: 340,
      expanded: 480
    },
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: 30,
        padding: "0 12px",
        borderRadius: "var(--radius-pill)",
        background: "var(--route-1)",
        color: "#08130D",
        fontFamily: "var(--font-display)",
        fontSize: 17,
        fontWeight: 800
      }
    }, "30B"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 16,
        fontWeight: 800,
        color: "var(--text-primary)"
      }
    }, "Ruta 30B"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 12,
        color: "var(--text-secondary)"
      }
    }, "Metrocentro \u2192 Centro")), /*#__PURE__*/React.createElement(Badge, {
      variant: "premium"
    }, "Premium"))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      padding: "6px 0 4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      color: "var(--text-secondary)"
    }
  }, "Llega a tu parada en")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 56,
      fontWeight: 800,
      color: "var(--amber)",
      lineHeight: 1,
      letterSpacing: "-0.02em"
    }
  }, "6"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "min"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "var(--text-tertiary)",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "crosshair",
    size: 13
  }), " Actualizado hace 2 s")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, [["Metrocentro", "2 paradas antes"], ["Parque Cuscatlán", "1 parada antes"], ["Tu parada · Hospital Bloom", "6 min"]].map((s, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: i === arr.length - 1 ? "var(--amber)" : "var(--surface-raised)",
      border: `2px solid ${i === arr.length - 1 ? "var(--amber)" : "var(--hairline-strong)"}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: i === arr.length - 1 ? 700 : 500,
      color: i === arr.length - 1 ? "var(--text-primary)" : "var(--text-secondary)"
    }
  }, s[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-tertiary)"
    }
  }, s[1])))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    iconLeft: "bell",
    fullWidth: true
  }, "Av\xEDsame cuando est\xE9 a 2 paradas")))));
}
window.LiveTrackingScreen = LiveTrackingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/LiveTrackingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/MapCanvas.jsx
try { (() => {
/* global React */
// Faux dark "night map" for BusNET mockups — a stylized street network
// on the #0B1220 canvas with painted bus-route polylines. Not a real map
// engine (MapLibre in production); this reproduces the look for the kit.
// Children render absolutely over the map (markers, pins).

const STREETS = [
// long avenues (diagonals)
"M-20,120 L420,300", "M-20,470 L420,250", "M60,-20 L260,760",
// grid-ish arterials with slight jitter
"M-20,80 L420,90", "M-20,210 L420,225", "M-20,340 L420,330", "M-20,470 L420,485", "M-20,600 L420,590", "M70,-20 L60,760", "M170,-20 L185,760", "M280,-20 L270,760", "M360,-20 L370,760"];
function MapCanvas({
  routes = [],
  children,
  style = {},
  dim = false,
  width = 375,
  height = 720
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      background: "radial-gradient(120% 90% at 70% 12%, #14203a 0%, #0B1220 62%)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    height: "100%",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M200,360 q40,-40 90,-20 q30,40 -10,90 q-60,30 -90,-10 z",
    fill: "#12261d",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20,540 C80,520 120,600 220,560 S360,520 420,560 L420,760 L-20,760 Z",
    fill: "#0e1a2e",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20,540 C80,520 120,600 220,560 S360,520 420,560",
    fill: "none",
    stroke: "#16324e",
    strokeWidth: "6",
    opacity: "0.6"
  }), STREETS.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d,
    fill: "none",
    stroke: "#1c2740",
    strokeWidth: i < 3 ? 7 : 3.5,
    strokeLinecap: "round"
  })), routes.map((r, i) => /*#__PURE__*/React.createElement("g", {
    key: i,
    opacity: dim && !r.active ? 0.28 : 1
  }, /*#__PURE__*/React.createElement("path", {
    d: r.d,
    fill: "none",
    stroke: r.color,
    strokeWidth: r.active ? 6 : 4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      filter: r.active ? "drop-shadow(0 0 6px " + r.color + ")" : "none"
    }
  })))), children);
}
window.MapCanvas = MapCanvas;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/MapCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/ResultsScreen.jsx
try { (() => {
/* global React */
// BusNET Results — destination set, sheet with 3 trip alternatives by time.

function ResultsScreen({
  onSelect,
  onBack
}) {
  const DS = window.BusNETDesignSystem_abb9a1;
  const {
    BottomSheet,
    TripCard,
    Icon,
    MapPin
  } = DS;
  const R = window.BN_ROUTES;
  const routes = [{
    ...R.r30b,
    active: true
  }, {
    ...R.r7d,
    active: true
  }, {
    ...R.r42,
    active: false
  }, {
    ...R.r101,
    active: false
  }, {
    ...R.r12,
    active: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(window.MapCanvas, {
    routes: routes,
    dim: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 40,
      top: 150,
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    variant: "origin",
    label: "T\xFA",
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 340,
      top: 240,
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    variant: "destination",
    label: "Hospital Bloom",
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      background: "var(--scrim-top)",
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    style: {
      transform: "rotate(180deg)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 48,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag",
    size: 18,
    style: {
      color: "var(--amber)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "Hospital Bloom")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(BottomSheet, {
    snap: "expanded",
    showHandle: true,
    heights: {
      collapsed: 120,
      half: 380,
      expanded: 560
    },
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 6
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: "var(--font-display)",
        fontSize: 18,
        fontWeight: 800,
        color: "var(--text-primary)"
      }
    }, "3 rutas hacia Hospital Bloom"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, "Ordenadas por tiempo total"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(TripCard, {
    recommended: true,
    totalMinutes: 42,
    fare: "$0.50",
    departLabel: "Sale en 3 min \xB7 cada 12 min",
    onClick: onSelect,
    legs: [{
      type: "walk",
      minutes: 4
    }, {
      type: "bus",
      route: "30B",
      color: "var(--route-1)"
    }, {
      type: "bus",
      route: "7D",
      color: "var(--route-6)"
    }]
  }), /*#__PURE__*/React.createElement(TripCard, {
    totalMinutes: 48,
    fare: "$0.35",
    departLabel: "Sale en 6 min",
    onClick: onSelect,
    legs: [{
      type: "walk",
      minutes: 7
    }, {
      type: "bus",
      route: "42",
      color: "var(--route-4)"
    }]
  }), /*#__PURE__*/React.createElement(TripCard, {
    totalMinutes: 55,
    fare: "$0.50",
    departLabel: "Cada ~15 min",
    onClick: onSelect,
    legs: [{
      type: "walk",
      minutes: 3
    }, {
      type: "bus",
      route: "101",
      color: "var(--route-3)"
    }, {
      type: "bus",
      route: "12",
      color: "var(--route-5)"
    }]
  }))));
}
window.ResultsScreen = ResultsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/ResultsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/app.jsx
try { (() => {
/* global React */
// Wires the four passenger screens into a click-through prototype.

function PassengerApp() {
  const [screen, setScreen] = React.useState("home");
  const screens = {
    home: /*#__PURE__*/React.createElement(window.HomeScreen, {
      onSearch: () => setScreen("results")
    }),
    results: /*#__PURE__*/React.createElement(window.ResultsScreen, {
      onSelect: () => setScreen("active"),
      onBack: () => setScreen("home")
    }),
    active: /*#__PURE__*/React.createElement(window.ActiveTripScreen, {
      onBack: () => setScreen("results")
    }),
    live: /*#__PURE__*/React.createElement(window.LiveTrackingScreen, {
      onBack: () => setScreen("home")
    })
  };
  const tabs = [["home", "Home", "Mapa + búsqueda"], ["results", "Resultados", "3 alternativas"], ["active", "Viaje activo", "Paso a paso + voz"], ["live", "Tracking en vivo", "Buses + Premium"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 40,
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "36px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 260,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/busnet-badge.svg",
    style: {
      width: 34,
      borderRadius: 10
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 18,
      fontWeight: 800,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em"
    }
  }, "Bus", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--busnet-green)"
    }
  }, "NET")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "App de pasajero"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, tabs.map(([id, label, sub]) => {
    const on = screen === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setScreen(id),
      style: {
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        background: on ? "var(--state-selected)" : "var(--surface)",
        border: `1px solid ${on ? "var(--busnet-green)" : "var(--hairline)"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        fontWeight: 700,
        color: on ? "var(--busnet-green)" : "var(--text-primary)"
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 12,
        color: "var(--text-secondary)",
        marginTop: 2
      }
    }, sub));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-tertiary)",
      lineHeight: 1.5
    }
  }, "Toca la b\xFAsqueda en Home para seguir el flujo hasta el viaje activo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 375,
      height: 760,
      borderRadius: 44,
      background: "#000",
      padding: 6,
      boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 2px #1c2740",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: 38,
      overflow: "hidden",
      background: "var(--night)"
    }
  }, screens[screen], /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 7,
      left: "50%",
      transform: "translateX(-50%)",
      width: 130,
      height: 5,
      borderRadius: 3,
      background: "rgba(255,255,255,0.5)",
      zIndex: 40
    }
  }))));
}
window.PassengerApp = PassengerApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/passenger-app/shared.jsx
try { (() => {
/* global React */
// Shared route polyline data + a status bar, reused across passenger screens.

window.BN_ROUTES = {
  r30b: {
    color: "var(--route-1)",
    d: "M40,150 C90,220 60,320 150,360 S250,430 210,520"
  },
  r7d: {
    color: "var(--route-6)",
    d: "M210,520 C260,470 330,500 350,430 S300,300 340,240"
  },
  r42: {
    color: "var(--route-4)",
    d: "M20,300 C120,280 180,360 300,330 S360,250 380,200"
  },
  r101: {
    color: "var(--route-3)",
    d: "M70,60 C120,160 220,140 260,240 S220,420 300,480"
  },
  r12: {
    color: "var(--route-5)",
    d: "M10,440 C120,420 160,520 280,560"
  }
};
function StatusBar({
  dark = false
}) {
  const c = dark ? "var(--text-primary)" : "var(--text-primary)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      color: c,
      fontFamily: "var(--font-ui)",
      flexShrink: 0,
      position: "relative",
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "5G"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 22,
      height: 11,
      border: "1.5px solid currentColor",
      borderRadius: 3,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 1.5,
      right: 6,
      background: "currentColor",
      borderRadius: 1
    }
  }))));
}
window.StatusBar = StatusBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/passenger-app/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TableRow = __ds_scope.TableRow;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.BusMarker = __ds_scope.BusMarker;

__ds_ns.MapPin = __ds_scope.MapPin;

__ds_ns.StepItem = __ds_scope.StepItem;

__ds_ns.TripCard = __ds_scope.TripCard;

})();
