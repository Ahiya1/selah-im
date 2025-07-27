// src/components/ui/StreamingText.tsx - SELAH Enhanced Streaming Text with Claude
// Technology that breathes with you - AI-powered contemplative content streaming

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type {
  StreamingTextProps,
  StreamingTextState,
  ClaudeStreamRequest,
  EngagementData,
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
}) => {
  const [state, setState] = useState<StreamingTextState>({
    displayedWords: [],
    isStreaming: false,
    streamingComplete: false,
    contentToStream: "",
    isAIGenerated: false,
    rateLimited: false,
  });

  const abortController = useRef<AbortController | null>(null);
  const streamingTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Stream words naturally with contemplative pacing
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

      const words = text.split(" ").filter((word) => word.trim());
      let cumulativeDelay = 0;

      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // Calculate contemplative delay
        let delay = getContemplativeDelay(word, i, words.length);
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
      // Use template content
      const templateText = formatTemplatedContent(content || fallbackContent);
      setState((prev) => ({ ...prev, contentToStream: templateText }));
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

      // Check if response is streaming or JSON
      const contentType = response.headers.get("content-type");
      const isRateLimited = response.status === 429;
      const aiGenerated = response.headers.get("x-ai-generated") === "true";

      if (isRateLimited || contentType?.includes("application/json")) {
        // Handle rate limited or fallback response
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
        return; // Request was cancelled
      }

      console.error("AI streaming error:", error);

      // Fall back to template content
      setState((prev) => ({
        ...prev,
        isAIGenerated: false,
        rateLimited: false,
      }));

      const templateText = formatTemplatedContent(content || fallbackContent);
      await streamWords(templateText, false);
    }
  }, [userContext, useAI, section, content, fallbackContent, streamWords]);

  // Handle streaming response from Claude API
  const handleStreamingResponse = useCallback(
    async (body: ReadableStream, aiGenerated: boolean) => {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamedText = "";

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
                  streamedText += data.text;

                  // Stream word by word as we receive content
                  const words = streamedText.split(" ");
                  const newWords = words.slice(state.displayedWords.length);

                  for (const word of newWords) {
                    if (word.trim()) {
                      await new Promise((resolve) => {
                        setTimeout(
                          () => {
                            setState((prev) => ({
                              ...prev,
                              displayedWords: [...prev.displayedWords, word],
                            }));
                            resolve(void 0);
                          },
                          getContemplativeDelay(word, 0, 1)
                        );
                      });
                    }
                  }
                } else if (data.type === "complete") {
                  setState((prev) => ({
                    ...prev,
                    isStreaming: false,
                    streamingComplete: true,
                  }));
                  onStreamComplete?.();
                  break;
                }
              } catch (e) {
                // Ignore parsing errors for malformed JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
    [state.displayedWords.length, onStreamComplete]
  );

  // Initialize content streaming
  useEffect(() => {
    if (useAI && userContext) {
      handleAIStreaming();
    } else if (content || fallbackContent) {
      const templateText = formatTemplatedContent(content || fallbackContent);
      streamWords(templateText, false);
    }

    return () => {
      // Cleanup on unmount
      if (abortController.current) {
        abortController.current.abort();
      }
      streamingTimeouts.current.forEach(clearTimeout);
    };
  }, [
    useAI,
    userContext,
    content,
    fallbackContent,
    handleAIStreaming,
    streamWords,
  ]);

  // Calculate contemplative delay between words
  const getContemplativeDelay = (
    word: string,
    index: number,
    total: number
  ): number => {
    const baseDelay = 120; // Base 120ms between words

    // Longer pause after punctuation for breathing space
    if (word.endsWith(".") || word.endsWith("?") || word.endsWith("!")) {
      return 400;
    }

    // Slightly longer pause after commas
    if (word.endsWith(",")) {
      return 200;
    }

    // Vary delay for natural rhythm
    const lengthFactor = Math.min(word.length / 8, 1);
    const variance = Math.random() * 40; // 0-40ms variance

    return Math.floor(baseDelay + lengthFactor * 30 + variance);
  };

  // Format templated content into readable text
  const formatTemplatedContent = (content: any): string => {
    if (typeof content === "string") return content;
    if (!content) return "";

    // Handle different content structures based on section
    switch (section) {
      case "recognition":
        return [
          content.greeting || "You found your way here.",
          content.recognition ||
            "Right now, you're breathing with technology that responds to you instead of demanding from you. Feel the difference?",
          content.invitation ||
            "This is what we're building—technology that serves consciousness instead of consuming it.",
          content.transition || "Let me show you what this becomes...",
        ]
          .filter(Boolean)
          .join("\n\n");

      case "chambers":
        return [
          content.title || "Four Chambers for Consciousness",
          content.subtitle ||
            "Each chamber invites recognition through different doorways. Technology that disappears, leaving only presence, creativity, and the quiet joy of being human.",
          content.description ||
            "This isn't about becoming better—it's about recognizing what you already are.",
        ]
          .filter(Boolean)
          .join("\n\n");

      case "philosophy":
        return [
          content.problem ||
            "Most technology demands your attention, optimizes your behavior, makes you faster and more productive. It serves the attention economy, not human consciousness.",
          content.inversion ||
            "Selah inverts this entirely. It serves consciousness itself.",
          content.recognition ||
            "This isn't about becoming a better person. It's about recognizing the perfect awareness you've always been, beneath all the seeking.",
          content.experience ||
            "You've already felt this—in those moments breathing with the orb, when technology responded to you instead of manipulating you.",
          content.invitation ||
            "This is how we build different. This is how technology becomes contemplative.",
        ]
          .filter(Boolean)
          .join("\n\n");

      case "invitation":
        return [
          content.title || "Begin Your Recognition",
          content.subtitle ||
            "Be among the first to experience technology that serves consciousness.",
          content.promise ||
            "Simple, contemplative updates when Selah becomes available.",
          content.gratitude || "Thank you for breathing with us today.",
        ]
          .filter(Boolean)
          .join("\n\n");

      default:
        return typeof content === "object"
          ? JSON.stringify(content)
          : String(content);
    }
  };

  // Render content with contemplative styling
  const renderContent = () => {
    if (!state.displayedWords.length && !state.isStreaming) {
      return null;
    }

    // Split into paragraphs based on sentence patterns
    const fullText = state.displayedWords.join(" ");
    const paragraphs = fullText.split(/\n\n|\. [A-Z]/).map((p, i, arr) => {
      // Add back period if it was split off
      if (i < arr.length - 1 && !p.endsWith(".")) {
        return p + ".";
      }
      return p;
    });

    return paragraphs
      .map((paragraph, paragraphIndex) => {
        if (!paragraph.trim()) return null;

        return (
          <p
            key={paragraphIndex}
            className={cn(
              "text-lg leading-relaxed mb-6 text-slate-700",
              "transition-opacity duration-500",
              {
                "animate-breathe-in": state.streamingComplete,
              }
            )}
          >
            {paragraph.split(" ").map((word, wordIndex) => (
              <span
                key={`${paragraphIndex}-${wordIndex}`}
                className={cn(
                  "inline-block transition-all duration-300",
                  "hover:text-stone cursor-default",
                  {
                    "animate-breathe-subtle": state.streamingComplete,
                  }
                )}
                style={{
                  animationDelay: `${wordIndex * 0.1}s`,
                }}
              >
                {word}
                {wordIndex < paragraph.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={cn("text-streaming", className)}>
      {/* Streaming indicator */}
      {state.isStreaming && state.displayedWords.length === 0 && (
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <div className="w-2 h-2 bg-breathing-blue rounded-full animate-pulse" />
          <span className="text-slate-600 text-sm animate-breathe-slow">
            {state.isAIGenerated || useAI
              ? "Recognizing your context..."
              : "Breathing words into existence..."}
          </span>
        </div>
      )}

      {/* Rate limited message */}
      {state.rateLimited && (
        <div className="mb-6 p-4 bg-breathing-gold/10 border-l-4 border-breathing-gold rounded-r-lg">
          <p className="text-sm text-slate-600 italic">
            ✨ You've experienced your personalized journey today. The universal
            journey continues below.
          </p>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn("prose-contemplative text-center", {
          "animate-breathe-slow": state.streamingComplete,
        })}
      >
        {renderContent()}
      </div>

      {/* AI attribution */}
      {state.isAIGenerated && state.streamingComplete && (
        <div className="mt-8 text-center animate-breathe-in">
          <p className="text-xs text-slate-500 italic">
            ✨ Personalized with contemplative AI
          </p>
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
