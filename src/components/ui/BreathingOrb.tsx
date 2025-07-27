// src/components/ui/BreathingOrb.tsx - SELAH Enhanced Breathing Orb Component
// Technology that breathes with you - Interactive meditation orb with bubble support

import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type {
  BreathingOrbProps,
  BreathingOrbState,
  OrbEngagement,
  OrbAction,
} from "@/lib/types";

const BreathingOrb: React.FC<BreathingOrbProps> = ({
  size = "medium",
  variant = "default",
  onEngagement,
  className = "",
  disabled = false,
  bubbleContext,
}) => {
  const [state, setState] = useState<BreathingOrbState>({
    currentState: "still",
    isActive: false,
    breathCycles: 0,
    sessionStartTime: null,
    lastStateChange: Date.now(),
  });

  const [touchPosition, setTouchPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: string; x: number; y: number }>
  >([]);
  const orbRef = useRef<HTMLButtonElement>(null);
  const engagementRef = useRef<OrbEngagement | null>(null);

  // Enhanced orb interaction handler
  const handleOrbInteraction = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;

      const rect = orbRef.current?.getBoundingClientRect();
      if (!rect) return;

      let clientX: number, clientY: number;

      if ("touches" in event) {
        clientX = event.touches[0]?.clientX || event.changedTouches[0]?.clientX;
        clientY = event.touches[0]?.clientY || event.changedTouches[0]?.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      // Calculate relative position within the orb
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      setTouchPosition({ x, y });
      setIsPressed(true);

      // Create ripple effect
      const rippleId = Date.now().toString();
      setRipples((prev) => [...prev, { id: rippleId, x, y }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 1000);

      const now = Date.now();

      // Create engagement if this is the start
      if (!engagementRef.current) {
        engagementRef.current = {
          id: now.toString(),
          startTime: now,
          endTime: now,
          actions: [],
          totalDuration: 0,
          breathCycles: 0,
        };
      }

      // Add action to engagement
      const action: OrbAction = {
        type: "inhale", // Will be determined by breathing pattern
        timestamp: now,
        duration: 0, // Will be calculated
        touchCoordinates: { x: clientX - rect.left, y: clientY - rect.top },
      };

      if (engagementRef.current) {
        engagementRef.current.actions.push(action);
        engagementRef.current.endTime = now;
        engagementRef.current.totalDuration =
          now - engagementRef.current.startTime;
      }

      // Update orb state
      setState((prev) => ({
        ...prev,
        breathCycles: prev.breathCycles + 1,
        lastStateChange: now,
        isActive: true,
        currentState: "inhale",
        sessionStartTime: prev.sessionStartTime || now,
      }));

      // Trigger breathing cycle
      setTimeout(() => {
        setState((prev) => ({ ...prev, currentState: "exhale" }));

        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            currentState: "still",
            isActive: false,
          }));

          // Complete engagement after breathing cycle
          if (engagementRef.current) {
            const finalEngagement = { ...engagementRef.current };
            finalEngagement.breathCycles = 1;
            onEngagement?.(finalEngagement);
            engagementRef.current = null;
          }

          setIsPressed(false);
        }, 2000); // Exhale for 2 seconds
      }, 2000); // Inhale for 2 seconds
    },
    [disabled, onEngagement]
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      handleOrbInteraction(event);
    },
    [handleOrbInteraction]
  );

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setIsPressed(false);
  }, []);

  // Size configuration
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  // Variant configuration with enhanced bubble support
  const variantClasses = {
    default: "bg-gradient-to-br from-breathing-green to-stone",
    demo: "bg-gradient-to-br from-breathing-blue to-breathing-green",
    meditation: "bg-gradient-to-br from-stone to-stone-light",
    bubble:
      "bg-gradient-to-br from-breathing-green via-breathing-blue to-stone",
  };

  // Enhanced breathing animation based on state
  const getBreathingClasses = () => {
    const baseClasses = "transition-all duration-2000 ease-in-out";

    switch (state.currentState) {
      case "inhale":
        return cn(baseClasses, "scale-110 shadow-breathing-blue/50");
      case "exhale":
        return cn(baseClasses, "scale-90 shadow-breathing-pink/50");
      case "still":
      default:
        return cn(baseClasses, "scale-100 shadow-breathing-green/50");
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main Orb Button */}
      <button
        ref={orbRef}
        type="button"
        onClick={handleOrbInteraction}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={disabled}
        className={cn(
          // Base styles
          sizeClasses[size],
          variantClasses[variant],
          "rounded-full flex items-center justify-center",
          "text-white text-6xl cursor-pointer select-none",
          "shadow-lg border-2 border-white/20",
          "focus:outline-none focus:ring-4 focus:ring-breathing-green/30",

          // Breathing animation
          getBreathingClasses(),

          // Hover effects
          "hover:scale-105 hover:shadow-xl",

          // Active/pressed state
          {
            "scale-95": isPressed,
            "animate-pulse": state.isActive,
          },

          // Disabled state
          {
            "opacity-50 cursor-not-allowed": disabled,
          },

          className
        )}
        aria-label="Breathing meditation orb"
        aria-pressed={state.isActive}
        data-bubble-context={bubbleContext}
        data-breath-cycles={state.breathCycles}
      >
        {/* Orb Icon */}
        <span
          className={cn("transition-all duration-1000", {
            "transform scale-110": state.currentState === "inhale",
            "transform scale-90": state.currentState === "exhale",
            "transform scale-100": state.currentState === "still",
          })}
        >
          🧘
        </span>

        {/* Touch Ripple Effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full border-2 border-white/60 animate-ping pointer-events-none"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: "20px",
              height: "20px",
              transform: "translate(-50%, -50%)",
              animationDuration: "1s",
              animationIterationCount: "1",
            }}
          />
        ))}
      </button>

      {/* Ambient Breathing Rings */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border border-breathing-green/20 pointer-events-none",
          "animate-ping",
          {
            "opacity-100": state.isActive,
            "opacity-60": !state.isActive,
          }
        )}
        style={{ animationDuration: "3s" }}
      />

      <div
        className={cn(
          "absolute inset-2 rounded-full border border-breathing-blue/15 pointer-events-none",
          "animate-ping",
          {
            "opacity-80": state.isActive,
            "opacity-40": !state.isActive,
          }
        )}
        style={{ animationDuration: "4s", animationDelay: "0.5s" }}
      />

      <div
        className={cn(
          "absolute inset-4 rounded-full border border-breathing-pink/10 pointer-events-none",
          "animate-ping",
          {
            "opacity-60": state.isActive,
            "opacity-30": !state.isActive,
          }
        )}
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />

      {/* Breath Cycle Counter */}
      {state.breathCycles > 0 && bubbleContext !== undefined && (
        <div className="absolute -top-2 -right-2 bg-breathing-green text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-breathe">
          {state.breathCycles}
        </div>
      )}

      {/* Session Duration Indicator */}
      {state.sessionStartTime && bubbleContext !== undefined && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-stone">
          {Math.floor((Date.now() - state.sessionStartTime) / 1000)}s
        </div>
      )}

      {/* Breathing State Indicator */}
      {state.isActive && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className={cn(
              "text-white text-sm font-medium capitalize opacity-80",
              "transition-all duration-1000",
              {
                "scale-110": state.currentState === "inhale",
                "scale-90": state.currentState === "exhale",
                "scale-100": state.currentState === "still",
              }
            )}
          >
            {state.currentState === "inhale"
              ? "↑ Inhaling"
              : state.currentState === "exhale"
                ? "↓ Exhaling"
                : "◦ Still"}
          </div>
        </div>
      )}

      {/* Touch Guidance */}
      {!state.isActive && variant === "bubble" && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-slate-500 text-sm animate-breathe-slow">
            Touch to breathe together
          </p>
        </div>
      )}
    </div>
  );
};

export default BreathingOrb;
