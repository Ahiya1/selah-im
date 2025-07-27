// src/components/ui/Bubble.tsx - SELAH Sacred Bubble Component
// Technology that breathes with you
// Individual contemplative container for content

"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { BubbleColor, BubbleComponentProps } from "@/lib/types";

interface BubbleProps extends BubbleComponentProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
  variant?: "default" | "minimal" | "glass";
  breathing?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

const Bubble: React.FC<BubbleProps> = ({
  children,
  bubbleId,
  isActive,
  isComplete,
  color = "green",
  size = "large",
  variant = "default",
  breathing = true,
  interactive = true,
  className = "",
  onActivate,
  onComplete,
  onEnter,
  onLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Handle activation transitions
  useEffect(() => {
    if (isActive) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Intersection observer for auto-activation
  useEffect(() => {
    if (!interactive || !bubbleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter?.();
            if (!isActive) {
              onActivate?.();
            }
          } else {
            onLeave?.();
          }
        });
      },
      {
        threshold: 0.5, // Activate when 50% visible
        rootMargin: "-10% 0px -10% 0px", // Add some margin
      }
    );

    observer.observe(bubbleRef.current);

    return () => observer.disconnect();
  }, [interactive, isActive, onActivate, onEnter, onLeave]);

  const colorClasses = {
    green: {
      border: "border-breathing-green",
      bg: "bg-breathing-green/5",
      shadow: "shadow-breathing-green/20",
      glow: "bg-breathing-green/30",
    },
    orange: {
      border: "border-breathing-gold",
      bg: "bg-breathing-gold/5",
      shadow: "shadow-breathing-gold/20",
      glow: "bg-breathing-gold/30",
    },
    purple: {
      border: "border-breathing-pink",
      bg: "bg-breathing-pink/5",
      shadow: "shadow-breathing-pink/20",
      glow: "bg-breathing-pink/30",
    },
    blue: {
      border: "border-breathing-blue",
      bg: "bg-breathing-blue/5",
      shadow: "shadow-breathing-blue/20",
      glow: "bg-breathing-blue/30",
    },
  };

  const sizeClasses = {
    small: "w-64 h-64 max-w-sm",
    medium: "w-80 h-80 max-w-md",
    large: "w-96 h-96 max-w-lg",
    full: "w-[min(90vw,600px)] h-[min(90vh,600px)] max-w-2xl",
  };

  const variantClasses = {
    default: "bg-white/70 backdrop-blur-md border-2",
    minimal: "bg-white/50 backdrop-blur-sm border",
    glass: "bg-white/80 backdrop-blur-lg border",
  };

  return (
    <div
      ref={bubbleRef}
      className={cn(
        // Base bubble styles
        "relative rounded-full flex items-center justify-center",
        "transition-all duration-1000 ease-out",
        "cursor-pointer select-none",

        // Size
        sizeClasses[size],

        // Variant styling
        variantClasses[variant],

        // Color scheme
        colorClasses[color].border,
        colorClasses[color].bg,

        // State-based transforms
        {
          "scale-105": isActive && !isTransitioning,
          "scale-95": !isActive && interactive,
          "scale-100": !interactive,
          "opacity-90": !isActive && interactive,
          "opacity-100": isActive || !interactive,
          "shadow-2xl": isActive,
          "shadow-lg": !isActive,
        },

        // Breathing animation
        {
          "animate-breathe": breathing && isActive,
          "animate-breathe-slow": breathing && !isActive,
        },

        // Hover effects
        {
          "hover:scale-102": interactive && !isActive,
          "hover:shadow-xl": interactive,
        },

        // Completion state
        {
          "ring-4": isComplete,
          [`ring-${
            color === "green"
              ? "breathing-green"
              : color === "orange"
                ? "breathing-gold"
                : color === "purple"
                  ? "breathing-pink"
                  : "breathing-blue"
          }/50`]: isComplete,
        },

        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (interactive && !isActive) {
          onActivate?.();
        }
      }}
      role={interactive ? "button" : "presentation"}
      tabIndex={interactive ? 0 : -1}
      aria-label={interactive ? `Activate ${bubbleId} bubble` : undefined}
      data-bubble-id={bubbleId}
      data-active={isActive}
      data-complete={isComplete}
      {...props}
    >
      {/* Breathing glow effect */}
      {(isActive || isHovered) && (
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-1000",
            colorClasses[color].glow,
            {
              "opacity-30": isActive,
              "opacity-20": isHovered && !isActive,
              "animate-pulse": isActive,
            }
          )}
        />
      )}

      {/* Ripple effect on activation */}
      {isTransitioning && (
        <>
          <div
            className={cn(
              "absolute inset-0 rounded-full border-2 animate-ping",
              colorClasses[color].border,
              "opacity-75"
            )}
            style={{ animationDuration: "1s", animationIterationCount: "1" }}
          />
          <div
            className={cn(
              "absolute inset-4 rounded-full border animate-ping",
              colorClasses[color].border,
              "opacity-50"
            )}
            style={{
              animationDuration: "1.5s",
              animationIterationCount: "1",
              animationDelay: "0.2s",
            }}
          />
        </>
      )}

      {/* Content container */}
      <div
        className={cn(
          "relative z-10 w-full h-full rounded-full",
          "flex flex-col items-center justify-center",
          "p-8 text-center overflow-hidden",
          "transition-all duration-500"
        )}
      >
        {children}
      </div>

      {/* Completion indicator */}
      {isComplete && (
        <div
          className={cn(
            "absolute -top-2 -right-2 w-8 h-8 rounded-full",
            "bg-breathing-green text-white",
            "flex items-center justify-center text-sm font-bold",
            "animate-breathe shadow-lg"
          )}
        >
          ✓
        </div>
      )}

      {/* Active indicator */}
      {isActive && !isComplete && (
        <div
          className={cn(
            "absolute -top-1 -right-1 w-4 h-4 rounded-full",
            colorClasses[color].glow.replace("/30", ""),
            "animate-pulse"
          )}
        />
      )}

      {/* Accessibility focus indicator */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 ring-4 ring-stone/50",
          "transition-opacity duration-200",
          "focus-within:opacity-100"
        )}
      />
    </div>
  );
};

export default Bubble;

// Bubble variants for specific use cases
export const WelcomeBubble: React.FC<Omit<BubbleProps, "color">> = (props) => (
  <Bubble color="green" {...props} />
);

export const PhilosophyBubble: React.FC<Omit<BubbleProps, "color">> = (
  props
) => <Bubble color="orange" {...props} />;

export const ExperienceBubble: React.FC<Omit<BubbleProps, "color">> = (
  props
) => <Bubble color="purple" {...props} />;

export const JoinBubble: React.FC<Omit<BubbleProps, "color">> = (props) => (
  <Bubble color="blue" {...props} />
);
