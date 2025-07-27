// src/components/ui/StreamingText.tsx - SELAH Enhanced Streaming Text - FIXED SPACING + MINIMAL
// Technology that breathes with you - AI-powered contemplative content streaming

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type {
  StreamingTextProps,
  StreamingTextState,
  ClaudeStreamRequest,
} from "@/lib/types";

const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  userContext = "",
  useAI = false,
  className = "",
  section = "recognition",
  onStreamComplete,
  bubbleId,
  fallbackContent,
  shouldStartStreaming = false,
  forceRestream = false,
}) => {
  const [state, setState] = useState<StreamingTextState>({
    displayedWords: [],
    isStreaming: false,
    streamingComplete: false,
    contentToStream: "",
    isAIGenerated: false,
    rateLimited: false,
  });

  const [hasInitialized, setHasInitialized] = useState(false);
  const [orchestrationTriggered, setOrchestrationTriggered] = useState(false);

  const abortController = useRef<AbortController | null>(null);
  const streamingTimeouts = useRef<NodeJS.Timeout[]>([]);

  // FIXED: Stream words with proper spacing
  const streamWords = useCallback(
    async (text: string, aiGenerated: boolean = false) => {
      if (!text) return;

      // Clear any existing timeouts
      streamingTimeouts.current.forEach(clearTimeout);
      streamingTimeouts.current = [];

      setState((prev) => ({
        ...prev,
        isStreaming: true,
        displayedWords: [],
        isAIGenerated: aiGenerated,
      }));

      // FIXED: Split by spaces and filter empty strings
      const words = text.split(/\s+/).filter((word) => word.trim().length > 0);

      let cumulativeDelay = 0;

      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // Calculate contemplative delay
        const delay = getContemplativeDelay(word, i, words.length);
        cumulativeDelay += delay;

        const timeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            displayedWords: [...prev.displayedWords, word],
          }));

          // Complete streaming when all words are displayed
          if (i === words.length - 1) {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
              streamingComplete: true,
            }));
            onStreamComplete?.();
          }
        }, cumulativeDelay);

        streamingTimeouts.current.push(timeout);
      }
    },
    [onStreamComplete]
  );

  // Handle AI streaming from Claude API
  const handleAIStreaming = useCallback(async () => {
    if (!userContext || !useAI) {
      const templateText = formatTemplatedContent(content || fallbackContent);
      await streamWords(templateText, false);
      return;
    }

    // Cancel any existing request
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isStreaming: true,
      displayedWords: [],
      rateLimited: false,
    }));

    try {
      const streamRequest: ClaudeStreamRequest = {
        userContext,
        section,
        templateStructure: content,
      };

      console.log(
        `🤖 StreamingText: Starting AI stream for section "${section}"`
      );

      const response = await fetch("/api/claude-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(streamRequest),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      const isRateLimited = response.status === 429;
      const aiGenerated = response.headers.get("x-ai-generated") === "true";

      if (isRateLimited || contentType?.includes("application/json")) {
        const result = await response.json();

        setState((prev) => ({
          ...prev,
          rateLimited: isRateLimited,
          isAIGenerated: false,
        }));

        if (result.data?.content) {
          const fallbackText = formatTemplatedContent(result.data.content);
          await streamWords(fallbackText, false);
        } else {
          const templateText = formatTemplatedContent(
            content || fallbackContent
          );
          await streamWords(templateText, false);
        }
        return;
      }

      // Handle streaming response
      if (response.body) {
        await handleStreamingResponse(response.body, aiGenerated);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("AI streaming error:", error);
      const templateText = formatTemplatedContent(content || fallbackContent);
      await streamWords(templateText, false);
    }
  }, [userContext, useAI, section, content, fallbackContent, streamWords]);

  // FIXED: Handle streaming response with proper word handling
  const handleStreamingResponse = useCallback(
    async (body: ReadableStream, aiGenerated: boolean) => {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      setState((prev) => ({
        ...prev,
        isAIGenerated: aiGenerated,
        displayedWords: [],
      }));

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);

                if (data.type === "content") {
                  accumulatedText += data.text;
                } else if (data.type === "complete") {
                  // Stream all accumulated text at once with proper spacing
                  if (accumulatedText.trim()) {
                    await streamWords(accumulatedText.trim(), aiGenerated);
                  }
                  return;
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }

        // If no completion signal, stream what we have
        if (accumulatedText.trim()) {
          await streamWords(accumulatedText.trim(), aiGenerated);
        }
      } finally {
        reader.releaseLock();
      }
    },
    [streamWords]
  );

  // Orchestration effect
  useEffect(() => {
    if (!useAI && !hasInitialized) {
      console.log(
        `📝 StreamingText: Starting template stream for section "${section}"`
      );
      setHasInitialized(true);

      if (content || fallbackContent) {
        const templateText = formatTemplatedContent(content || fallbackContent);
        streamWords(templateText, false);
      }
      return;
    }

    if (useAI && shouldStartStreaming && !orchestrationTriggered) {
      console.log(
        `🎭 StreamingText: Orchestration triggered for section "${section}"`
      );
      setOrchestrationTriggered(true);
      setHasInitialized(true);
      handleAIStreaming();
      return;
    }

    if (forceRestream && hasInitialized) {
      console.log(
        `🔄 StreamingText: Force restreaming for section "${section}"`
      );
      setOrchestrationTriggered(false);
      setState((prev) => ({
        ...prev,
        displayedWords: [],
        isStreaming: false,
        streamingComplete: false,
      }));

      if (useAI) {
        handleAIStreaming();
      } else {
        const templateText = formatTemplatedContent(content || fallbackContent);
        streamWords(templateText, false);
      }
    }
  }, [
    useAI,
    shouldStartStreaming,
    orchestrationTriggered,
    hasInitialized,
    forceRestream,
    content,
    fallbackContent,
    section,
    handleAIStreaming,
    streamWords,
  ]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
      streamingTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  // Calculate contemplative delay between words
  const getContemplativeDelay = (
    word: string,
    index: number,
    total: number
  ): number => {
    const baseDelay = 150; // Slightly slower for contemplation

    // Longer pause after punctuation
    if (word.endsWith(".") || word.endsWith("?") || word.endsWith("!")) {
      return 600;
    }

    // Pause after commas
    if (word.endsWith(",")) {
      return 300;
    }

    // Vary delay for natural rhythm
    const lengthFactor = Math.min(word.length / 6, 1);
    const variance = Math.random() * 50;

    return Math.floor(baseDelay + lengthFactor * 40 + variance);
  };

  // SIMPLIFIED: Format minimal contemplative content
  const formatTemplatedContent = (content: any): string => {
    if (typeof content === "string") return content;
    if (!content) return "";

    // MINIMAL content for each section
    switch (section) {
      case "recognition":
        return (
          content.essence || content.greeting || "You found your way here."
        );

      case "philosophy":
        return (
          content.essence ||
          content.problem ||
          "Most technology demands attention. Selah serves consciousness."
        );

      case "chambers":
        return (
          content.essence ||
          content.title ||
          "Four chambers for consciousness to explore itself."
        );

      case "invitation":
        return content.essence || content.title || "Begin your recognition.";

      default:
        return typeof content === "object"
          ? String(Object.values(content)[0] || "")
          : String(content);
    }
  };

  // SIMPLIFIED: Render minimal content
  const renderContent = () => {
    if (!state.displayedWords.length && !state.isStreaming) {
      return null;
    }

    const fullText = state.displayedWords.join(" ");

    return (
      <div className="text-center">
        <p
          className={cn(
            "text-2xl md:text-3xl font-light leading-relaxed text-slate-700",
            "transition-opacity duration-500",
            {
              "animate-breathe-in": state.streamingComplete,
            }
          )}
        >
          {state.displayedWords.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={cn(
                "inline-block transition-all duration-300",
                "hover:text-stone cursor-default mr-2",
                {
                  "animate-breathe-subtle": state.streamingComplete,
                }
              )}
              style={{
                animationDelay: `${wordIndex * 0.1}s`,
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    );
  };

  return (
    <div className={cn("text-streaming", className)}>
      {/* Orchestration waiting indicator */}
      {useAI && !orchestrationTriggered && !hasInitialized && (
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
          <span className="text-slate-500 text-sm animate-breathe-slow">
            Awaiting personalization...
          </span>
        </div>
      )}

      {/* Streaming indicator */}
      {state.isStreaming && state.displayedWords.length === 0 && (
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <div className="w-2 h-2 bg-breathing-blue rounded-full animate-pulse" />
          <span className="text-slate-600 text-sm animate-breathe-slow">
            {state.isAIGenerated || useAI ? "Recognizing..." : "Breathing..."}
          </span>
        </div>
      )}

      {/* Rate limited message */}
      {state.rateLimited && (
        <div className="mb-6 p-4 bg-breathing-gold/10 border-l-4 border-breathing-gold rounded-r-lg">
          <p className="text-sm text-slate-600 italic">
            ✨ Your personalized journey continues tomorrow. Universal
            experience below.
          </p>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn("prose-contemplative", {
          "animate-breathe-slow": state.streamingComplete,
        })}
      >
        {renderContent()}
      </div>

      {/* AI attribution */}
      {state.isAIGenerated && state.streamingComplete && (
        <div className="mt-6 text-center animate-breathe-in">
          <p className="text-xs text-slate-500 italic">✨ AI Personalized</p>
        </div>
      )}

      {/* Streaming cursor */}
      {state.isStreaming && state.displayedWords.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="w-1 h-6 bg-breathing-blue animate-pulse rounded-full" />
        </div>
      )}
    </div>
  );
};

export default StreamingText;
