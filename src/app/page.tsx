// src/app/page.tsx - SELAH Sacred Bubble Journey Landing Page - ORCHESTRATED
// Technology that breathes with you - Four contemplative bubbles with AI orchestration

"use client";

import React, { useState, useEffect, useRef } from "react";
import { generateSessionMetadata } from "@/lib/utils";
import type {
  EngagementData,
  BubbleJourneyData,
  BubbleOrchestrationState,
  BubbleStreamingState,
} from "@/lib/types";

// Real Bubble Components
import BubbleContainer from "@/components/ui/BubbleContainer";
import WelcomeBubble from "@/components/bubbles/WelcomeBubble";
import PhilosophyBubble from "@/components/bubbles/PhilosophyBubble";
import ExperienceBubble from "@/components/bubbles/ExperienceBubble";
import JoinBubble from "@/components/bubbles/JoinBubble";

export default function SelahHomePage(): JSX.Element {
  // Core state management
  const [userContext, setUserContext] = useState<string>("");
  const [useAI, setUseAI] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<EngagementData | null>(null);
  const [currentBubble, setCurrentBubble] = useState<number>(0);

  // NEW: Bubble orchestration state
  const [bubbleStates, setBubbleStates] = useState<BubbleOrchestrationState>({
    1: { shouldStream: false, hasStreamed: false }, // Philosophy
    2: { shouldStream: false, hasStreamed: false }, // Experience
  });

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
      maxScroll: 0,
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
    const hasContext = context.trim().length > 0;

    setUserContext(context);
    setUseAI(hasContext);

    // NEW: Prepare bubbles for AI streaming if context provided
    if (hasContext) {
      setBubbleStates({
        1: { shouldStream: true, hasStreamed: false },
        2: { shouldStream: true, hasStreamed: false },
      });
    }

    setBubbleJourney((prev) => ({
      ...prev,
      contextProvided: hasContext,
      aiInteractions: hasContext
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

  // NEW: Enhanced bubble navigation with streaming orchestration
  const handleBubbleChange = (bubbleIndex: number) => {
    const now = Date.now();

    setCurrentBubble(bubbleIndex);
    bubbleStartTime.current = now;

    setBubbleJourney((prev) => ({
      ...prev,
      bubblesVisited: [...new Set([...prev.bubblesVisited, bubbleIndex])],
      timeInEachBubble: {
        ...prev.timeInEachBubble,
        [bubbleIndex]: 0,
      },
    }));

    // NEW: Trigger streaming for Philosophy (1) and Experience (2) bubbles
    if ((bubbleIndex === 1 || bubbleIndex === 2) && bubbleStates[bubbleIndex]) {
      const bubbleState = bubbleStates[bubbleIndex];

      // Only mark as "should stream" if we have context and haven't streamed yet
      if (useAI && userContext.trim() && !bubbleState.hasStreamed) {
        console.log(
          `🌸 SELAH: Triggering AI streaming for bubble ${bubbleIndex}`
        );

        setBubbleStates((prev) => ({
          ...prev,
          [bubbleIndex]: {
            ...prev[bubbleIndex],
            shouldStream: true,
          },
        }));
      }
    }

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

  // NEW: Handle when bubble completes streaming
  const handleBubbleStreamComplete = (bubbleIndex: number) => {
    if (bubbleIndex === 1 || bubbleIndex === 2) {
      setBubbleStates((prev) => ({
        ...prev,
        [bubbleIndex]: {
          ...prev[bubbleIndex],
          hasStreamed: true,
        },
      }));

      console.log(`✨ SELAH: Bubble ${bubbleIndex} streaming complete`);
    }
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

    console.log("🎉 SELAH: Contemplative journey complete");
  };

  // Jump to signup (shortcut from Welcome bubble)
  const jumpToSignup = () => {
    setCurrentBubble(3);
    handleBubbleChange(3);
  };

  // Get bubble ID for tracking
  const getBubbleId = (index: number): string => {
    const bubbleIds = ["welcome", "philosophy", "experience", "join"];
    return bubbleIds[index] || "unknown";
  };

  // NEW: Enhanced shared props with orchestration data
  const getBubbleProps = (bubbleIndex: number) => {
    const baseProps = {
      userContext,
      useAI,
      sessionData,
      onBreathingInteraction: handleBreathingInteraction,
    };

    // Add orchestration props for Philosophy and Experience bubbles
    if (bubbleIndex === 1 || bubbleIndex === 2) {
      const bubbleState = bubbleStates[bubbleIndex];

      return {
        ...baseProps,
        shouldStartStreaming:
          bubbleState?.shouldStream && !bubbleState?.hasStreamed,
        hasStreamedBefore: bubbleState?.hasStreamed || false,
        onStreamComplete: () => handleBubbleStreamComplete(bubbleIndex),
      };
    }

    return baseProps;
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Accessibility announcement */}
      <div className="sr-only" aria-live="polite">
        Currently viewing {getBubbleId(currentBubble)} bubble,
        {currentBubble + 1} of 4 in your contemplative journey
        {useAI && userContext && " with AI personalization"}
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
        {/* Bubble 1: Welcome & Context Collection */}
        <WelcomeBubble
          {...getBubbleProps(0)}
          onContextSubmit={handleContextSubmit}
          onJumpToSignup={jumpToSignup}
        />

        {/* Bubble 2: Philosophy & Recognition - NOW WITH AI ORCHESTRATION */}
        <PhilosophyBubble {...getBubbleProps(1)} />

        {/* Bubble 3: Experience & Chambers - NOW WITH AI ORCHESTRATION */}
        <ExperienceBubble {...getBubbleProps(2)} />

        {/* Bubble 4: Invitation & Signup */}
        <JoinBubble {...getBubbleProps(3)} />
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

      {/* NEW: Preload Claude API for upcoming bubbles */}
      {useAI && userContext && currentBubble < 3 && (
        <link
          rel="prefetch"
          href={`/api/claude-stream?section=${getBubbleId(currentBubble + 1)}`}
        />
      )}

      {/* Development debug info (only in dev) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>
            Bubble: {currentBubble} ({getBubbleId(currentBubble)})
          </div>
          <div>AI: {useAI ? "✓" : "✗"}</div>
          <div>Context: {userContext.length} chars</div>
          <div>
            Streams:{" "}
            {Object.entries(bubbleStates)
              .map(
                ([idx, state]) =>
                  `${idx}:${state.hasStreamed ? "✓" : state.shouldStream ? "..." : "○"}`
              )
              .join(" ")}
          </div>
        </div>
      )}
    </div>
  );
}
