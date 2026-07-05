import * as React from "react";

/** Circular indeterminate loading spinner. */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** Diameter in px. Default 24. */
  size?: number;
  tone?: "green" | "white" | "amber" | "muted";
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export declare function Spinner(props: SpinnerProps): JSX.Element;
