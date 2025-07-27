// src/components/bubbles/ExperienceBubble.tsx - SELAH Experience Bubble - FIXED TIMING
// Technology that breathes with you - Proper two-phase orchestration

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import StreamingText from "@/components/ui/StreamingText";
import { cn } from "@/lib/utils";
import type { EnhancedBubbleProps } from "@/lib/types";

const ExperienceBubble: React.FC<EnhancedBubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onNavigateNext,
  onComplete,
  bubbleIndex = 2,
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
  const [expandedChamber, setExpandedChamber] = useState<number | null>(null);

  // FIXED: Handle orchestration - only trigger streaming when explicitly told
  useEffect(() => {
    if (shouldStartStreaming && !streamingTriggered && isActive) {
      console.log("🏛️ Experience Bubble: Starting AI streaming...");
      setStreamingTriggered(true);
      setPhase("streaming");
    }
  }, [shouldStartStreaming, streamingTriggered, isActive]);

  // FIXED: Only return to interactive if we've actually streamed before AND we're not currently supposed to stream
  useEffect(() => {
    if (hasStreamedBefore && isActive && !shouldStartStreaming) {
      console.log("🏛️ Experience Bubble: Returning to interactive phase");
      setPhase("interactive");
    }
  }, [hasStreamedBefore, isActive, shouldStartStreaming]);

  // FIXED: Reset streaming state when bubble becomes inactive
  useEffect(() => {
    if (!isActive) {
      setStreamingTriggered(false);
    }
  }, [isActive]);

  // MINIMAL: Default templated content
  const defaultContent = {
    essence: "Four chambers for consciousness to explore itself.",
  };

  // MINIMAL: Chamber definitions
  const chambers = [
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧘",
      color: "from-breathing-green to-emerald-600",
      description: "Breathing partnership",
      available: true,
    },
    {
      id: "contemplation",
      name: "Questions",
      icon: "❓",
      color: "from-breathing-gold to-amber-600",
      description: "Personal inquiries",
      available: true,
    },
    {
      id: "creative",
      name: "Creative",
      icon: "🎨",
      color: "from-breathing-pink to-rose-600",
      description: "Art from presence",
      available: false,
    },
    {
      id: "being-seen",
      name: "Being Seen",
      icon: "👁️",
      color: "from-breathing-blue to-blue-600",
      description: "Recognition",
      available: false,
    },
  ];

  // Handle stream completion
  const handleStreamComplete = () => {
    console.log(
      "✨ Experience Bubble: Streaming complete, moving to interactive"
    );
    setPhase("interactive");
    onStreamComplete?.();
  };

  // Handle chamber interaction
  const handleChamberClick = (index: number) => {
    if (!chambers[index].available) return;

    setExpandedChamber(expandedChamber === index ? null : index);

    // Auto-advance after chamber exploration
    if (expandedChamber === null) {
      setTimeout(() => {
        onComplete?.();
        setTimeout(() => {
          onNavigateNext?.();
        }, 2000);
      }, 4000);
    }
  };

  // PHASE 1: STREAMING
  if (phase === "streaming") {
    return (
      <Bubble
        bubbleId="experience-streaming"
        color="purple"
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
                <div className="w-full h-full border-4 border-breathing-pink/30 border-t-breathing-pink rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 animate-breathe-slow">
                Crafting your chambers...
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
                section="chambers"
                bubbleId="experience"
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

  // PHASE 2: INTERACTIVE CHAMBERS
  return (
    <Bubble
      bubbleId="experience-interactive"
      color="purple"
      size="full"
      breathing={true}
      isActive={isActive}
      isComplete={isComplete}
      {...bubbleProps}
    >
      <div className="w-full h-full flex flex-col items-center justify-center space-y-10 p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-stone">Four Chambers</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-breathing-green to-breathing-pink mx-auto rounded-full" />
        </div>

        {/* MINIMAL: Chamber Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
          {chambers.map((chamber, index) => (
            <div
              key={chamber.id}
              className={cn(
                "relative cursor-pointer transition-all duration-500 ease-out",
                "flex flex-col items-center space-y-3",
                {
                  "scale-110 z-10": expandedChamber === index,
                  "scale-95 opacity-60":
                    expandedChamber !== null && expandedChamber !== index,
                  "cursor-not-allowed": !chamber.available,
                }
              )}
              onClick={() => handleChamberClick(index)}
            >
              {/* Chamber Orb */}
              <div
                className={cn(
                  "w-20 h-20 rounded-full bg-gradient-to-br",
                  chamber.color,
                  "flex items-center justify-center text-3xl",
                  "shadow-lg transition-all duration-500",
                  {
                    "hover:shadow-xl hover:scale-105": chamber.available,
                    "opacity-60": !chamber.available,
                    "shadow-2xl animate-breathe": expandedChamber === index,
                  }
                )}
              >
                {chamber.icon}

                {/* Availability Badge */}
                {!chamber.available && (
                  <div className="absolute -top-1 -right-1 bg-white/90 rounded-full px-2 py-1 text-xs text-slate-600 font-medium">
                    Soon
                  </div>
                )}
              </div>

              {/* Chamber Info */}
              <div className="text-center">
                <h3 className="text-base font-semibold text-stone mb-1">
                  {chamber.name}
                </h3>
                <p className="text-slate-600 text-xs">{chamber.description}</p>
              </div>

              {/* Expanded Details */}
              {expandedChamber === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl p-4 text-center shadow-2xl max-w-xs">
                    <div className="space-y-2">
                      <div className="text-2xl">{chamber.icon}</div>
                      <h3 className="text-lg font-semibold text-stone">
                        {chamber.name}
                      </h3>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {chamber.id === "meditation" &&
                          "Touch-responsive breathing orb that learns your rhythm. Technology as meditation partner."}
                        {chamber.id === "contemplation" &&
                          "AI-generated questions from your own patterns. Recognition without judgment."}
                        {chamber.id === "creative" &&
                          "Art emerging from contemplative states. Expression beyond words."}
                        {chamber.id === "being-seen" &&
                          "Ephemeral AI conversations. Recognition without transcripts."}
                      </p>
                      {chamber.available && (
                        <div className="text-breathing-green text-xs font-medium">
                          Available Now
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Exploration hint */}
        {expandedChamber === null && (
          <div className="text-center animate-breathe">
            <p className="text-slate-600 text-sm">
              Touch any chamber to explore
            </p>
          </div>
        )}

        {/* Navigation hint */}
        {expandedChamber !== null && (
          <div className="absolute bottom-8 right-8 animate-breathe">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span>Join the journey</span>
              <div className="w-1 h-1 bg-breathing-pink rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* AI personalization indicator */}
        {useAI && hasStreamedBefore && (
          <div className="absolute top-8 right-8">
            <div className="flex items-center space-x-2 bg-breathing-pink/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-breathing-pink rounded-full animate-pulse"></div>
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

export default ExperienceBubble;
