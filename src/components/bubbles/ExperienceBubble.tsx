// src/components/bubbles/ExperienceBubble.tsx - SELAH Experience Bubble
// Technology that breathes with you - Sacred chamber preview and exploration

"use client";

import React, { useState, useEffect } from "react";
import Bubble from "@/components/ui/Bubble";
import StreamingText from "@/components/ui/StreamingText";
import { cn } from "@/lib/utils";
import type { BubbleProps } from "@/lib/types";

const ExperienceBubble: React.FC<BubbleProps> = ({
  userContext,
  useAI,
  sessionData,
  onNavigateNext,
  onComplete,
  bubbleIndex = 2,
  ...bubbleProps
}) => {
  const [visibleChambers, setVisibleChambers] = useState(0);
  const [expandedChamber, setExpandedChamber] = useState<number | null>(null);
  const [contentComplete, setContentComplete] = useState(false);

  // Animate chambers appearing when bubble becomes active
  useEffect(() => {
    if (bubbleProps.isActive && contentComplete) {
      const timer = setInterval(() => {
        setVisibleChambers((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);

      return () => clearInterval(timer);
    }
  }, [bubbleProps.isActive, contentComplete]);

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

  const handleStreamComplete = () => {
    setContentComplete(true);
  };

  const handleAllChambersExplored = () => {
    // Auto-advance after user has explored chambers
    setTimeout(() => {
      onComplete?.();
      setTimeout(() => {
        onNavigateNext?.();
      }, 2000);
    }, 3000);
  };

  // Check if user has explored chambers
  useEffect(() => {
    if (visibleChambers >= 4 && expandedChamber !== null) {
      // User has seen all chambers and expanded one
      const timer = setTimeout(handleAllChambersExplored, 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleChambers, expandedChamber]);

  return (
    <Bubble
      bubbleId="experience"
      color="purple"
      size="full"
      breathing={true}
      {...bubbleProps}
    >
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-8">
        {/* Sacred Header */}
        <div className="text-center space-y-6 max-w-4xl">
          <StreamingText
            content={useAI ? null : defaultContent}
            userContext={userContext}
            useAI={useAI}
            section="chambers"
            bubbleId="experience"
            fallbackContent={defaultContent}
            className="space-y-4"
            onStreamComplete={handleStreamComplete}
          />
        </div>

        {/* Sacred Chambers Grid */}
        {contentComplete && (
          <div className="chamber-grid-bubble max-w-4xl w-full">
            {chambers.map((chamber, index) => (
              <div
                key={chamber.id}
                className={cn(
                  "chamber-container-bubble transition-all duration-1000 ease-out",
                  {
                    "opacity-100 transform translate-y-0":
                      index < visibleChambers,
                    "opacity-0 transform translate-y-8":
                      index >= visibleChambers,
                    expanded: expandedChamber === index,
                    dimmed:
                      expandedChamber !== null && expandedChamber !== index,
                  }
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
                onClick={() => handleChamberClick(index)}
              >
                {/* Sacred Chamber Orb */}
                <div
                  className={cn(
                    "chamber-orb-bubble bg-gradient-to-br",
                    chamber.color,
                    "shadow-lg transition-all duration-800",
                    {
                      "hover:shadow-xl cursor-pointer": chamber.available,
                      "opacity-75": !chamber.available,
                      "shadow-2xl": expandedChamber === index,
                    }
                  )}
                >
                  {/* Chamber Icon */}
                  <div
                    className={cn("text-4xl transition-all duration-800", {
                      "transform scale-75 opacity-30":
                        expandedChamber === index,
                    })}
                  >
                    {chamber.icon}
                  </div>

                  {/* Expanded Chamber Details */}
                  {expandedChamber === index && (
                    <div className="chamber-details-bubble">
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-white">
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
                              <div className="w-1 h-1 bg-white/60 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Badge */}
                  {!chamber.available && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-slate-600 font-medium">
                      Soon
                    </div>
                  )}
                </div>

                {/* Chamber Info (visible when not expanded) */}
                <div className="chamber-info-bubble">
                  <h3 className="text-lg font-semibold text-stone mb-2">
                    {chamber.name}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {chamber.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sacred Exploration Hint */}
        {visibleChambers >= 4 && expandedChamber === null && (
          <div className="text-center animate-breathe">
            <p className="text-slate-600 text-sm">
              Touch any chamber to explore its essence
            </p>
          </div>
        )}

        {/* Sacred Progress */}
        {contentComplete && (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={cn("h-1 rounded-full transition-all duration-500", {
                  "w-8 bg-breathing-green": index < visibleChambers,
                  "w-4 bg-slate-300": index >= visibleChambers,
                })}
              />
            ))}
          </div>
        )}

        {/* Navigation hint */}
        {visibleChambers >= 4 && expandedChamber !== null && (
          <div className="absolute bottom-6 right-6 animate-breathe">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span>Join the journey</span>
              <div className="w-1 h-1 bg-breathing-pink rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </Bubble>
  );
};

export default ExperienceBubble;

// Additional styles for bubble-specific chamber layout
const chamberStyles = `
.chamber-grid-bubble {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .chamber-grid-bubble {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 700px;
  }
}

.chamber-container-bubble {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.chamber-container-bubble.expanded {
  grid-column: 1 / -1;
  transform: scale(1.05);
  z-index: 10;
}

.chamber-container-bubble.dimmed {
  opacity: 0.4;
  transform: scale(0.95);
}

.chamber-orb-bubble {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.chamber-container-bubble.expanded .chamber-orb-bubble {
  width: 12rem;
  height: 12rem;
}

.chamber-details-bubble {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s ease-out;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  color: white;
  text-align: center;
}

.chamber-container-bubble.expanded .chamber-details-bubble {
  opacity: 1;
  transform: scale(1);
}

.chamber-info-bubble {
  margin-top: 1rem;
  text-align: center;
  transition: all 0.8s ease-out;
}

.chamber-container-bubble.expanded .chamber-info-bubble {
  opacity: 0;
  transform: translateY(-10px);
}
`;
