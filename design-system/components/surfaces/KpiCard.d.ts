import * as React from "react";
import type { IconName } from "../foundations/Icon";

/**
 * Metric card for the Fleet dashboard — big number, label, trend.
 *
 * @startingPoint section="Surfaces" subtitle="Dashboard KPI metric card" viewport="700x200"
 */
export interface KpiCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  label: string;
  value: string | number;
  /** Small unit appended after the value (e.g. "%", "min"). */
  unit?: string;
  icon?: IconName;
  /** Trend text, e.g. "+3.2%". Omit to hide the delta row. */
  delta?: string;
  deltaDirection?: "up" | "down";
  tone?: "green" | "amber" | "info" | "red" | "neutral";
  style?: React.CSSProperties;
}

export declare function KpiCard(props: KpiCardProps): JSX.Element;
