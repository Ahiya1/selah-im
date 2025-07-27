// src/components/bubbles/WelcomeBubble.tsx - SELAH Welcome Bubble - FIXED
// Technology that breathes with you - Sacred entry space with breathing orb

"use client";

import React, { useState, useCallback } from "react";
import Bubble from "@/components/ui/Bubble";
import BreathingOrb from "@/components/ui/BreathingOrb";
import ContextForm from "@/components/ui/ContextForm";
import StreamingText from "@/components/ui/StreamingText";
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
  const [showContent, setShowContent] = useState(false);
  const [contextSubmitted, setContextSubmitted] = useState(false);

  // Handle breathing orb engagement
  const handleOrbEngagement = useCallback(
    (engagement: OrbEngagement) => {
      onBreathingInteraction?.();

      if (!hasInteracted) {
        setHasInteracted(true);
        // Show content after first breath interaction
        setTimeout(() => setShowContent(true), 800);
      }
    },
    [hasInteracted, onBreathingInteraction]
  );

  // Handle context form submission
  const handleContextSubmit = useCallback(
    (context: string) => {
      setContextSubmitted(true);
      onContextSubmit?.(context);

      if (!showContent) {
        setShowContent(true);
      }

      // Auto-advance to next bubble after content streams
      setTimeout(() => {
        onComplete?.();
        setTimeout(() => {
          onNavigateNext?.();
        }, 2000);
      }, 3000);
    },
    [showContent, onContextSubmit, onComplete, onNavigateNext]
  );

  // Default content for when AI is not used
  const defaultContent = {
    greeting: "You found your way here.",
    recognition:
      "Right now, you're breathing with technology that responds to you instead of demanding from you. Feel the difference?",
    invitation:
      "This is what we're building—technology that serves consciousness instead of consuming it.",
    transition: "Let me show you what this becomes...",
  };

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
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-8">
        {/* Top Navigation - Only show if not active or just activated */}
        {(!isActive || !hasInteracted) && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="nav-contemplative flex items-center space-x-8">
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

        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-12 max-w-2xl">
          {/* Sacred Breathing Space */}
          <div className="space-y-8 text-center">
            {/* Breathing Orb with Sacred Ripples */}
            <div className="relative">
              <div className="orb-sacred mx-auto relative">
                <BreathingOrb
                  size="large"
                  variant="bubble"
                  onEngagement={handleOrbEngagement}
                  bubbleContext={bubbleIndex}
                  className="w-full h-full text-6xl md:text-7xl lg:text-8xl shadow-breathing-green hover:shadow-breathing-blue transition-all duration-1000"
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
                <div
                  className="absolute inset-8 rounded-full border border-breathing-pink/20 animate-ping"
                  style={{ animationDuration: "5s", animationDelay: "2s" }}
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

            {/* Sacred Context Gathering */}
            <div
              className={cn("transition-all duration-1000 ease-out", {
                "opacity-100 transform translate-y-0": hasInteracted,
                "opacity-70 transform translate-y-4": !hasInteracted,
              })}
            >
              {!contextSubmitted && (
                <ContextForm
                  onSubmit={handleContextSubmit}
                  className="max-w-xl mx-auto"
                />
              )}
            </div>
          </div>

          {/* Sacred Content Streaming */}
          {showContent && (
            <div className="w-full max-w-3xl animate-breathe-in">
              <StreamingText
                content={useAI ? null : defaultContent}
                userContext={userContext}
                useAI={useAI && contextSubmitted}
                section="recognition"
                bubbleId="welcome"
                fallbackContent={defaultContent}
                className="space-y-8"
                onStreamComplete={() => {
                  // Content streaming complete
                  setTimeout(() => {
                    onComplete?.();
                  }, 1000);
                }}
              />
            </div>
          )}
        </div>

        {/* Sacred Session Recognition */}
        {sessionData && sessionData.breathInteractions > 0 && (
          <div className="absolute bottom-6 left-6 inline-flex items-center space-x-3 glass-light rounded-full px-4 py-2 animate-breathe-in">
            <div className="w-2 h-2 bg-breathing-green rounded-full animate-pulse" />
            <span className="text-stone text-sm font-medium">
              {sessionData.breathInteractions} breath
              {sessionData.breathInteractions === 1 ? "" : "s"} shared
            </span>
          </div>
        )}

        {/* Navigation hint - only show when content is complete */}
        {showContent && contextSubmitted && (
          <div className="absolute bottom-6 right-6 animate-breathe">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span>Continue breathing</span>
              <div className="w-1 h-1 bg-breathing-green rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Sacred completion indicator */}
        {contextSubmitted && showContent && (
          <div
            className={cn(
              "absolute top-8 right-8 w-3 h-3 rounded-full",
              "bg-breathing-green animate-pulse"
            )}
          />
        )}
      </div>
    </Bubble>
  );
};

export default WelcomeBubble;
