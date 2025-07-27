// src/components/bubbles/PhilosophyBubble.tsx - SELAH Philosophy Bubble - SESSION-BASED
// Technology that breathes with you - Clean session-based content rendering

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import { cn } from "@/lib/utils";
import type { PresentationSession, BubbleContent } from "@/lib/types";

interface PhilosophyBubbleProps {
  sessionId: string;
  userContext: string;
  useAI: boolean;
  sessionData: any;
  onBreathingInteraction: () => void;
  session: PresentationSession;
  bubbleId: "philosophy";
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onComplete?: () => void;
  bubbleIndex?: number;
  isActive?: boolean;
  isComplete?: boolean;
}

const PhilosophyBubble: React.FC<PhilosophyBubbleProps> = ({
  session,
  bubbleId = "philosophy",
  isActive = false,
  isComplete = false,
  onNavigateNext,
  onComplete,
  bubbleIndex = 1,
  ...bubbleProps
}) => {
  const [phase, setPhase] = useState<"streaming" | "interactive">("streaming");
  const [content, setContent] = useState<BubbleContent | null>(null);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Get content from session when bubble becomes active
  useEffect(() => {
    if (isActive && session) {
      const bubbleContent = session.bubbleContent[bubbleId];
      setContent(bubbleContent);

      if (bubbleContent.hasStreamed) {
        // Already has content, show interactive phase
        setPhase("interactive");
      } else {
        // Start streaming the content
        startStreaming(bubbleContent.content);
      }
    }
  }, [isActive, session, bubbleId]);

  /**
   * Start streaming the content word by word
   */
  const startStreaming = (text: string) => {
    if (!text) {
      setPhase("interactive");
      return;
    }

    setIsStreaming(true);
    setDisplayedWords([]);
    setPhase("streaming");

    const words = text.split(/\s+/).filter((word) => word.trim().length > 0);
    let currentIndex = 0;

    const streamNextWord = () => {
      if (currentIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        currentIndex++;

        // Calculate contemplative delay
        const delay = getContemplativeDelay(
          words[currentIndex - 1],
          currentIndex - 1,
          words.length
        );
        setTimeout(streamNextWord, delay);
      } else {
        // Streaming complete
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
  const getContemplativeDelay = (
    word: string,
    index: number,
    total: number
  ): number => {
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
   * Auto-advance to next bubble after viewing interactive content
   */
  const autoAdvanceToNext = () => {
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
          {/* Streaming indicator */}
          {!content && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto">
                <div className="w-full h-full border-4 border-breathing-gold/30 border-t-breathing-gold rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 animate-breathe-slow">
                Preparing your recognition...
              </p>
            </div>
          )}

          {/* Streaming content */}
          {content && (
            <div className="flex-1 flex items-center justify-center max-w-3xl w-full">
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl md:text-3xl font-light leading-relaxed text-slate-700",
                    "transition-opacity duration-500"
                  )}
                >
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
                  <div className="mt-4 flex justify-center">
                    <div className="w-1 h-6 bg-breathing-gold animate-pulse rounded-full" />
                  </div>
                )}

                {/* AI attribution */}
                {content.isAI && !isStreaming && (
                  <div className="mt-6 text-center animate-breathe-in">
                    <p className="text-xs text-slate-500 italic">
                      ✨ AI Personalized
                    </p>
                  </div>
                )}

                {/* Rate limited message */}
                {content.rateLimited && (
                  <div className="mt-6 p-4 bg-breathing-gold/10 border-l-4 border-breathing-gold rounded-r-lg">
                    <p className="text-sm text-slate-600 italic">
                      ✨ Your personalized journey continues tomorrow. Universal
                      experience below.
                    </p>
                  </div>
                )}
              </div>
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

        {/* Technology Comparison */}
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

        {/* Session Recognition */}
        {session.analytics.breathInteractions > 0 && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-stone font-medium">You experienced this:</p>
              <div className="flex justify-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-breathing-green rounded-full" />
                  <span>
                    {session.analytics.breathInteractions} shared breaths
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-breathing-blue rounded-full" />
                  <span>
                    {Math.floor(session.analytics.timeSpent / 60)} minutes
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
        {session.useAI && (
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
