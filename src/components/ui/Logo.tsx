// src/components/ui/Logo.tsx - SELAH Logo Component
// Technology that breathes with you
// Brand identity and logo

import React from "react";
import Link from "next/link";
import type { Route } from "next";

interface LogoProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "minimal" | "text-only";
  className?: string;
  href?: Route | string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = "medium",
  variant = "default",
  className = "",
  href = "/",
  showText = true,
}) => {
  const sizeClasses = {
    small: {
      icon: "w-6 h-6 text-sm",
      text: "text-lg",
      container: "space-x-2",
    },
    medium: {
      icon: "w-8 h-8 text-base",
      text: "text-xl",
      container: "space-x-2",
    },
    large: {
      icon: "w-12 h-12 text-lg",
      text: "text-2xl",
      container: "space-x-3",
    },
  };

  const iconElement = (
    <div
      className={`
      ${sizeClasses[size].icon}
      bg-stone rounded-full 
      flex items-center justify-center 
      text-white font-bold 
      animate-breathe
      ${variant === "minimal" ? "bg-stone/80" : ""}
    `}
    >
      S
    </div>
  );

  const textElement = showText && variant !== "minimal" && (
    <span
      className={`
      text-stone font-semibold tracking-wide
      ${sizeClasses[size].text}
    `}
    >
      SELAH
    </span>
  );

  const logoContent = (
    <div
      className={`
      flex items-center 
      ${sizeClasses[size].container}
      transition-all duration-300 
      hover:opacity-80
      ${className}
    `}
    >
      {iconElement}
      {textElement}
    </div>
  );

  if (variant === "text-only") {
    const textOnlyContent = (
      <h1
        className={`
        text-stone font-bold tracking-wider animate-breathe
        ${size === "small" ? "text-2xl" : size === "medium" ? "text-4xl" : "text-6xl"}
        ${className}
      `}
      >
        SELAH
      </h1>
    );

    return href ? (
      <Link href={href as Route}>{textOnlyContent}</Link>
    ) : (
      textOnlyContent
    );
  }

  return href ? <Link href={href as Route}>{logoContent}</Link> : logoContent;
};

export default Logo;
