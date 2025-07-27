// src/components/bubbles/JoinBubble.tsx - SELAH Join Bubble - CONDENSED
// Technology that breathes with you - Minimal sacred journey completion

"use client";

import React, { useState, useCallback } from "react";
import Bubble from "@/components/ui/Bubble";
import StreamingText from "@/components/ui/StreamingText";
import { cn } from "@/lib/utils";
import type { BubbleProps } from "@/lib/types";

const JoinBubble: React.FC<BubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onComplete,
  bubbleIndex = 3,
  isActive = false,
  isComplete = false,
  ...bubbleProps
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  const [contentComplete, setContentComplete] = useState(false);

  // Handle email submission
  const handleEmailSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (!email.trim()) return;

      setIsSubmitting(true);
      setError("");

      try {
        const response = await fetch("/api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            source: "bubble-journey",
            userContext: userContext, // Include user context
            sessionId: sessionData?.sessionId,
            context: {
              sessionTime: sessionData?.timeSpent || 0,
              breathInteractions: sessionData?.breathInteractions || 0,
              usedAI: useAI,
              bubbleJourney: true,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          setIsSubmitted(true);
          setEmail("");
          onComplete?.();
        } else {
          setError(
            result.message || "Failed to submit email. Please try again."
          );
        }
      } catch (error) {
        setError("Connection error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, sessionData, userContext, useAI, onComplete]
  );

  // CONDENSED: Default templated content
  const defaultContent = {
    title: "Begin Your Recognition",
    subtitle: "Join the first contemplative technology.",
  };

  const handleStreamComplete = () => {
    setContentComplete(true);
  };

  if (isSubmitted) {
    return (
      <Bubble
        bubbleId="join-complete"
        color="blue"
        size="full"
        breathing={true}
        isActive={isActive}
        isComplete={isComplete}
        {...bubbleProps}
      >
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-8">
          {/* Sacred Completion */}
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
              <span className="text-breathing-green text-2xl">✓</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-stone">
                Welcome to the Journey
              </h2>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                You're now part of contemplative technology. Updates shared with
                the same presence you experienced.
              </p>
            </div>

            {/* CONDENSED: Session Summary */}
            {sessionData && (
              <div className="card-breathing p-4 max-w-sm mx-auto">
                <p className="text-stone font-medium mb-2 text-sm">
                  Your session:
                </p>
                <div className="flex justify-center space-x-4 text-xs text-slate-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-breathing-green rounded-full" />
                    <span>{sessionData.breathInteractions} breaths</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-breathing-blue rounded-full" />
                    <span>
                      {Math.floor((sessionData?.timeSpent || 0) / 60)}min
                    </span>
                  </div>
                  {useAI && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-breathing-gold rounded-full" />
                      <span>AI</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONDENSED: Actions */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-breathing px-4 py-2 text-sm"
              >
                Experience Again
              </button>
            </div>

            {/* CONDENSED: Links */}
            <div className="space-y-4 mt-8">
              <div className="flex justify-center space-x-4 text-slate-600 text-xs">
                <a
                  href="/contact"
                  className="hover:text-stone transition-colors"
                >
                  Contact
                </a>
                <a
                  href="https://github.com/Ahiya1/selah-im.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone transition-colors"
                >
                  Source
                </a>
                <a
                  href="/privacy"
                  className="hover:text-stone transition-colors"
                >
                  Privacy
                </a>
              </div>

              {/* CONDENSED: Manifesto */}
              <div className="max-w-md mx-auto">
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "Technology that serves consciousness rather than consumes
                  it."
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  © 2025 Selah • Made with reverence by Ahiya
                </p>
              </div>
            </div>
          </div>
        </div>
      </Bubble>
    );
  }

  return (
    <Bubble
      bubbleId="join"
      color="blue"
      size="full"
      breathing={true}
      isActive={isActive}
      isComplete={isComplete}
      {...bubbleProps}
    >
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-8">
        {/* CONDENSED: Sacred Header */}
        <div className="text-center space-y-4 max-w-lg">
          <StreamingText
            content={useAI ? null : defaultContent}
            userContext={userContext}
            useAI={useAI}
            section="invitation"
            bubbleId="join"
            fallbackContent={defaultContent}
            className="space-y-2"
            onStreamComplete={handleStreamComplete}
          />
        </div>

        {contentComplete && (
          <>
            {/* CONDENSED: Apps Preview */}
            <div className="space-y-4 animate-breathe-in">
              <div className="flex justify-center space-x-4">
                <div className="bg-slate-200 rounded-lg px-4 py-3 flex items-center space-x-2 opacity-60">
                  <span className="text-xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Soon</div>
                    <div className="font-medium text-slate-700 text-sm">
                      iOS
                    </div>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-lg px-4 py-3 flex items-center space-x-2 opacity-60">
                  <span className="text-xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Soon</div>
                    <div className="font-medium text-slate-700 text-sm">
                      Android
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 bg-breathing-blue/20 backdrop-blur-sm border border-breathing-blue/30 rounded-full px-4 py-2 mx-auto">
                <div className="w-2 h-2 bg-breathing-blue rounded-full animate-pulse" />
                <span className="text-stone font-medium text-sm">
                  Private beta beginning
                </span>
              </div>
            </div>

            {/* CONDENSED: Email Form */}
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-4 max-w-sm mx-auto w-full animate-breathe-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-contemplative text-center w-full"
                  required
                  disabled={isSubmitting}
                />

                {error && (
                  <p className="text-red-600 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="btn-breathing w-full py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    "Join the Journey"
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                No spam. Contemplative updates only.
              </p>
            </form>

            {/* CONDENSED: Session Summary */}
            {sessionData && sessionData.breathInteractions > 0 && (
              <div
                className="card-stone p-4 max-w-md mx-auto animate-breathe-in"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-stone font-medium mb-2 text-center text-sm">
                  Your bubble journey:
                </p>
                <div className="flex justify-center space-x-6 text-xs text-slate-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-breathing-green rounded-full" />
                    <span>{sessionData.breathInteractions} breaths</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-breathing-blue rounded-full" />
                    <span>
                      {Math.floor((sessionData?.timeSpent || 0) / 60)} minutes
                    </span>
                  </div>
                  {useAI && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-breathing-gold rounded-full" />
                      <span>AI personalized</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Bubble>
  );
};

export default JoinBubble;
