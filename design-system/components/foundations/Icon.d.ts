import * as React from "react";

/** Icon glyph names shipped with BusNET's Lucide-geometry set. */
export type IconName =
  | "search" | "clock" | "map-pin" | "bus" | "dollar-sign" | "volume-2"
  | "lock" | "star" | "triangle-alert" | "check" | "check-check" | "x"
  | "chevron-up" | "chevron-down" | "chevron-right" | "arrow-right"
  | "navigation" | "crosshair" | "footprints" | "repeat" | "circle-dot"
  | "zap" | "menu" | "phone" | "user" | "flag" | "bell" | "activity"
  | "gauge" | "route" | "more-vertical";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Which glyph to render. */
  name: IconName;
  /** Pixel size (width & height). Default 24. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
}

/**
 * BusNET line icon. Inherits `currentColor`; set color/size on the
 * parent or via style. Geometry follows Lucide (MIT).
 */
export declare function Icon(props: IconProps): JSX.Element | null;

/** All glyph names available in this build. */
export declare const ICON_NAMES: IconName[];
