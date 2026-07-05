import * as React from "react";

/**
 * Grid-based table row for the Fleet dashboard (unit table, checking log).
 *
 * @startingPoint section="Data" subtitle="Dashboard table row (header + data)" viewport="700x200"
 */
export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** Cell contents, left to right. */
  cells: React.ReactNode[];
  /** CSS grid-template-columns, e.g. "120px 1fr 80px 80px". */
  columns?: string;
  /** Renders the styled header row. */
  head?: boolean;
  selected?: boolean;
  /** Flash-in animation for a freshly appended log row. */
  entering?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export declare function TableRow(props: TableRowProps): JSX.Element;
