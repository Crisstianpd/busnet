import * as React from "react";
import type { IconName } from "../foundations/Icon";

/**
 * Compact status pill: route numbers, Premium, EN VIVO, and semantic states.
 *
 * @startingPoint section="Feedback" subtitle="Route / Premium / live / status pills" viewport="700x140"
 */
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  variant?: "route" | "premium" | "live" | "success" | "warning" | "danger" | "neutral";
  /** For variant="route": the route color (a --route-N token or hex). */
  color?: string;
  /** Optional leading icon (ignored by route/live). */
  icon?: IconName;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}

export declare function Badge(props: BadgeProps): JSX.Element;
