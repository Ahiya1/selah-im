// src/components/bubbles/ExperienceBubble.tsx - SELAH Experience Bubble - SESSION-BASED
// Technology that breathes with you - Clean session-based chambers experience

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import { cn } from "@/lib/utils";
import type { PresentationSession, BubbleContent } from "@/lib/types";

interface ExperienceBubbleProps {
  sessionId: string;
  userContext: string;
  useAI: boolean;
  sessionData: any;
  onBreathingInteraction: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onComplete?: () => void;
  bubbleIndex?: number;
  isActive?: boolean;
  isComplete?: boolean;
}

const ExperienceBubble: React.FC<ExperienceBubbleProps> = ({
  sessionId,
  isActive = false,
  isComplete = false,
  onNavigateNext,
  onComplete,
  bubbleIndex = 2,
  ...bubbleProps
}) => {
  const [phase, setPhase] = useState<"streaming" | "interactive">("streaming");
  const [content, setContent] = useState<BubbleContent | null>(null);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [expandedChamber, setExpandedChamber] = useState<number | null>(null);

  // Fetch content when bubble becomes active
  useEffect(() => {
    if (isActive && sessionId) {
      fetchBubbleContent();
    }
  }, [isActive, sessionId]);

  /**
   * Fetch content from session API
   */
  const fetchBubbleContent = async () => {
    try {
      const response = await fetch(
        `/api/sessions/content?sessionId=${sessionId}&bubbleId=experience`
      );
      const result = await response.json();

      if (result.success) {
        const bubbleContent = result.data;
        setContent(bubbleContent);

        if (bubbleContent.hasStreamed) {
          setPhase("interactive");
        } else {
          startStreaming(bubbleContent.content);
        }
      }
    } catch (error) {
      console.error("Failed to fetch bubble content:", error);
      // Use fallback content
      setContent({
        content: "Four chambers for consciousness to explore itself.",
        isAI: false,
        isStreaming: false,
        hasStreamed: true,
      });
      setPhase("interactive");
    }
  };

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

        const delay = getContemplativeDelay(
          words[currentIndex - 1],
          currentIndex - 1,
          words.length
        );
        setTimeout(streamNextWord, delay);
      } else {
        setIsStreaming(false);
        setTimeout(() => {
          setPhase("interactive");
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

  // Chamber definitions
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
          {!content && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto">
                <div className="w-full h-full border-4 border-breathing-pink/30 border-t-breathing-pink rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 animate-breathe-slow">
                Crafting your chambers...
              </p>
            </div>
          )}

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

                {isStreaming && displayedWords.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-1 h-6 bg-breathing-pink animate-pulse rounded-full" />
                  </div>
                )}

                {content.isAI && !isStreaming && (
                  <div className="mt-6 text-center animate-breathe-in">
                    <p className="text-xs text-slate-500 italic">
                      ✨ AI Personalized
                    </p>
                  </div>
                )}

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
      <div className="w-full h-full flex flex-col items-center justify-center space-y-12 p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-stone">Four Chambers</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-breathing-green to-breathing-pink mx-auto rounded-full" />
        </div>

        {/* Chamber Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-2xl w-full">
          {chambers.map((chamber, index) => (
            <div
              key={chamber.id}
              className={cn(
                "relative cursor-pointer transition-all duration-500 ease-out",
                "flex flex-col items-center space-y-4",
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
                  "w-24 h-24 rounded-full bg-gradient-to-br",
                  chamber.color,
                  "flex items-center justify-center text-4xl",
                  "shadow-lg transition-all duration-500",
                  {
                    "hover:shadow-xl hover:scale-105": chamber.available,
                    "opacity-60": !chamber.available,
                    "shadow-2xl animate-breathe": expandedChamber === index,
                  }
                )}
              >
                {chamber.icon}

                {!chamber.available && (
                  <div className="absolute -top-1 -right-1 bg-white/90 rounded-full px-2 py-1 text-xs text-slate-600 font-medium">
                    Soon
                  </div>
                )}
              </div>

              {/* Chamber Info */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-stone mb-1">
                  {chamber.name}
                </h3>
                <p className="text-slate-600 text-sm">{chamber.description}</p>
              </div>

              {/* Expanded Details */}
              {expandedChamber === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-3xl p-6 text-center shadow-2xl">
                    <div className="space-y-3">
                      <div className="text-3xl">{chamber.icon}</div>
                      <h3 className="text-xl font-semibold text-stone">
                        {chamber.name}
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed max-w-xs">
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
      </div>
    </Bubble>
  );
};

export default ExperienceBubble;
