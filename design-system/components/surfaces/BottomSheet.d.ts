import * as React from "react";

export type SheetSnap = "collapsed" | "half" | "expanded";

/**
 * Bottom sheet that floats over the map with three snap states.
 *
 * @startingPoint section="Surfaces" subtitle="Draggable bottom sheet over the map" viewport="700x420"
 */
export interface BottomSheetProps extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {
  /** Current snap state. Default "half". */
  snap?: SheetSnap;
  /** Called with the next snap when the handle is tapped. */
  onSnapChange?: (snap: SheetSnap) => void;
  /** Pixel heights per snap state. */
  heights?: { collapsed: number; half: number; expanded: number };
  /** Sticky header content shown above the scroll area. */
  header?: React.ReactNode;
  /** Show the grabber handle. Default true. */
  showHandle?: boolean;
  style?: React.CSSProperties;
}

export declare function BottomSheet(props: BottomSheetProps): JSX.Element;
