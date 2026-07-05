import * as React from "react";

/**
 * Live bus marker for the map: route number badge + directional nub.
 *
 * @startingPoint section="Map" subtitle="Live bus marker with route number" viewport="700x160"
 */
export interface BusMarkerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** Route number/label shown on the badge, e.g. "30B". */
  route?: string;
  /** Route color — a --route-N token or hex. */
  color?: string;
  /** Heading in degrees (0 = north); rotates the direction nub. */
  bearing?: number;
  /** Visual state. Default "moving". */
  state?: "moving" | "stopped" | "selected";
  /** Badge diameter in px (~40 reads well on the map). Default 40. */
  size?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export declare function BusMarker(props: BusMarkerProps): JSX.Element;
