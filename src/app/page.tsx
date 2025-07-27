// src/app/page.tsx - SELAH Session-Based Bubble Journey
// Technology that breathes with you - Clean session-based architecture

"use client";

import React, { useState, useEffect, useRef } from "react";
import { generateSessionMetadata } from "@/lib/utils";
import type { PresentationSession } from "@/lib/types";

// Real Bubble Components
import BubbleContainer from "@/components/ui/BubbleContainer";
import WelcomeBubble from "@/components/bubbles/WelcomeBubble";
import PhilosophyBubble from "@/components/bubbles/PhilosophyBubble";
import ExperienceBubble from "@/components/bubbles/ExperienceBubble";
import JoinBubble from "@/components/bubbles/JoinBubble";

export default function SelahHomePage(): JSX.Element {
  // Session-based state management
  const [session, setSession] = useState<PresentationSession | null>(null);
  const [currentBubble, setCurrentBubble] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const sessionStartTime = useRef<number>(Date.now());
  const bubbleStartTime = useRef<number>(Date.now());

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  // Track time spent
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      updateSessionAnalytics();
    }, 1000);

    return () => clearInterval(interval);
  }, [session, currentBubble]);

  /**
   * Initialize new session without context
   */
  const initializeSession = async () => {
    try {
      setIsLoading(true);

      const metadata = generateSessionMetadata();

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viewport: metadata.viewport,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSession(result.data);
        console.log(`🎭 SELAH: Session ${result.data.id} initialized`);
      } else {
        console.error("Failed to initialize session:", result.message);
      }
    } catch (error) {
      console.error("Session initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle context submission from Welcome bubble
   */
  const handleContextSubmit = async (context: string) => {
    if (!session) return;

    try {
      const hasContext = context.trim().length > 0;

      console.log(
        `🌸 SELAH: ${hasContext ? "Adding" : "Skipping"} context for session ${session.id}`
      );

      // Update session with context - this triggers AI generation
      const response = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          updates: {
            userContext: context || null,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSession(result.data);
        console.log(`✨ SELAH: Session updated, AI=${result.data.useAI}`);
      } else {
        console.warn("Failed to update session context:", result.message);
      }
    } catch (error) {
      console.error("Context submission error:", error);
    }
  };

  /**
   * Handle breathing interactions
   */
  const handleBreathingInteraction = async () => {
    if (!session) return;

    const newCount = session.analytics.breathInteractions + 1;

    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          updates: {
            breathInteractions: newCount,
          },
        }),
      });

      // Update local state optimistically
      setSession((prev) =>
        prev
          ? {
              ...prev,
              analytics: {
                ...prev.analytics,
                breathInteractions: newCount,
              },
            }
          : null
      );
    } catch (error) {
      console.warn("Failed to update breath interactions:", error);
    }
  };

  /**
   * Handle bubble navigation
   */
  const handleBubbleChange = async (bubbleIndex: number) => {
    if (!session) return;

    setCurrentBubble(bubbleIndex);
    bubbleStartTime.current = Date.now();

    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          updates: {
            currentBubble: bubbleIndex,
          },
        }),
      });

      console.log(
        `🫧 SELAH: Navigated to bubble ${bubbleIndex} (${getBubbleId(bubbleIndex)})`
      );
    } catch (error) {
      console.warn("Failed to update bubble navigation:", error);
    }
  };

  /**
   * Update session analytics
   */
  const updateSessionAnalytics = async () => {
    if (!session) return;

    const now = Date.now();
    const totalTimeSpent = Math.floor((now - sessionStartTime.current) / 1000);

    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          updates: {
            timeSpent: totalTimeSpent,
          },
        }),
      });
    } catch (error) {
      // Silent fail for analytics updates
    }
  };

  /**
   * Handle journey completion
   */
  const handleJourneyComplete = () => {
    console.log("🎉 SELAH: Contemplative journey complete");
  };

  /**
   * Jump to signup (shortcut from Welcome bubble)
   */
  const jumpToSignup = () => {
    setCurrentBubble(3);
    handleBubbleChange(3);
  };

  /**
   * Get bubble ID for tracking
   */
  const getBubbleId = (index: number): string => {
    const bubbleIds = ["welcome", "philosophy", "experience", "invitation"];
    return bubbleIds[index] || "unknown";
  };

  /**
   * Get shared props for all bubbles
   */
  const getBubbleProps = () => {
    if (!session) {
      return {
        sessionId: "",
        userContext: "",
        useAI: false,
        sessionData: null,
        onBreathingInteraction: handleBreathingInteraction,
      };
    }

    return {
      sessionId: session.id,
      userContext: session.userContext || "",
      useAI: session.useAI,
      sessionData: session.analytics,
      onBreathingInteraction: handleBreathingInteraction,
    };
  };

  // Loading state
  if (isLoading || !session) {
    return (
      <div className="min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto">
            <div className="w-full h-full border-4 border-breathing-green/30 border-t-breathing-green rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-600 font-medium">
              Preparing your contemplative space...
            </p>
            <p className="text-slate-500 text-sm animate-pulse">
              Technology that breathes with you
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Accessibility announcement */}
      <div className="sr-only" aria-live="polite">
        Currently viewing {getBubbleId(currentBubble)} bubble,
        {currentBubble + 1} of 4 in your contemplative journey
        {session.useAI && session.userContext && " with AI personalization"}
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
          {...getBubbleProps()}
          onContextSubmit={handleContextSubmit}
          onJumpToSignup={jumpToSignup}
        />

        {/* Bubble 2: Philosophy & Recognition - SESSION-BASED */}
        <PhilosophyBubble
          {...getBubbleProps()}
          session={session}
          bubbleId="philosophy"
        />

        {/* Bubble 3: Experience & Chambers - SESSION-BASED */}
        <ExperienceBubble {...getBubbleProps()} />

        {/* Bubble 4: Invitation & Signup */}
        <JoinBubble {...getBubbleProps()} />
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
              creator: { "@type": "Person", name: "Ahiya" },
              keywords:
                "contemplative technology, meditation, mindfulness, consciousness, breathing, AI personalization",
            }),
          }}
        />
      </div>

      {/* Development debug info (only in dev) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono max-w-xs">
          <div>Session: {session.id.slice(-8)}</div>
          <div>
            Bubble: {currentBubble} ({getBubbleId(currentBubble)})
          </div>
          <div>AI: {session.useAI ? "✓" : "✗"}</div>
          <div>Context: {session.userContext?.length || 0} chars</div>
          <div>Status: {session.status}</div>
          <div className="text-xs opacity-60 mt-1">
            Phil: {session.bubbleContent.philosophy.isAI ? "AI" : "Template"} |
            Exp: {session.bubbleContent.experience.isAI ? "AI" : "Template"}
          </div>
        </div>
      )}
    </div>
  );
}
