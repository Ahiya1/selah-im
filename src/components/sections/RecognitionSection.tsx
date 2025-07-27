// src/components/sections/RecognitionSection.tsx - SELAH Recognition Section
// Technology that breathes with you - Sacred entry space

"use client";

import React, { useState } from "react";
import BreathingOrb from "@/components/ui/BreathingOrb";
import ContextForm from "@/components/ui/ContextForm";
import StreamingText from "@/components/ui/StreamingText";
import type { EngagementData, OrbEngagement } from "@/lib/types";

interface RecognitionSectionProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  onBreathingInteraction: () => void;
  onContextSubmit: (context: string) => void;
  onJumpToSignup: () => void;
}

const RecognitionSection: React.FC<RecognitionSectionProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
  onContextSubmit,
  onJumpToSignup,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOrbEngagement = (engagement: OrbEngagement) => {
    onBreathingInteraction();
    if (!hasInteracted) {
      setHasInteracted(true);
      // Show content after first breath interaction
      setTimeout(() => setShowContent(true), 800);
    }
  };

  const handleContextSubmit = (context: string) => {
    onContextSubmit(context);
    if (!showContent) {
      setShowContent(true);
    }
  };

  // Default templated content for non-AI path
  const defaultContent = {
    greeting: "You found your way here.",
    recognition:
      "Right now, you're breathing with technology that responds to you instead of demanding from you. Feel the difference?",
    invitation:
      "This is what we're building—technology that serves consciousness instead of consuming it.",
    transition: "Let me show you what this becomes...",
  };

  return (
    <div className="section-sacred">
      {/* Top Navigation */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="nav-contemplative flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold animate-breathe text-sm">
              S
            </div>
            <span className="text-stone font-semibold tracking-wide">
              SELAH
            </span>
          </div>

          <button
            onClick={onJumpToSignup}
            className="text-slate-600 hover:text-stone transition-colors text-sm font-medium"
          >
            Just sign me up
          </button>
        </div>
      </div>

      <div className="section-sacred-inner">
        <div className="container-sacred-content">
          <div className="text-center space-y-12">
            {/* Sacred Breathing Space */}
            <div className="space-y-8">
              <div className="relative mx-auto">
                {/* Main Sacred Orb */}
                <div className="orb-sacred mx-auto relative">
                  <BreathingOrb
                    size="large"
                    variant="default"
                    onEngagement={handleOrbEngagement}
                    className="w-full h-full text-6xl md:text-7xl lg:text-8xl shadow-breathing-green hover:shadow-breathing-blue transition-all duration-1000"
                  />

                  {/* Sacred breathing ripples */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-breathing-green/30 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border border-breathing-blue/20 animate-ping"
                    style={{ animationDuration: "4s", animationDelay: "1s" }}
                  />
                  <div
                    className="absolute inset-8 rounded-full border border-breathing-pink/20 animate-ping"
                    style={{ animationDuration: "5s", animationDelay: "2s" }}
                  />
                </div>

                {/* Sacred Invitation */}
                <div className="text-center space-y-3 mt-8">
                  <p className="text-slate-600 text-xl font-light">◦ Breathe</p>
                  <p className="text-slate-500 text-sm">
                    Touch to share breath with technology
                  </p>
                </div>
              </div>

              {/* Sacred Context Gathering */}
              <div
                className={`
                  transition-all duration-1000 ease-out
                  ${hasInteracted ? "opacity-100 transform translate-y-0" : "opacity-70 transform translate-y-4"}
                `}
              >
                <ContextForm
                  onSubmit={handleContextSubmit}
                  className="max-w-xl mx-auto"
                />
              </div>
            </div>

            {/* Sacred Content Streaming */}
            {showContent && (
              <div className="max-w-3xl mx-auto">
                <StreamingText
                  content={useAI ? null : defaultContent}
                  userContext={userContext}
                  useAI={useAI}
                  section="recognition"
                  className="space-y-8"
                />
              </div>
            )}

            {/* Sacred Session Recognition */}
            {sessionData && sessionData.breathInteractions > 0 && (
              <div className="fixed bottom-6 left-6 inline-flex items-center space-x-3 glass-light rounded-full px-4 py-2 animate-breathe-in">
                <div className="w-2 h-2 bg-breathing-green rounded-full animate-pulse"></div>
                <span className="text-stone text-sm font-medium">
                  {sessionData.breathInteractions} breath
                  {sessionData.breathInteractions === 1 ? "" : "s"} shared
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionSection;
