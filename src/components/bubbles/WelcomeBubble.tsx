// src/components/bubbles/WelcomeBubble.tsx - SELAH Welcome Bubble - MINIMAL CLEAN ENTRY
// Technology that breathes with you - Sacred entry space with breathing orb

"use client";

import React, { useState, useCallback } from "react";
import Bubble from "@/components/ui/Bubble";
import BreathingOrb from "@/components/ui/BreathingOrb";
import ContextForm from "@/components/ui/ContextForm";
import { cn } from "@/lib/utils";
import type { BubbleProps, OrbEngagement } from "@/lib/types";

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
  onJumpToSignup,
  bubbleIndex = 0,
  isActive = false,
  isComplete = false,
  ...bubbleProps
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [contextSubmitted, setContextSubmitted] = useState(false);
  const [showContextForm, setShowContextForm] = useState(false);

  // Handle breathing orb engagement
  const handleOrbEngagement = useCallback(
    (engagement: OrbEngagement) => {
      onBreathingInteraction?.();

      if (!hasInteracted) {
        setHasInteracted(true);
        // Show context form after first breath interaction
        setTimeout(() => setShowContextForm(true), 1000);
      }
    },
    [hasInteracted, onBreathingInteraction]
  );

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
        {/* Top Navigation - Clean & Minimal */}
        {(!hasInteracted || !contextSubmitted) && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold animate-breathe text-sm">
                  S
                </div>
                <span className="text-stone font-semibold tracking-wide">
                  SELAH
                </span>
              </div>

              {onJumpToSignup && (
                <button
                  onClick={onJumpToSignup}
                  className="text-slate-600 hover:text-stone transition-colors text-sm font-medium"
                >
                  Just sign me up
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content - Perfectly Centered */}
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-12 max-w-2xl">
          {/* Sacred Entry State */}
          {!hasInteracted && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light text-stone animate-breathe-slow">
                  You are here
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-breathing-green to-breathing-blue mx-auto rounded-full" />
              </div>

              {/* Sacred Breathing Orb */}
              <div className="relative">
                <div className="orb-sacred mx-auto relative">
                  <BreathingOrb
                    size="large"
                    variant="bubble"
                    onEngagement={handleOrbEngagement}
                    bubbleContext={bubbleIndex}
                    className="w-full h-full text-6xl md:text-7xl shadow-breathing-green hover:shadow-breathing-blue transition-all duration-1000"
                  />

                  {/* Sacred breathing ripples */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-breathing-green/30 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border border-breathing-blue/20 animate-ping"
                    style={{ animationDuration: "4s", animationDelay: "1s" }}
                  />
                </div>

                {/* Sacred Invitation */}
                <div className="text-center space-y-3 mt-8">
                  <p className="text-slate-600 text-xl font-light">◦ Breathe</p>
                  <p className="text-slate-500 text-sm">
                    Touch to share breath with technology
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Context Collection State */}
          {hasInteracted && showContextForm && !contextSubmitted && (
            <div className="w-full text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-light text-stone">
                  You felt the difference
                </h2>
                <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
                  Technology that responds instead of demands. What brought you
                  here?
                </p>
              </div>

              {/* Sacred Context Form */}
              <ContextForm
                onSubmit={handleContextSubmit}
                className="max-w-xl mx-auto"
                variant="bubble"
                placeholder="I heard about this from... I know that..."
                showSkipOption={true}
                autoFocus={true}
              />
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
                <p className="text-slate-600">
                  {userContext.trim()
                    ? "Breathing your context into contemplative technology..."
                    : "Technology that serves consciousness awaits..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sacred Session Recognition */}
        {sessionData && sessionData.breathInteractions > 0 && (
          <div className="absolute bottom-8 left-8 inline-flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 animate-breathe-in">
            <div className="w-2 h-2 bg-breathing-green rounded-full animate-pulse" />
            <span className="text-stone text-sm font-medium">
              {sessionData.breathInteractions} breath
              {sessionData.breathInteractions === 1 ? "" : "s"} shared
            </span>
          </div>
        )}

        {/* Navigation hint - only show when ready to continue */}
        {contextSubmitted && (
          <div className="absolute bottom-8 right-8 animate-breathe">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span>Recognition awaits</span>
              <div className="w-1 h-1 bg-breathing-green rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Completion indicator */}
        {contextSubmitted && (
          <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-breathing-green animate-pulse" />
        )}
      </div>
    </Bubble>
  );
};

export default WelcomeBubble;
