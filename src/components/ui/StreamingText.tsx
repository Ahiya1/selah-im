// src/components/ui/StreamingText.tsx - SELAH Always-Streaming Text Component
// Technology that breathes with you - All content streams naturally

"use client";

import React, { useState, useEffect, useCallback } from "react";

interface StreamingTextProps {
  content?: any; // Templated content object
  userContext?: string;
  useAI?: boolean;
  className?: string;
  section?: "recognition" | "chambers" | "philosophy" | "invitation";
  onStreamComplete?: () => void;
}

const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  userContext = "",
  useAI = false,
  className = "",
  section = "recognition",
  onStreamComplete,
}) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [contentToStream, setContentToStream] = useState<string>("");

  // Stream words naturally with contemplative pacing
  const streamWords = useCallback(
    async (text: string) => {
      if (!text) return;

      setIsStreaming(true);
      setDisplayedWords([]);

      const words = text.split(" ");

      for (let i = 0; i < words.length; i++) {
        // Add current word
        setDisplayedWords((prev) => [...prev, words[i]]);

        // Contemplative pacing - slower for important moments
        let delay = 120; // Base delay

        // Pause longer after periods for breathing space
        if (
          words[i].endsWith(".") ||
          words[i].endsWith("?") ||
          words[i].endsWith("!")
        ) {
          delay = 400;
        }
        // Pause slightly longer after commas
        else if (words[i].endsWith(",")) {
          delay = 200;
        }
        // Vary slightly for natural rhythm
        else {
          delay = 80 + Math.random() * 80; // 80-160ms
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      setIsStreaming(false);
      setStreamingComplete(true);
      onStreamComplete?.();
    },
    [onStreamComplete]
  );

  // Handle content preparation
  useEffect(() => {
    if (useAI && userContext) {
      // TODO: Implement Claude API streaming
      handleAIContent();
    } else if (content) {
      // Stream templated content
      const formattedText = formatTemplatedContent(content);
      setContentToStream(formattedText);
    }
  }, [content, userContext, useAI]);

  // Start streaming when content is ready
  useEffect(() => {
    if (contentToStream && !streamingComplete) {
      streamWords(contentToStream);
    }
  }, [contentToStream, streamingComplete, streamWords]);

  const handleAIContent = async () => {
    // TODO: Replace with actual Claude API call
    // const response = await fetch('/api/claude-stream', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userContext,
    //     section,
    //     templateStructure: content
    //   })
    // });

    const aiResponse = generatePlaceholderAIResponse(userContext, section);
    setContentToStream(aiResponse);
  };

  const formatTemplatedContent = (content: any): string => {
    if (typeof content === "string") return content;

    // Format content object into readable text based on section
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

  // TODO: Replace with actual Claude API logic
  const generatePlaceholderAIResponse = (
    context: string,
    section: string
  ): string => {
    const responses = {
      recognition: {
        therapist: `I see you found your way here from your therapeutic journey. Right now, you're experiencing what it feels like when technology doesn't try to optimize you or make you more productive. This breathing orb responds to your touch, creates space instead of demanding attention. Feel how different this is from meditation apps that track your streaks and measure your progress? This is technology designed to serve your consciousness, not extract value from it.`,

        developer: `You're building AI products, so you understand the attention economy from the inside. What you're experiencing right now is the inversion—technology that makes humans more human instead of more efficient. This breathing interaction isn't collecting data to optimize you; it's creating genuine partnership between consciousness and AI. This is what we're building: the foundation for technology that serves rather than exploits.`,

        curious: `You found your way here through curiosity, and that's exactly the right energy. Right now, you're breathing with technology that has no agenda except to be present with you. Feel the difference? No notifications, no optimization, no metrics—just shared presence. This is what we mean by contemplative technology.`,

        default: `You're here, and that's what matters. Right now, you're experiencing something rare—technology that responds to you without trying to change you. This breathing orb creates space for presence instead of demanding optimization. Feel how different this is? This is the foundation of everything we're building.`,
      },
    };

    // Simple context matching for demo
    if (
      context.toLowerCase().includes("therapist") ||
      context.toLowerCase().includes("therapy")
    ) {
      return responses.recognition.therapist;
    } else if (
      context.toLowerCase().includes("ai") ||
      context.toLowerCase().includes("developer") ||
      context.toLowerCase().includes("building")
    ) {
      return responses.recognition.developer;
    } else if (
      context.toLowerCase().includes("curious") ||
      context.toLowerCase().includes("wondering")
    ) {
      return responses.recognition.curious;
    } else {
      return responses.recognition.default;
    }
  };

  // Render streaming text
  const renderContent = () => {
    if (!displayedWords.length && !isStreaming) {
      return null;
    }

    // Split into paragraphs based on double line breaks
    const fullText = displayedWords.join(" ");
    const paragraphs = fullText.split("\n\n");

    return paragraphs
      .map((paragraph, paragraphIndex) => {
        if (!paragraph.trim()) return null;

        const words = paragraph.split(" ");
        const currentWordIndex = displayedWords.indexOf(words[0]);

        return (
          <p
            key={paragraphIndex}
            className="text-lg leading-relaxed mb-6 text-slate-700 text-contemplative-large"
          >
            {words.map((word, wordIndex) => {
              const globalWordIndex = displayedWords.findIndex(
                (displayedWord, idx) => {
                  // Find the position of this word in the global displayed words array
                  const paragraphStart = displayedWords.slice(0, idx).join(" ");
                  const currentParagraphStart = paragraphs
                    .slice(0, paragraphIndex)
                    .join("\n\n");
                  return (
                    paragraphStart.includes(currentParagraphStart) &&
                    displayedWords[idx] === word &&
                    idx >= currentWordIndex + wordIndex
                  );
                }
              );

              const isDisplayed =
                currentWordIndex + wordIndex < displayedWords.length;
              const isCurrentWord =
                currentWordIndex + wordIndex === displayedWords.length - 1 &&
                isStreaming;

              return (
                <span
                  key={wordIndex}
                  className={`
                  word-streaming
                  ${isDisplayed ? "opacity-100" : "opacity-0"}
                  ${isCurrentWord ? "typing-cursor" : ""}
                `}
                  style={{
                    animationDelay: `${(currentWordIndex + wordIndex) * 0.1}s`,
                  }}
                >
                  {word}
                  {wordIndex < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={`text-streaming ${className}`}>
      {isStreaming && displayedWords.length === 0 && (
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-2 h-2 bg-breathing-blue rounded-full animate-pulse"></div>
          <span className="text-slate-600 text-sm">
            {useAI
              ? "Recognizing your context..."
              : "Breathing words into existence..."}
          </span>
        </div>
      )}

      <div
        className={`
          prose-contemplative text-center
          ${streamingComplete ? "animate-breathe-slow" : ""}
        `}
      >
        {renderContent()}
      </div>

      {/* AI Attribution */}
      {useAI && streamingComplete && (
        <div className="mt-8 text-center animate-breathe-in">
          <p className="text-xs text-slate-500 italic">
            ✨ Personalized with contemplative AI
          </p>
        </div>
      )}

      {/* Streaming indicator */}
      {isStreaming && displayedWords.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="w-1 h-6 bg-breathing-blue animate-pulse rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default StreamingText;

/* TODO: Claude API Integration
 *
 * 1. Create /api/claude-stream endpoint
 * 2. Replace generatePlaceholderAIResponse with actual Claude streaming
 * 3. Add proper error handling for API failures
 * 4. Implement rate limiting and authentication
 * 5. Add fallback to templated content if AI fails
 * 6. Add retry logic for failed streams
 *
 * Example API structure:
 *
 * POST /api/claude-stream
 * {
 *   "userContext": "string",
 *   "section": "recognition|chambers|philosophy|invitation",
 *   "templateStructure": object // Use existing template as guide
 * }
 *
 * Response: Server-sent events stream or JSON with full response
 */
