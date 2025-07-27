// src/components/ui/BubbleContainer.tsx - SELAH Bubble Navigation Container
// Technology that breathes with you
// Sacred navigation system between contemplative bubbles

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type {
  BubbleContainerState,
  BubbleTransition,
  BubbleConfig,
} from "@/lib/types";

interface BubbleContainerProps {
  children: React.ReactNode[];
  onBubbleChange?: (bubbleIndex: number) => void;
  onJourneyComplete?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  allowBackNavigation?: boolean;
  showIndicators?: boolean;
  className?: string;
}

const BubbleContainer: React.FC<BubbleContainerProps> = ({
  children,
  onBubbleChange,
  onJourneyComplete,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
  allowBackNavigation = true,
  showIndicators = true,
  className = "",
}) => {
  const [state, setState] = useState<BubbleContainerState>({
    currentBubble: 0,
    totalBubbles: children.length,
    isTransitioning: false,
    transitionDirection: null,
    completedBubbles: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle bubble navigation
  const navigateToBubble = useCallback(
    (targetIndex: number, direction: "forward" | "backward" = "forward") => {
      if (targetIndex < 0 || targetIndex >= state.totalBubbles) return;
      if (targetIndex === state.currentBubble) return;
      if (state.isTransitioning) return;

      // Check if trying to go to incomplete bubble
      if (!allowBackNavigation && targetIndex < state.currentBubble) return;

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        transitionDirection: direction,
      }));

      // Clear auto-advance timer
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }

      // Smooth scroll to target bubble
      const targetBubble = bubbleRefs.current[targetIndex];
      if (targetBubble) {
        targetBubble.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }

      // Update state after transition
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentBubble: targetIndex,
          isTransitioning: false,
          transitionDirection: null,
        }));

        onBubbleChange?.(targetIndex);

        // Set up auto-advance for next bubble if enabled
        if (autoAdvance && targetIndex < state.totalBubbles - 1) {
          autoAdvanceTimer.current = setTimeout(() => {
            navigateToBubble(targetIndex + 1, "forward");
          }, autoAdvanceDelay);
        }

        // Check if journey is complete
        if (targetIndex === state.totalBubbles - 1) {
          onJourneyComplete?.();
        }
      }, 1000);
    },
    [
      state.currentBubble,
      state.totalBubbles,
      state.isTransitioning,
      allowBackNavigation,
      autoAdvance,
      autoAdvanceDelay,
      onBubbleChange,
      onJourneyComplete,
    ]
  );

  // Handle next bubble
  const nextBubble = useCallback(() => {
    navigateToBubble(state.currentBubble + 1, "forward");
  }, [state.currentBubble, navigateToBubble]);

  // Handle previous bubble
  const prevBubble = useCallback(() => {
    if (allowBackNavigation) {
      navigateToBubble(state.currentBubble - 1, "backward");
    }
  }, [state.currentBubble, allowBackNavigation, navigateToBubble]);

  // Mark current bubble as completed
  const completeBubble = useCallback(
    (bubbleIndex?: number) => {
      const indexToComplete = bubbleIndex ?? state.currentBubble;

      setState((prev) => ({
        ...prev,
        completedBubbles: [
          ...new Set([...prev.completedBubbles, indexToComplete]),
        ],
      }));
    },
    [state.currentBubble]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (state.isTransitioning) return;

      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          nextBubble();
          break;
        case "ArrowLeft":
          event.preventDefault();
          prevBubble();
          break;
        case "Enter":
          event.preventDefault();
          completeBubble();
          break;
        case "Escape":
          // Reset to first bubble
          navigateToBubble(0, "backward");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    nextBubble,
    prevBubble,
    completeBubble,
    navigateToBubble,
    state.isTransitioning,
  ]);

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (state.isTransitioning) return;

      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Check if it's a horizontal swipe (not vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - previous bubble
          prevBubble();
        } else {
          // Swipe left - next bubble
          nextBubble();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [nextBubble, prevBubble, state.isTransitioning]);

  // Cleanup auto-advance timer
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-screen overflow-hidden",
        "bg-gradient-to-br from-slate-50 to-emerald-50",
        className
      )}
      role="main"
      aria-label="Contemplative bubble journey"
    >
      {/* Background breathing pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2d5a3d 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Breathing gradient overlay */}
      <div
        className={cn(
          "fixed inset-0 opacity-30 pointer-events-none transition-all duration-2000",
          "animate-breathe-slow",
          {
            "opacity-40": state.isTransitioning,
          }
        )}
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            rgba(45, 90, 61, 0.1) 0%, 
            rgba(45, 90, 61, 0.05) 40%, 
            transparent 70%
          )`,
        }}
      />

      {/* Bubble content area */}
      <div
        className={cn(
          "relative z-10 w-full h-full",
          "flex items-center justify-center",
          "scroll-smooth snap-y snap-mandatory overflow-y-auto scrollbar-hide",
          {
            "pointer-events-none": state.isTransitioning,
          }
        )}
      >
        {/* Individual bubbles */}
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => (bubbleRefs.current[index] = el)}
            className={cn(
              "w-full h-screen flex items-center justify-center snap-center",
              "transition-all duration-1000 ease-out",
              {
                "opacity-100 scale-100": index === state.currentBubble,
                "opacity-50 scale-95":
                  index !== state.currentBubble &&
                  Math.abs(index - state.currentBubble) === 1,
                "opacity-0 scale-90": Math.abs(index - state.currentBubble) > 1,
                "transform translate-y-8":
                  index > state.currentBubble &&
                  state.transitionDirection === "forward",
                "transform -translate-y-8":
                  index < state.currentBubble &&
                  state.transitionDirection === "backward",
              }
            )}
            data-bubble-index={index}
            data-active={index === state.currentBubble}
            data-completed={state.completedBubbles.includes(index)}
          >
            {/* Clone child with additional props */}
            {React.cloneElement(child as React.ReactElement, {
              isActive: index === state.currentBubble,
              isComplete: state.completedBubbles.includes(index),
              onComplete: () => completeBubble(index),
              onNavigateNext: nextBubble,
              onNavigatePrev: prevBubble,
              bubbleIndex: index,
            })}
          </div>
        ))}
      </div>

      {/* Bubble indicators */}
      {showIndicators && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-3">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToBubble(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  "hover:scale-125 focus:scale-125",
                  {
                    "bg-breathing-green scale-125 animate-breathe":
                      index === state.currentBubble,
                    "bg-stone/40":
                      index !== state.currentBubble &&
                      !state.completedBubbles.includes(index),
                    "bg-breathing-green/60":
                      index !== state.currentBubble &&
                      state.completedBubbles.includes(index),
                    "cursor-not-allowed opacity-50":
                      !allowBackNavigation && index < state.currentBubble,
                  }
                )}
                aria-label={`Navigate to bubble ${index + 1}`}
                disabled={!allowBackNavigation && index < state.currentBubble}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation arrows (optional) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {allowBackNavigation && state.currentBubble > 0 && (
            <button
              onClick={prevBubble}
              className={cn(
                "w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm",
                "border border-white/30 shadow-lg",
                "flex items-center justify-center",
                "text-stone hover:text-stone-dark",
                "transition-all duration-300 hover:scale-110",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={state.isTransitioning}
              aria-label="Previous bubble"
            >
              ←
            </button>
          )}

          {state.currentBubble < state.totalBubbles - 1 && (
            <button
              onClick={nextBubble}
              className={cn(
                "w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm",
                "border border-white/30 shadow-lg",
                "flex items-center justify-center",
                "text-stone hover:text-stone-dark",
                "transition-all duration-300 hover:scale-110",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={state.isTransitioning}
              aria-label="Next bubble"
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* Journey progress */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-stone">
            <span className="font-medium">
              {state.currentBubble + 1} of {state.totalBubbles}
            </span>
            <div className="w-2 h-2 bg-breathing-green rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Transition overlay */}
      {state.isTransitioning && (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none z-30",
            "transition-opacity duration-500",
            "bg-gradient-radial from-breathing-green/10 to-transparent"
          )}
        />
      )}
    </div>
  );
};

export default BubbleContainer;
