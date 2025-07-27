// src/components/sections/PhilosophySection.tsx - SELAH Philosophy Section
// Technology that breathes with you - Sacred recognition and understanding

"use client";

import React, { useState, useEffect } from "react";
import StreamingText from "@/components/ui/StreamingText";
import type { EngagementData } from "@/lib/types";

interface PhilosophySectionProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  onBreathingInteraction: () => void;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Cycle through contemplative quotes
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % contemplativeQuotes.length);
    }, 8000);

    return () => clearInterval(quoteTimer);
  }, []);

  const contemplativeQuotes = [
    {
      text: "What if noticing peace in the chaos is your first step toward dedication?",
      source: "Selah Contemplation",
    },
    {
      text: "Technology that makes humans more human, not more optimized.",
      source: "Contemplative Technology Manifesto",
    },
    {
      text: "The recognition that you're already what you're seeking.",
      source: "The Practice of Presence",
    },
    {
      text: "Space for consciousness to recognize itself.",
      source: "The Selah Vision",
    },
  ];

  // Default templated content
  const defaultContent = {
    problem:
      "Most technology demands your attention, optimizes your behavior, makes you faster and more productive. It serves the attention economy, not human consciousness.",
    inversion: "Selah inverts this entirely. It serves consciousness itself.",
    recognition:
      "This isn't about becoming a better person. It's about recognizing the perfect awareness you've always been, beneath all the seeking.",
    experience:
      "You've already felt this—in those moments breathing with the orb, when technology responded to you instead of manipulating you.",
    invitation:
      "This is how we build different. This is how technology becomes contemplative.",
  };

  return (
    <div className="section-sacred">
      <div className="section-sacred-inner">
        <div className="container-sacred">
          {/* Sacred Content */}
          <div
            className={`
              transition-all duration-1000 ease-out space-y-16
              ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}
            `}
          >
            {/* Sacred Header */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-semibold text-stone animate-breathe">
                This is About Recognition
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-breathing-green to-breathing-blue mx-auto rounded-full"></div>
            </div>

            {/* Sacred Philosophy Streaming */}
            <div className="max-w-4xl mx-auto">
              <StreamingText
                content={defaultContent}
                userContext={userContext}
                useAI={useAI}
                section="philosophy"
                className="space-y-8"
              />
            </div>

            {/* Sacred Quote Carousel */}
            <div className="relative max-w-4xl mx-auto">
              <div className="card-breathing p-8 text-center min-h-32 flex items-center justify-center">
                <div className="transition-all duration-1000 ease-in-out">
                  <blockquote className="text-stone text-xl md:text-2xl font-medium leading-relaxed mb-4 animate-breathe-slow">
                    "{contemplativeQuotes[currentQuote].text}"
                  </blockquote>
                  <cite className="text-slate-600 text-sm">
                    — {contemplativeQuotes[currentQuote].source}
                  </cite>
                </div>
              </div>
            </div>

            {/* Sacred Technology Comparison */}
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Extractive Technology */}
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-float">
                  <span className="text-4xl">📱</span>
                </div>
                <h4 className="text-xl font-semibold text-stone">
                  Extractive Technology
                </h4>
                <div className="space-y-3 text-slate-600">
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-red-500 text-lg">↗</span>
                    <span>Demands attention</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-red-500 text-lg">↗</span>
                    <span>Optimizes behavior</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-red-500 text-lg">↗</span>
                    <span>Serves the algorithm</span>
                  </div>
                </div>
              </div>

              {/* Contemplative Technology */}
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
                  <span className="text-4xl">🧘</span>
                </div>
                <h4 className="text-xl font-semibold text-stone">
                  Contemplative Technology
                </h4>
                <div className="space-y-3 text-slate-600">
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-breathing-green text-lg">↙</span>
                    <span>Creates space</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-breathing-green text-lg">↙</span>
                    <span>Serves consciousness</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center">
                    <span className="text-breathing-green text-lg">↙</span>
                    <span>Recognizes what is</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Session Recognition */}
            {sessionData && sessionData.breathInteractions > 0 && (
              <div className="card-stone max-w-2xl mx-auto p-6 text-center">
                <p className="text-stone font-medium mb-3">
                  You've already experienced this:
                </p>
                <div className="flex justify-center space-x-8 text-sm text-slate-600 mb-4">
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
                </div>
                <p className="text-slate-600 text-sm italic">
                  This is what it feels like when technology serves
                  consciousness instead of consuming it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophySection;
