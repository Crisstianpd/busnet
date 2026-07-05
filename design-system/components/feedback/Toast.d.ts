import * as React from "react";
import type { IconName } from "../foundations/Icon";

/** Transient notice / inline alert with a colored accent rail. */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  title?: React.ReactNode;
  message?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  /** Override the default tone icon. */
  icon?: IconName;
  /** Optional action node rendered under the message (e.g. a Button). */
  action?: React.ReactNode;
  /** Shows a close (×) button when provided. */
  onClose?: () => void;
  style?: React.CSSProperties;
}

export declare function Toast(props: ToastProps): JSX.Element;
