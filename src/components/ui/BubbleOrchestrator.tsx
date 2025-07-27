// src/components/ui/BubbleOrchestrator.tsx - SELAH Bubble Orchestrator - OPTIONAL
// Technology that breathes with you
// Clean separation of bubble orchestration logic from main page

"use client";

import React, { useState, useCallback } from "react";
import type {
  BubbleOrchestrationState,
  EngagementData,
  BubbleJourneyData,
} from "@/lib/types";

interface BubbleOrchestratorProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  currentBubble: number;
  children: (
    orchestrationProps: BubbleOrchestrationRenderProps
  ) => React.ReactNode;
}

interface BubbleOrchestrationRenderProps {
  bubbleStates: BubbleOrchestrationState;
  getBubbleProps: (bubbleIndex: number) => any;
  handleBubbleStreamComplete: (bubbleIndex: number) => void;
  prepareBubblesForStreaming: () => void;
  resetOrchestration: () => void;
}

/**
 * Optional orchestrator component that manages bubble streaming state
 * This can be used to keep the main page cleaner by extracting orchestration logic
 */
const BubbleOrchestrator: React.FC<BubbleOrchestratorProps> = ({
  userContext,
  useAI,
  sessionData,
  currentBubble,
  children,
}) => {
  const [bubbleStates, setBubbleStates] = useState<BubbleOrchestrationState>({
    1: { shouldStream: false, hasStreamed: false }, // Philosophy
    2: { shouldStream: false, hasStreamed: false }, // Experience
  });

  // Prepare bubbles for AI streaming when context is provided
  const prepareBubblesForStreaming = useCallback(() => {
    if (useAI && userContext.trim()) {
      console.log("🎭 BubbleOrchestrator: Preparing bubbles for AI streaming");

      setBubbleStates({
        1: { shouldStream: true, hasStreamed: false },
        2: { shouldStream: true, hasStreamed: false },
      });
    }
  }, [useAI, userContext]);

  // Handle when a bubble completes streaming
  const handleBubbleStreamComplete = useCallback((bubbleIndex: number) => {
    if (bubbleIndex === 1 || bubbleIndex === 2) {
      setBubbleStates((prev) => ({
        ...prev,
        [bubbleIndex]: {
          ...prev[bubbleIndex],
          hasStreamed: true,
        },
      }));

      console.log(
        `✨ BubbleOrchestrator: Bubble ${bubbleIndex} streaming complete`
      );
    }
  }, []);

  // Reset orchestration state (for development/testing)
  const resetOrchestration = useCallback(() => {
    setBubbleStates({
      1: { shouldStream: false, hasStreamed: false },
      2: { shouldStream: false, hasStreamed: false },
    });
  }, []);

  // Get enhanced props for each bubble
  const getBubbleProps = useCallback(
    (bubbleIndex: number) => {
      const baseProps = {
        userContext,
        useAI,
        sessionData,
      };

      // Add orchestration props for Philosophy (1) and Experience (2) bubbles
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
    },
    [userContext, useAI, sessionData, bubbleStates, handleBubbleStreamComplete]
  );

  // Determine if a bubble should start streaming based on navigation
  const shouldTriggerStreaming = useCallback(
    (bubbleIndex: number) => {
      if (
        (bubbleIndex === 1 || bubbleIndex === 2) &&
        bubbleStates[bubbleIndex]
      ) {
        const bubbleState = bubbleStates[bubbleIndex];

        // Only trigger if we have context, should stream, and haven't streamed yet
        return (
          useAI &&
          userContext.trim() &&
          bubbleState.shouldStream &&
          !bubbleState.hasStreamed &&
          currentBubble === bubbleIndex
        );
      }

      return false;
    },
    [useAI, userContext, bubbleStates, currentBubble]
  );

  // Auto-trigger streaming when navigating to a bubble that's ready
  React.useEffect(() => {
    if (shouldTriggerStreaming(currentBubble)) {
      console.log(
        `🎯 BubbleOrchestrator: Auto-triggering stream for bubble ${currentBubble}`
      );
    }
  }, [currentBubble, shouldTriggerStreaming]);

  // Provide render props with orchestration data
  const orchestrationProps: BubbleOrchestrationRenderProps = {
    bubbleStates,
    getBubbleProps,
    handleBubbleStreamComplete,
    prepareBubblesForStreaming,
    resetOrchestration,
  };

  return <>{children(orchestrationProps)}</>;
};

export default BubbleOrchestrator;

// Optional: Higher-order component for easier integration
export function withBubbleOrchestration<P extends object>(
  Component: React.ComponentType<P>
) {
  return function BubbleOrchestratedComponent(props: P) {
    return (
      <BubbleOrchestrator
        userContext=""
        useAI={false}
        sessionData={null}
        currentBubble={0}
      >
        {(orchestrationProps) => (
          <Component {...props} {...orchestrationProps} />
        )}
      </BubbleOrchestrator>
    );
  };
}

// Optional: Hook for using orchestration in functional components
export function useBubbleOrchestration(
  userContext: string,
  useAI: boolean,
  currentBubble: number
) {
  const [bubbleStates, setBubbleStates] = useState<BubbleOrchestrationState>({
    1: { shouldStream: false, hasStreamed: false },
    2: { shouldStream: false, hasStreamed: false },
  });

  const prepareBubblesForStreaming = useCallback(() => {
    if (useAI && userContext.trim()) {
      setBubbleStates({
        1: { shouldStream: true, hasStreamed: false },
        2: { shouldStream: true, hasStreamed: false },
      });
    }
  }, [useAI, userContext]);

  const handleBubbleStreamComplete = useCallback((bubbleIndex: number) => {
    setBubbleStates((prev) => ({
      ...prev,
      [bubbleIndex]: {
        ...prev[bubbleIndex],
        hasStreamed: true,
      },
    }));
  }, []);

  const getBubbleStreamingProps = useCallback(
    (bubbleIndex: number) => {
      const bubbleState = bubbleStates[bubbleIndex];

      if (!bubbleState) return {};

      return {
        shouldStartStreaming:
          bubbleState.shouldStream && !bubbleState.hasStreamed,
        hasStreamedBefore: bubbleState.hasStreamed,
        onStreamComplete: () => handleBubbleStreamComplete(bubbleIndex),
      };
    },
    [bubbleStates, handleBubbleStreamComplete]
  );

  return {
    bubbleStates,
    prepareBubblesForStreaming,
    getBubbleStreamingProps,
    handleBubbleStreamComplete,
  };
}

// Optional: Debug component for development
export function BubbleOrchestrationDebug({
  bubbleStates,
  currentBubble,
  userContext,
  useAI,
}: {
  bubbleStates: BubbleOrchestrationState;
  currentBubble: number;
  userContext: string;
  useAI: boolean;
}) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white text-xs p-3 rounded font-mono max-w-xs">
      <div className="text-breathing-green mb-2">🎭 Bubble Orchestration</div>
      <div>Current: {currentBubble}</div>
      <div>AI: {useAI ? "✓" : "✗"}</div>
      <div>Context: {userContext.length} chars</div>
      <div className="mt-2">
        {Object.entries(bubbleStates).map(([idx, state]) => (
          <div key={idx} className="flex items-center space-x-2">
            <span>Bubble {idx}:</span>
            <span>
              {state.hasStreamed ? "✅" : state.shouldStream ? "⏳" : "⭕"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
