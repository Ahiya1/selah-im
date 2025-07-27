// src/components/sections/InvitationSection.tsx - SELAH Invitation Section
// Technology that breathes with you - Sacred completion and invitation

"use client";

import React, { useState, useCallback } from "react";
import StreamingText from "@/components/ui/StreamingText";
import type { EngagementData, EmailSubmission } from "@/lib/types";

interface InvitationSectionProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  onBreathingInteraction: () => void;
}

const InvitationSection: React.FC<InvitationSectionProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

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
            source: "contemplative-journey",
            context: {
              userContext,
              sessionTime: sessionData?.timeSpent || 0,
              breathInteractions: sessionData?.breathInteractions || 0,
              usedAI: useAI,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          setIsSubmitted(true);
          setEmail("");
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
    [email, sessionData, userContext, useAI]
  );

  // Default templated content
  const defaultContent = {
    title: "Begin Your Recognition",
    subtitle:
      "Be among the first to experience technology that serves consciousness.",
    promise: "Simple, contemplative updates when Selah becomes available.",
    gratitude: "Thank you for breathing with us today.",
  };

  if (isSubmitted) {
    return (
      <div className="section-sacred">
        <div className="section-sacred-inner">
          <div className="container-sacred-content">
            <div className="text-center space-y-8">
              {/* Sacred Completion */}
              <div className="w-20 h-20 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
                <span className="text-breathing-green text-3xl">✓</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-stone">
                  Welcome to the Journey
                </h2>
                <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                  You're now part of a movement toward contemplative technology.
                  We'll share updates with the same care and presence you
                  experienced here.
                </p>
              </div>

              {/* Sacred Session Summary */}
              {sessionData && (
                <div className="card-breathing p-6 max-w-md mx-auto">
                  <p className="text-stone font-medium mb-3">
                    Your sacred session:
                  </p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-breathing-green rounded-full"></div>
                      <span>
                        {sessionData.breathInteractions} breaths shared
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-breathing-blue rounded-full"></div>
                      <span>
                        {Math.floor(sessionData.timeSpent / 60)} minutes present
                      </span>
                    </div>
                    {useAI && (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-breathing-gold rounded-full"></div>
                        <span>AI recognition experienced</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-breathing px-6 py-3"
                >
                  Experience Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="invitation-section" className="section-sacred">
      <div className="section-sacred-inner">
        <div className="container-sacred-content">
          <div className="text-center space-y-12">
            {/* Sacred Header */}
            <div className="space-y-6">
              <StreamingText
                content={defaultContent}
                userContext={userContext}
                useAI={useAI}
                section="invitation"
                className="space-y-4"
              />
            </div>

            {/* Sacred Apps Preview */}
            <div className="space-y-6">
              <div className="flex justify-center space-x-6">
                <div className="bg-slate-200 rounded-lg px-6 py-4 flex items-center space-x-3 opacity-50">
                  <span className="text-3xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Coming Soon</div>
                    <div className="font-semibold text-slate-700">
                      App Store
                    </div>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-lg px-6 py-4 flex items-center space-x-3 opacity-50">
                  <span className="text-3xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Coming Soon</div>
                    <div className="font-semibold text-slate-700">
                      Google Play
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center space-x-3 bg-breathing-blue/20 backdrop-blur-sm border border-breathing-blue/30 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-breathing-blue rounded-full animate-pulse"></div>
                <span className="text-stone font-medium">
                  iOS & Android • Private beta beginning
                </span>
              </div>
            </div>

            {/* Sacred Email Form */}
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-contemplative text-center w-full"
                  required
                  disabled={isSubmitting}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="btn-breathing w-full py-4 text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Joining the Journey...
                    </span>
                  ) : (
                    "Join the Contemplative Journey"
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-500">
                ✓ No spam, ever. Just contemplative updates when Selah is ready.
              </p>
            </form>

            {/* Sacred Session Summary */}
            {sessionData && sessionData.breathInteractions > 0 && (
              <div className="card-stone p-6 max-w-2xl mx-auto">
                <p className="text-stone font-medium mb-3">
                  Your contemplative session:
                </p>
                <div className="flex justify-center space-x-8 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-breathing-green rounded-full"></div>
                    <span>{sessionData.breathInteractions} breaths shared</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-breathing-blue rounded-full"></div>
                    <span>
                      {Math.floor(sessionData.timeSpent / 60)} minutes present
                    </span>
                  </div>
                  {useAI && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-breathing-gold rounded-full"></div>
                      <span>AI recognition</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sacred Links */}
            <div className="space-y-8">
              <div className="flex justify-center space-x-8 text-slate-600">
                <a
                  href="/contact"
                  className="hover:text-stone transition-colors text-sm"
                >
                  Contact
                </a>
                <a
                  href="https://github.com/Ahiya1/selah-im.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone transition-colors text-sm"
                >
                  Open Source
                </a>
                <a
                  href="/privacy"
                  className="hover:text-stone transition-colors text-sm"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="hover:text-stone transition-colors text-sm"
                >
                  Terms
                </a>
              </div>

              {/* Sacred Manifesto */}
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-lg text-slate-700 italic leading-relaxed">
                  "Technology that makes humans more human, built from stillness
                  rather than urgency, designed to serve consciousness rather
                  than consume it."
                </p>

                <p className="text-sm text-slate-500">
                  © 2025 Selah • Technology that breathes with you • Made with
                  reverence by Ahiya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationSection;
