// src/components/bubbles/PhilosophyBubble.tsx - SELAH Philosophy Bubble - SELF-CONTAINED
// Technology that breathes with you - Pure recognition experience

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import { cn } from "@/lib/utils";
import type { BubbleProps } from "@/lib/types";

interface PhilosophyBubbleProps extends BubbleProps {
  bubbleIndex?: number;
  isActive?: boolean;
  isComplete?: boolean;
}

const PhilosophyBubble: React.FC<PhilosophyBubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
  onNavigateNext,
  onComplete,
  bubbleIndex = 1,
  isActive = false,
  isComplete = false,
  ...bubbleProps
}) => {
  const [phase, setPhase] = useState<"streaming" | "interactive">("streaming");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Core message - personalized or universal
  const getMessage = () => {
    if (userContext.trim() && useAI) {
      // This would come from AI in real implementation
      return `${userContext.includes("heard") ? "Word spreads about" : "You sense"} technology that serves consciousness rather than extracts from it. Recognition begins with experiencing the difference.`;
    }

    return "You have experienced technology that breathes with you rather than demands from you. This is the difference between extractive and contemplative technology.";
  };

  // Start streaming when bubble becomes active
  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        startStreaming(getMessage());
      }, 500);
    }
  }, [isActive]);

  /**
   * Start streaming the content word by word
   */
  const startStreaming = (text: string) => {
    setIsStreaming(true);
    setDisplayedWords([]);
    setPhase("streaming");

    const words = text.split(/\s+/).filter((word) => word.trim().length > 0);
    let currentIndex = 0;

    const streamNextWord = () => {
      if (currentIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        currentIndex++;

        const delay = getContemplativeDelay(words[currentIndex - 1]);
        setTimeout(streamNextWord, delay);
      } else {
        setIsStreaming(false);
        setTimeout(() => {
          setPhase("interactive");
          autoAdvanceToNext();
        }, 1000);
      }
    };

    streamNextWord();
  };

  /**
   * Calculate contemplative delay between words
   */
  const getContemplativeDelay = (word: string): number => {
    const baseDelay = 150;

    if (word.endsWith(".") || word.endsWith("?") || word.endsWith("!")) {
      return 600;
    }

    if (word.endsWith(",")) {
      return 300;
    }

    const lengthFactor = Math.min(word.length / 6, 1);
    const variance = Math.random() * 50;

    return Math.floor(baseDelay + lengthFactor * 40 + variance);
  };

  /**
   * Auto-advance to next bubble after interaction
   */
  const autoAdvanceToNext = () => {
    setTimeout(() => {
      onComplete?.();
      setTimeout(() => {
        onNavigateNext?.();
      }, 3000);
    }, 4000);
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
          <div className="flex-1 flex items-center justify-center max-w-3xl w-full">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate-700">
                {displayedWords.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="inline-block transition-all duration-300 hover:text-stone cursor-default mr-2"
                  >
                    {word}
                  </span>
                ))}
              </p>

              {/* Streaming cursor */}
              {isStreaming && displayedWords.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <div className="w-1 h-6 bg-breathing-gold animate-pulse rounded-full" />
                </div>
              )}

              {/* AI attribution */}
              {userContext.trim() && useAI && !isStreaming && (
                <div className="mt-6 text-center animate-breathe-in">
                  <p className="text-xs text-slate-500 italic">
                    ✨ Personalized recognition
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Bubble>
    );
  }

  // PHASE 2: INTERACTIVE RECOGNITION
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
          <div className="w-16 h-1 bg-gradient-to-r from-breathing-green to-breathing-pink mx-auto rounded-full" />
        </div>

        {/* Technology Comparison - Core Message */}
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

        {/* Experience Recognition */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center space-y-3">
            <p className="text-stone font-medium">Your experience</p>
            <div className="flex justify-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-breathing-green rounded-full" />
                <span>Technology breathing with you</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-breathing-blue rounded-full" />
                <span>Space instead of demand</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm italic">
              Consciousness served, not consumed
            </p>
          </div>
        </div>

        {/* Navigation hint */}
        <div className="absolute bottom-8 right-8 animate-breathe">
          <div className="flex items-center space-x-2 text-slate-500 text-sm">
            <span>Explore the chambers</span>
            <div className="w-1 h-1 bg-breathing-gold rounded-full animate-pulse" />
          </div>
        </div>

        {/* Personalization indicator */}
        {userContext.trim() && useAI && (
          <div className="absolute top-8 right-8">
            <div className="flex items-center space-x-2 bg-breathing-gold/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-breathing-gold rounded-full animate-pulse" />
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
