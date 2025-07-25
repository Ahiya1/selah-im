// src/components/ui/LoadingSpinner.tsx - SELAH Loading Spinner Component
// Technology that breathes with you
// Contemplative loading states

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "breathing" | "stone" | "minimal";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  variant = "breathing",
  className = "",
  text,
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const variants = {
    breathing: (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <div className="absolute inset-0 bg-breathing-green rounded-full animate-breathe opacity-75"></div>
        <div className="absolute inset-0 bg-breathing-blue rounded-full animate-breathe-slow opacity-50"></div>
        <div className="absolute inset-2 bg-breathing-pink rounded-full animate-breathe-fast opacity-25"></div>
      </div>
    ),
    stone: (
      <div
        className={`${sizeClasses[size]} bg-stone rounded-full animate-breathe ${className}`}
      >
        <div className="w-full h-full bg-stone-light rounded-full animate-breathe-slow opacity-75"></div>
      </div>
    ),
    minimal: (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg
          className="animate-spin text-stone"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    ),
  };

  if (text) {
    return (
      <div className="flex items-center space-x-3">
        {variants[variant]}
        <span className="text-slate-600 animate-breathe-slow">{text}</span>
      </div>
    );
  }

  return variants[variant];
};

export default LoadingSpinner;
