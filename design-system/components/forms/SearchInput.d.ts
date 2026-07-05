import * as React from "react";
import type { IconName } from "../foundations/Icon";

/**
 * Prominent destination search field ("¿A dónde vas?").
 *
 * @startingPoint section="Forms" subtitle="Large destination search field" viewport="700x120"
 */
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "style"> {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Shows a clear (×) button when value is non-empty and this is provided. */
  onClear?: () => void;
  placeholder?: string;
  /** Leading icon name. Default "search". */
  leadingIcon?: IconName;
  /** Trailing icon (e.g. "crosshair" for use-my-location) when no clear button. */
  trailingIcon?: IconName;
  /** Height preset — md 48 / lg 56. Default "lg". */
  size?: "md" | "lg";
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

export declare function SearchInput(props: SearchInputProps): JSX.Element;
