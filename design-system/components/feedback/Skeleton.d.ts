import * as React from "react";

/** Shimmering placeholder block for loading states. */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  width?: number | string;
  height?: number | string;
  /** Corner radius (CSS value). Default var(--radius-md). */
  radius?: string;
  style?: React.CSSProperties;
}

export declare function Skeleton(props: SkeletonProps): JSX.Element;
