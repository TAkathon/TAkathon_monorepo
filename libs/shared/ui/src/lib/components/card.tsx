import { type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds extra inner padding (default: true) */
  padded?: boolean;
}

export function Card({
  padded = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`glass rounded-xl ${padded ? "p-5" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({
  className = "",
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}
