import * as React from "react";

/**
 * One step of the turn-by-turn plan, on a vertical timeline.
 *
 * @startingPoint section="Transit" subtitle="Turn-by-turn step timeline item" viewport="700x160"
 */
export interface StepItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  type?: "walk" | "bus" | "transfer" | "origin" | "destination";
  /** Human instruction, e.g. "Toma la ruta 30B en Metrocentro". */
  title: React.ReactNode;
  /** Secondary detail, e.g. "Cada ~12 min · 6 paradas". */
  detail?: React.ReactNode;
  /** Route number badge (bus steps). */
  route?: string;
  routeColor?: string;
  /** Duration caption, e.g. "4 min · 450 m". */
  duration?: string;
  /** Highlights the current step. */
  active?: boolean;
  /** Last item — hides the trailing connector. */
  last?: boolean;
  style?: React.CSSProperties;
}

export declare function StepItem(props: StepItemProps): JSX.Element;
