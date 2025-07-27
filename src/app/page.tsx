// src/app/page.tsx - SELAH Sacred Bubble Journey Landing Page
// Technology that breathes with you - Four contemplative bubbles

"use client";

import React, { useState, useEffect, useRef } from "react";
import { generateSessionMetadata } from "@/lib/utils";
import type { EngagementData, BubbleJourneyData } from "@/lib/types";

// Bubble Components
import BubbleContainer from "@/components/ui/BubbleContainer";
import WelcomeBubble from "@/components/bubbles/WelcomeBubble";
import { cn } from "@/lib/utils";

// Temporary placeholder bubbles (will be built in next phase)
const PhilosophyBubble: React.FC<any> = ({
  isActive,
  onComplete,
  onNavigateNext,
  ...props
}) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className={cn(
        "w-96 h-96 rounded-full bg-gradient-to-br from-breathing-gold to-stone",
        "flex items-center justify-center text-white text-2xl font-bold",
        "shadow-lg transition-all duration-1000",
        {
          "scale-110 shadow-2xl": isActive,
          "scale-95 opacity-70": !isActive,
        }
      )}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">🤔</div>
        <div>Philosophy Bubble</div>
        <div className="text-sm opacity-80">Coming in next phase...</div>
      </div>
    </div>
  </div>
);

const ExperienceBubble: React.FC<any> = ({
  isActive,
  onComplete,
  onNavigateNext,
  ...props
}) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className={cn(
        "w-96 h-96 rounded-full bg-gradient-to-br from-breathing-pink to-stone",
        "flex items-center justify-center text-white text-2xl font-bold",
        "shadow-lg transition-all duration-1000",
        {
          "scale-110 shadow-2xl": isActive,
          "scale-95 opacity-70": !isActive,
        }
      )}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">✨</div>
        <div>Experience Bubble</div>
        <div className="text-sm opacity-80">Four chambers preview...</div>
      </div>
    </div>
  </div>
);

const JoinBubble: React.FC<any> = ({
  isActive,
  onComplete,
  onNavigateNext,
  ...props
}) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className={cn(
        "w-96 h-96 rounded-full bg-gradient-to-br from-breathing-blue to-stone",
        "flex items-center justify-center text-white text-2xl font-bold",
        "shadow-lg transition-all duration-1000",
        {
          "scale-110 shadow-2xl": isActive,
          "scale-95 opacity-70": !isActive,
        }
      )}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">📧</div>
        <div>Join Bubble</div>
        <div className="text-sm opacity-80">Email signup & completion...</div>
      </div>
    </div>
  </div>
);

export default function SelahHomePage(): JSX.Element {
  // Core state management
  const [userContext, setUserContext] = useState<string>("");
  const [useAI, setUseAI] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<EngagementData | null>(null);
  const [currentBubble, setCurrentBubble] = useState<number>(0);
  const [bubbleJourney, setBubbleJourney] = useState<BubbleJourneyData>({
    bubblesVisited: [0],
    timeInEachBubble: { 0: Date.now() },
    aiInteractions: 0,
    contextProvided: false,
    completedJourney: false,
    exitPoint: undefined,
  });

  const sessionStartTime = useRef<number>(Date.now());
  const bubbleStartTime = useRef<number>(Date.now());

  // Initialize session tracking
  useEffect(() => {
    const metadata = generateSessionMetadata();
    const initialSessionData: EngagementData = {
      sessionId: metadata.sessionId,
      timeSpent: 0,
      maxScroll: 0, // Deprecated for bubbles, but kept for compatibility
      breathInteractions: 0,
      orbEngagements: [],
      pageViews: [
        {
          path: "/",
          timestamp: new Date().toISOString(),
          timeSpent: 0,
          scrollDepth: 0,
          interactions: [],
          bubbleId: "welcome",
        },
      ],
      userAgent: metadata.userAgent,
      viewport: metadata.viewport,
      timestamp: new Date().toISOString(),
      bubbleJourney,
    };

    setSessionData(initialSessionData);
  }, []);

  // Track time spent in each bubble
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const totalTimeSpent = Math.floor(
        (now - sessionStartTime.current) / 1000
      );
      const bubbleTimeSpent = Math.floor(
        (now - bubbleStartTime.current) / 1000
      );

      setSessionData((prev) =>
        prev
          ? {
              ...prev,
              timeSpent: totalTimeSpent,
              bubbleJourney: {
                ...prev.bubbleJourney!,
                timeInEachBubble: {
                  ...prev.bubbleJourney!.timeInEachBubble,
                  [currentBubble]: bubbleTimeSpent,
                },
              },
            }
          : prev
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBubble]);

  // Handle context submission from Welcome bubble
  const handleContextSubmit = (context: string) => {
    setUserContext(context);
    setUseAI(context.trim().length > 0);

    setBubbleJourney((prev) => ({
      ...prev,
      contextProvided: context.trim().length > 0,
      aiInteractions:
        context.trim().length > 0
          ? prev.aiInteractions + 1
          : prev.aiInteractions,
    }));
  };

  // Handle breathing interactions
  const handleBreathingInteraction = () => {
    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            breathInteractions: prev.breathInteractions + 1,
          }
        : prev
    );
  };

  // Handle bubble navigation
  const handleBubbleChange = (bubbleIndex: number) => {
    const now = Date.now();

    setCurrentBubble(bubbleIndex);
    bubbleStartTime.current = now;

    setBubbleJourney((prev) => ({
      ...prev,
      bubblesVisited: [...new Set([...prev.bubblesVisited, bubbleIndex])],
      timeInEachBubble: {
        ...prev.timeInEachBubble,
        [bubbleIndex]: 0, // Reset time for new bubble
      },
    }));

    // Add page view for new bubble
    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            pageViews: [
              ...prev.pageViews,
              {
                path: "/",
                timestamp: new Date().toISOString(),
                timeSpent: 0,
                scrollDepth: 0,
                interactions: [],
                bubbleId: getBubbleId(bubbleIndex),
              },
            ],
          }
        : prev
    );
  };

  // Handle journey completion
  const handleJourneyComplete = () => {
    setBubbleJourney((prev) => ({
      ...prev,
      completedJourney: true,
    }));

    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            bubbleJourney: {
              ...prev.bubbleJourney!,
              completedJourney: true,
            },
          }
        : prev
    );
  };

  // Jump to signup (shortcut from Welcome bubble)
  const jumpToSignup = () => {
    setCurrentBubble(3); // Jump to Join bubble
    handleBubbleChange(3);
  };

  // Get bubble ID for tracking
  const getBubbleId = (index: number): string => {
    const bubbleIds = ["welcome", "philosophy", "experience", "join"];
    return bubbleIds[index] || "unknown";
  };

  // Shared props for all bubbles
  const bubbleProps = {
    userContext,
    useAI,
    sessionData,
    onBreathingInteraction: handleBreathingInteraction,
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Accessibility announcement */}
      <div className="sr-only" aria-live="polite">
        Currently viewing {getBubbleId(currentBubble)} bubble,
        {currentBubble + 1} of 4 in your contemplative journey
      </div>

      {/* Main Bubble Navigation */}
      <BubbleContainer
        onBubbleChange={handleBubbleChange}
        onJourneyComplete={handleJourneyComplete}
        autoAdvance={false}
        allowBackNavigation={true}
        showIndicators={true}
        className="font-inter"
      >
        {/* Bubble 1: Welcome & Recognition */}
        <WelcomeBubble
          {...bubbleProps}
          onContextSubmit={handleContextSubmit}
          onJumpToSignup={jumpToSignup}
        />

        {/* Bubble 2: Philosophy & Understanding */}
        <PhilosophyBubble {...bubbleProps} />

        {/* Bubble 3: Experience & Chambers */}
        <ExperienceBubble {...bubbleProps} />

        {/* Bubble 4: Invitation & Signup */}
        <JoinBubble {...bubbleProps} />
      </BubbleContainer>

      {/* Journey Analytics (Hidden) */}
      <div className="hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SELAH",
              description:
                "Technology that breathes with you - The first contemplative technology platform",
              url: "https://selah.im",
              applicationCategory: "Wellness, Meditation",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Person",
                name: "Ahiya",
              },
              keywords:
                "contemplative technology, meditation, mindfulness, consciousness, breathing, AI personalization",
            }),
          }}
        />
      </div>

      {/* Preload next bubble content (performance optimization) */}
      {currentBubble < 3 && (
        <link
          rel="prefetch"
          href={`/api/claude-stream?section=${getBubbleId(currentBubble + 1)}`}
        />
      )}
    </div>
  );
}
