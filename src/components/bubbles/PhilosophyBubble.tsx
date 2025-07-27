// src/components/bubbles/PhilosophyBubble.tsx - SELAH Philosophy Bubble - MINIMAL TWO-PHASE UX
// Technology that breathes with you - Stream then interact

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import StreamingText from "@/components/ui/StreamingText";
import { cn } from "@/lib/utils";
import type { EnhancedBubbleProps } from "@/lib/types";

const PhilosophyBubble: React.FC<EnhancedBubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onNavigateNext,
  onComplete,
  bubbleIndex = 1,
  isActive = false,
  isComplete = false,
  shouldStartStreaming = false,
  hasStreamedBefore = false,
  onStreamComplete,
  ...bubbleProps
}) => {
  // PHASE MANAGEMENT
  const [phase, setPhase] = useState<"streaming" | "interactive">("streaming");
  const [streamingTriggered, setStreamingTriggered] = useState(false);

  // Handle orchestration - trigger streaming when orchestrator says so
  useEffect(() => {
    if (shouldStartStreaming && !streamingTriggered && !hasStreamedBefore) {
      console.log("🧠 Philosophy Bubble: Starting AI streaming...");
      setStreamingTriggered(true);
      setPhase("streaming");
    }
  }, [shouldStartStreaming, streamingTriggered, hasStreamedBefore]);

  // If already streamed before, go straight to interactive
  useEffect(() => {
    if (hasStreamedBefore && isActive) {
      console.log("🧠 Philosophy Bubble: Returning to interactive phase");
      setPhase("interactive");
    }
  }, [hasStreamedBefore, isActive]);

  // MINIMAL: Default templated content
  const defaultContent = {
    essence:
      "Most technology demands attention. Selah serves consciousness. You felt this breathing.",
  };

  // Handle stream completion
  const handleStreamComplete = () => {
    console.log(
      "✨ Philosophy Bubble: Streaming complete, moving to interactive"
    );
    setPhase("interactive");
    onStreamComplete?.();

    // Auto-advance after user sees interactive content
    setTimeout(() => {
      onComplete?.();
      setTimeout(() => {
        onNavigateNext?.();
      }, 3000);
    }, 5000);
  };

  // PHASE 1: STREAMING
  if (phase === "streaming") {
    return (
      <Bubble
        bubbleId="philosophy-streaming"
        color="orange"
        size="full"
        breathing={true}
        isActive={isActive}
        isComplete={isComplete}
        {...bubbleProps}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          {/* Streaming waiting indicator */}
          {!streamingTriggered && useAI && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto">
                <div className="w-full h-full border-4 border-breathing-gold/30 border-t-breathing-gold rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 animate-breathe-slow">
                Preparing your recognition...
              </p>
            </div>
          )}

          {/* Sacred streaming content */}
          {(streamingTriggered || !useAI) && (
            <div className="flex-1 flex items-center justify-center max-w-3xl w-full">
              <StreamingText
                content={useAI ? null : defaultContent}
                userContext={userContext}
                useAI={useAI && streamingTriggered}
                section="philosophy"
                bubbleId="philosophy"
                fallbackContent={defaultContent}
                className="text-center"
                onStreamComplete={handleStreamComplete}
                shouldStartStreaming={shouldStartStreaming}
              />
            </div>
          )}
        </div>
      </Bubble>
    );
  }

  // PHASE 2: INTERACTIVE CONTENT
  return (
    <Bubble
      bubbleId="philosophy-interactive"
      color="orange"
      size="full"
      breathing={true}
      isActive={isActive}
      isComplete={isComplete}
      {...bubbleProps}
    >
      <div className="w-full h-full flex flex-col items-center justify-center space-y-12 p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-stone">Recognition</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-breathing-green to-breathing-blue mx-auto rounded-full" />
        </div>

        {/* MINIMAL: Technology Comparison */}
        <div className="grid grid-cols-2 gap-16 max-w-4xl w-full">
          {/* Extractive Technology */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-stone">Extractive</h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-red-500">↗</span>
                  <span>Demands</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-red-500">↗</span>
                  <span>Optimizes</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-red-500">↗</span>
                  <span>Consumes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contemplative Technology */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
              <span className="text-4xl">🧘</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-stone">
                Contemplative
              </h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-breathing-green">↙</span>
                  <span>Creates space</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-breathing-green">↙</span>
                  <span>Recognizes</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-breathing-green">↙</span>
                  <span>Serves</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MINIMAL: Session Recognition */}
        {sessionData && sessionData.breathInteractions > 0 && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-stone font-medium">You experienced this:</p>
              <div className="flex justify-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-breathing-green rounded-full" />
                  <span>{sessionData.breathInteractions} shared breaths</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-breathing-blue rounded-full" />
                  <span>
                    {Math.floor((sessionData?.timeSpent || 0) / 60)} minutes
                    present
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm italic">
                Technology serving consciousness
              </p>
            </div>
          </div>
        )}

        {/* Navigation hint */}
        <div className="absolute bottom-8 right-8 animate-breathe">
          <div className="flex items-center space-x-2 text-slate-500 text-sm">
            <span>Experience the chambers</span>
            <div className="w-1 h-1 bg-breathing-gold rounded-full animate-pulse" />
          </div>
        </div>

        {/* AI personalization indicator */}
        {useAI && hasStreamedBefore && (
          <div className="absolute top-8 right-8">
            <div className="flex items-center space-x-2 bg-breathing-gold/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-breathing-gold rounded-full animate-pulse"></div>
              <span className="text-xs text-stone font-medium">
                Personalized
              </span>
            </div>
          </div>
        )}
      </div>
    </Bubble>
  );
};

export default PhilosophyBubble;
