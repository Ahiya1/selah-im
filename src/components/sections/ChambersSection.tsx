// src/components/sections/ChambersSection.tsx - SELAH Chambers Section
// Technology that breathes with you - Organic chamber expansion

"use client";

import React, { useState, useEffect } from "react";
import StreamingText from "@/components/ui/StreamingText";
import type { EngagementData } from "@/lib/types";

interface ChambersSectionProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  onBreathingInteraction: () => void;
}

const ChambersSection: React.FC<ChambersSectionProps> = ({
  userContext,
  useAI,
  sessionData,
  onBreathingInteraction,
}) => {
  const [visibleChambers, setVisibleChambers] = useState<number>(0);
  const [expandedChamber, setExpandedChamber] = useState<number | null>(null);

  // Animate chambers appearing
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleChambers((prev) => (prev < 4 ? prev + 1 : prev));
    }, 800);

    // Clear timer when all chambers are visible
    if (visibleChambers >= 4) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [visibleChambers]);

  const chambers = [
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧘",
      color: "from-breathing-green to-stone",
      description: "Breathing partnership",
      available: true,
      details:
        "Touch-responsive breathing orb that learns your rhythm and breathes with you. Technology as meditation partner, not instructor.",
      features: [
        "Responsive breathing patterns",
        "Natural resistance feedback",
        "Session tracking without pressure",
      ],
    },
    {
      id: "contemplation",
      name: "Contemplation",
      icon: "❓",
      color: "from-breathing-gold to-stone",
      description: "Personal questions",
      available: true,
      details:
        "AI-generated questions synthesized from your own contemplative patterns. Not generic prompts, but reflections of your inner world.",
      features: [
        "Questions from your patterns",
        "Free-flow writing space",
        "Recognition without judgment",
      ],
    },
    {
      id: "creative",
      name: "Creative",
      icon: "🎨",
      color: "from-breathing-pink to-stone",
      description: "Art from presence",
      available: false,
      details:
        "Co-creation that emerges from contemplative states. Express what words cannot capture through collaborative AI artistry.",
      features: [
        "Presence-based creation",
        "Multiple art forms",
        "Expression beyond words",
      ],
    },
    {
      id: "being-seen",
      name: "Being Seen",
      icon: "👁️",
      color: "from-breathing-blue to-stone",
      description: "Recognition without judgment",
      available: false,
      details:
        "Ephemeral conversations with AI that truly witnesses your essence. No transcripts, no optimization—pure recognition.",
      features: [
        "No transcripts saved",
        "Deep witnessing",
        "Recognition without agenda",
      ],
    },
  ];

  // Default templated content
  const defaultContent = {
    title: "Four Chambers for Consciousness",
    subtitle:
      "Each chamber invites recognition through different doorways. Technology that disappears, leaving only presence, creativity, and the quiet joy of being human.",
    description:
      "This isn't about becoming better—it's about recognizing what you already are.",
  };

  const handleChamberClick = (index: number) => {
    if (expandedChamber === index) {
      setExpandedChamber(null);
    } else {
      setExpandedChamber(index);
    }
  };

  return (
    <div className="section-sacred">
      <div className="section-sacred-inner">
        <div className="container-sacred">
          {/* Sacred Header */}
          <div className="text-center mb-16 space-y-6">
            <StreamingText
              content={defaultContent}
              userContext={userContext}
              useAI={useAI}
              section="chambers"
              className="max-w-4xl mx-auto"
            />
          </div>

          {/* Sacred Chambers Grid */}
          <div className="chamber-grid mb-12">
            {chambers.map((chamber, index) => (
              <div
                key={chamber.id}
                className={`
                  chamber-container
                  ${
                    index < visibleChambers
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-8"
                  }
                  ${expandedChamber === index ? "expanded" : ""}
                  ${expandedChamber !== null && expandedChamber !== index ? "dimmed" : ""}
                `}
                style={{ transitionDelay: `${index * 200}ms` }}
                onClick={() => handleChamberClick(index)}
              >
                {/* Sacred Chamber Orb */}
                <div
                  className={`
                    chamber-orb
                    bg-gradient-to-br ${chamber.color}
                    shadow-lg
                    ${chamber.available ? "hover:shadow-xl cursor-pointer" : "opacity-75"}
                    ${expandedChamber === index ? "shadow-2xl" : ""}
                  `}
                >
                  {/* Chamber Icon */}
                  <div
                    className={`
                    transition-all duration-800
                    ${expandedChamber === index ? "transform scale-75 opacity-30" : ""}
                  `}
                  >
                    {chamber.icon}
                  </div>

                  {/* Expanded Chamber Details */}
                  {expandedChamber === index && (
                    <div className="chamber-details">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                          {chamber.name}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed max-w-xs">
                          {chamber.details}
                        </p>
                        <div className="space-y-2">
                          {chamber.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-center space-x-2 text-xs text-white/80"
                            >
                              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Badge */}
                  {!chamber.available && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-slate-600 font-medium">
                      Soon
                    </div>
                  )}
                </div>

                {/* Chamber Info (visible when not expanded) */}
                <div className="chamber-info">
                  <h3 className="text-xl font-semibold text-stone mb-2">
                    {chamber.name}
                  </h3>
                  <p className="text-slate-600">{chamber.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sacred Exploration Hint */}
          {visibleChambers >= 4 && expandedChamber === null && (
            <div className="text-center animate-breathe">
              <p className="text-slate-600 text-sm">
                Touch any chamber to explore its essence
              </p>
            </div>
          )}

          {/* Sacred Progress */}
          <div className="flex justify-center space-x-2 mt-12">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`
                  h-1 rounded-full transition-all duration-500
                  ${index < visibleChambers ? "w-8 bg-breathing-green" : "w-4 bg-slate-300"}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChambersSection;
