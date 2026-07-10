import * as React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /**
   * Background context for the logo:
   * - "dark" (default): white / light backgrounds → standard wordmark
   * - "light": non-white backgrounds (navy, teal, photos) → high-contrast wordmark
   */
  variant?: "light" | "dark";
  /** Full wordmark (default) or icon-only mark */
  mark?: "full" | "icon";
}

const sizeMap = {
  sm: "h-8",
  md: "h-9 md:h-10",
  lg: "h-12 md:h-14",
};

function fullLogoSrc(variant: "light" | "dark") {
  // On anything but white, use solid-white wordmark for contrast on navy
  return variant === "light"
    ? "/spawn-crest-logo-on-dark.png?v=3"
    : "/spawn-crest-logo.png";
}

export function Logo({
  className,
  size = "md",
  variant = "dark",
  mark = "full",
}: LogoProps) {
  const heightClass = sizeMap[size];
  const isIcon = mark === "icon";
  const src = isIcon ? "/spawn-crest-mark.png" : fullLogoSrc(variant);

  return (
    <div className={`inline-flex items-center ${className || ""}`}>
      <img
        src={src}
        alt="Spawn Crest - Premium Plumbing Solutions"
        className={`${heightClass} w-auto object-contain`}
        width={isIcon ? (size === "lg" ? 70 : size === "sm" ? 40 : 50) : size === "lg" ? 280 : size === "sm" ? 160 : 200}
        height={size === "lg" ? 70 : size === "sm" ? 40 : 50}
      />
    </div>
  );
}
