import * as React from "react";
import type { IconName } from "../foundations/Icon";

export interface TabBarItem {
  id: string;
  label: string;
  icon: IconName;
}

/**
 * Bottom navigation bar for the passenger app.
 *
 * @startingPoint section="Navigation" subtitle="Mobile bottom tab bar" viewport="700x120"
 */
export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "onChange"> {
  items: TabBarItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export declare function TabBar(props: TabBarProps): JSX.Element;
