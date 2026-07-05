import * as React from "react";

export interface TripLeg {
  type: "bus" | "walk";
  /** Bus route number, e.g. "30B" (bus legs). */
  route?: string;
  /** Route color token/hex (bus legs). */
  color?: string;
  /** Duration in minutes (walk legs; optional on bus legs). */
  minutes?: number;
}

/**
 * Trip-alternative card: leg sequence + total time + fare, readable at a glance.
 *
 * @startingPoint section="Transit" subtitle="Trip alternative card with legs, time & fare" viewport="700x220"
 */
export interface TripCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  legs: TripLeg[];
  /** Total trip time in minutes. */
  totalMinutes: number | string;
  /** Fare string, e.g. "$0.50". */
  fare: string;
  /** Optional departure/frequency caption, e.g. "Sale en 3 min · cada 12 min". */
  departLabel?: string;
  /** Green hero treatment for the best option. */
  recommended?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
}

export declare function TripCard(props: TripCardProps): JSX.Element;
