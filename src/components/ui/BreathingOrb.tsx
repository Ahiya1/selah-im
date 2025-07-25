// src/components/ui/BreathingOrb.tsx - SELAH Breathing Orb Component
// Technology that breathes with you
// Interactive meditation orb

import React, { useState, useCallback } from "react";
import type {
  BreathingOrbProps,
  BreathingOrbState,
  OrbEngagement,
} from "@/lib/types";

const BreathingOrb: React.FC<BreathingOrbProps> = ({
  size = "medium",
  variant = "default",
  onEngagement,
  className = "",
  disabled = false,
}) => {
  const [state, setState] = useState<BreathingOrbState>({
    currentState: "still",
    isActive: false,
    breathCycles: 0,
    sessionStartTime: null,
    lastStateChange: Date.now(),
  });

  const handleOrbClick = useCallback(() => {
    if (disabled) return;

    const now = Date.now();
    const engagement: OrbEngagement = {
      id: now.toString(),
      startTime: now,
      endTime: now + 1000,
      actions: [
        {
          type: "inhale",
          timestamp: now,
          duration: 1000,
        },
      ],
      totalDuration: 1000,
      breathCycles: 1,
    };

    setState((prev) => ({
      ...prev,
      breathCycles: prev.breathCycles + 1,
      lastStateChange: now,
    }));

    onEngagement?.(engagement);
  }, [disabled, onEngagement]);

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-breathing-green to-stone",
    demo: "bg-gradient-to-br from-breathing-blue to-breathing-green",
    meditation: "bg-gradient-to-br from-stone to-stone-light",
  };

  return (
    <button
      type="button"
      onClick={handleOrbClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        text-white text-6xl
        cursor-pointer
        transition-all duration-500 ease-in-out
        hover:scale-105
        shadow-lg hover:shadow-breathing-green/50
        animate-breathe
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Breathing meditation orb"
    >
      🧘
    </button>
  );
};

export default BreathingOrb;
