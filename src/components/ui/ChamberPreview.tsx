// src/components/ui/ChamberPreview.tsx - SELAH Chamber Preview Component
// Technology that breathes with you
// Interactive chamber demonstration

import React, { useState, useEffect } from "react";

interface ChamberPreviewProps {
  chamber: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    available: boolean;
    preview?: React.ReactNode;
  };
  isActive?: boolean;
  onInteraction?: () => void;
  className?: string;
}

const ChamberPreview: React.FC<ChamberPreviewProps> = ({
  chamber,
  isActive = false,
  onInteraction,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Breathing animation cycle for inactive chambers
  useEffect(() => {
    if (!isActive) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % 3);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getAnimationClasses = () => {
    if (isActive) {
      return "scale-110 shadow-2xl";
    }

    switch (animationPhase) {
      case 0:
        return "scale-100";
      case 1:
        return "scale-105";
      case 2:
        return "scale-100";
      default:
        return "scale-100";
    }
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-1000 ease-in-out
        ${getAnimationClasses()}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onInteraction}
    >
      {/* Main Chamber Circle */}
      <div
        className={`
          w-64 h-64 rounded-full
          bg-gradient-to-br ${chamber.color}
          flex items-center justify-center
          text-7xl
          shadow-lg
          transition-all duration-500
          ${isHovered ? "shadow-xl transform rotate-3" : ""}
          ${!chamber.available ? "opacity-75" : ""}
        `}
      >
        {chamber.icon}
      </div>

      {/* Availability Badge */}
      {!chamber.available && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-slate-600 font-medium">
          Soon
        </div>
      )}

      {/* Interactive Glow Effect */}
      {isActive && (
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-br ${chamber.color}
            opacity-30 blur-xl
            animate-pulse
          `}
        />
      )}

      {/* Hover Preview */}
      {isHovered && chamber.preview && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-lg p-4 shadow-lg min-w-64">
            {chamber.preview}
          </div>
        </div>
      )}

      {/* Chamber Name */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <h3 className="text-xl font-semibold text-stone">{chamber.name}</h3>
        <p className="text-sm text-slate-600 mt-1">{chamber.description}</p>
      </div>
    </div>
  );
};

export default ChamberPreview;
