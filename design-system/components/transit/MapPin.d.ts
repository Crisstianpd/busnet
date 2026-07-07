import * as React from "react";

/**
 * Teardrop map pin for origin (person), destination (flag), and Smart Stops.
 *
 * @startingPoint section="Map" subtitle="Origin / destination / stop pins" viewport="700x180"
 */
export interface MapPinProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  variant?: "origin" | "destination" | "stop";
  /** Optional caption chip shown above the pin. */
  label?: string;
  /** Pin head diameter in px. Default 44. */
  size?: number;
  style?: React.CSSProperties;
}

export declare function MapPin(props: MapPinProps): JSX.Element;
