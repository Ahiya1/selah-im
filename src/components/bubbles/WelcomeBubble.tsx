// src/components/bubbles/WelcomeBubble.tsx - SELAH Welcome Bubble - SELF-CONTAINED
// Technology that breathes with you - Pure, focused entry experience

"use client";

import React, { useState, useCallback } from "react";
import Bubble from "@/components/ui/Bubble";
import ContextForm from "@/components/ui/ContextForm";
import { cn } from "@/lib/utils";
import type { BubbleProps } from "@/lib/types";

interface WelcomeBubbleProps extends BubbleProps {
  onContextSubmit?: (context: string) => void;
  onJumpToSignup?: () => void;
}

const WelcomeBubble: React.FC<WelcomeBubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
  onNavigateNext,
  onComplete,
  onContextSubmit,
  onJumpToSignup, // Accept but don't use - for compatibility
  bubbleIndex = 0,
  isActive = false,
  isComplete = false,
  ...bubbleProps
}) => {
  const [contextSubmitted, setContextSubmitted] = useState(false);

  // Handle context form submission
  const handleContextSubmit = useCallback(
    (context: string) => {
      setContextSubmitted(true);
      onContextSubmit?.(context);

      // Auto-advance to next bubble after context submission
      setTimeout(() => {
        onComplete?.();
        setTimeout(() => {
          onNavigateNext?.();
        }, 1500);
      }, 2000);
    },
    [onContextSubmit, onComplete, onNavigateNext]
  );

  return (
    <Bubble
      bubbleId="welcome"
      color="green"
      size="full"
      breathing={true}
      isActive={isActive}
      isComplete={isComplete}
      {...bubbleProps}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        {/* Sacred Brand Mark - Minimal */}
        {!contextSubmitted && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold animate-breathe text-sm">
                S
              </div>
              <span className="text-stone font-semibold tracking-wide">
                SELAH
              </span>
            </div>
          </div>
        )}

        {/* Main Content - Perfectly Centered */}
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-12 max-w-2xl">
          {/* Sacred Entry State */}
          {!contextSubmitted && (
            <div className="text-center space-y-12">
              {/* Sacred Title */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-light text-stone animate-breathe-slow">
                  You are here
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-breathing-green to-breathing-blue mx-auto rounded-full" />
              </div>

              {/* Sacred Question */}
              <div className="space-y-6">
                <h2 className="text-xl text-slate-700 font-light leading-relaxed max-w-lg mx-auto">
                  How did you find us and what do you know about Selah
                  <br />
                  and contemplative technology?
                </h2>
                <p className="text-sm text-slate-500 italic">
                  This helps create a more personal experience, or continue
                  without
                </p>
              </div>

              {/* Sacred Context Form */}
              <div className="w-full max-w-xl">
                <ContextForm
                  onSubmit={handleContextSubmit}
                  className="w-full"
                  variant="bubble"
                  placeholder="I heard about this from... I know that..."
                  showSkipOption={true}
                  autoFocus={false}
                />
              </div>
            </div>
          )}

          {/* Completion State */}
          {contextSubmitted && (
            <div className="text-center space-y-8">
              <div className="w-16 h-16 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
                <span className="text-breathing-green text-2xl">✓</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-light text-stone">
                  {userContext.trim()
                    ? "Creating your experience..."
                    : "Beginning the universal journey..."}
                </h2>
                <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                  {userContext.trim()
                    ? "Breathing your context into contemplative technology..."
                    : "The universal journey is equally profound..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Navigation Hint */}
        {contextSubmitted && (
          <div className="absolute bottom-8 right-8 animate-breathe">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span>Recognition awaits</span>
              <div className="w-1 h-1 bg-breathing-green rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </Bubble>
  );
};

export default WelcomeBubble;
