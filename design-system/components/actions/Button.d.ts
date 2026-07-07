import * as React from "react";
import type { IconName } from "../foundations/Icon";

/**
 * BusNET button with large, street-friendly touch targets.
 *
 * @startingPoint section="Actions" subtitle="Primary / secondary / ghost / danger buttons" viewport="700x220"
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  /** Visual style. Default "primary". */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Height preset — sm 40 / md 44 / lg 52. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Leading icon name. */
  iconLeft?: IconName;
  /** Trailing icon name. */
  iconRight?: IconName;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Disabled state (dims + blocks). */
  disabled?: boolean;
  /** Swaps content for a spinner and blocks interaction. */
  loading?: boolean;
  style?: React.CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
