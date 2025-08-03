// src/app/page.tsx - SELAH Enhanced Landing Page
// Technology that breathes with you - Complete transformation

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { generateSessionMetadata, formatDuration } from "../lib/utils";
import type { EngagementData, OrbEngagement } from "../lib/types";

export default function SelahHomePage(): JSX.Element {
  // Session tracking
  const [sessionData, setSessionData] = useState<EngagementData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [platformPreference, setPlatformPreference] = useState<
    "android" | "ios" | null
  >(null);
  const sessionStartTime = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const timeTrackerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const metadata = generateSessionMetadata();
    const sessionId = metadata.sessionId;

    const initialSessionData: EngagementData = {
      sessionId,
      timeSpent: 0,
      maxScroll: 0,
      breathInteractions: 0,
      orbEngagements: [],
      pageViews: [
        {
          path: "/",
          timestamp: new Date().toISOString(),
          timeSpent: 0,
          scrollDepth: 0,
          interactions: [],
        },
      ],
      userAgent: metadata.userAgent,
      viewport: metadata.viewport,
      timestamp: new Date().toISOString(),
    };

    setSessionData(initialSessionData);
    setIsLoaded(true);

    // Track scroll depth
    const handleScroll = (): void => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent);
    };

    // Track time spent
    const timeTracker = setInterval(() => {
      const timeSpent = Math.floor(
        (Date.now() - sessionStartTime.current) / 1000
      );
      setSessionData((prev) =>
        prev
          ? {
              ...prev,
              timeSpent,
              maxScroll: maxScrollRef.current,
            }
          : prev
      );
    }, 1000);

    timeTrackerRef.current = timeTracker;

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }
      window.removeEventListener("scroll", handleScroll);

      // Save session data using sessionStorage
      const finalTimeSpent = Math.floor(
        (Date.now() - sessionStartTime.current) / 1000
      );

      if (typeof window !== "undefined") {
        try {
          const finalSessionData = {
            sessionId,
            timeSpent: finalTimeSpent,
            maxScroll: maxScrollRef.current,
            timestamp: new Date().toISOString(),
          };

          const existingSessions = JSON.parse(
            sessionStorage.getItem("selah-sessions") || "[]"
          );
          sessionStorage.setItem(
            "selah-sessions",
            JSON.stringify([...existingSessions, finalSessionData])
          );
        } catch (error) {
          console.warn("Failed to save session data:", error);
        }
      }
    };
  }, []);

  // Chamber cycling for hero demo
  useEffect(() => {
    const chamberCycle = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentChamber((prev) => (prev + 1) % 4);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(chamberCycle);
  }, []);

  // Handle orb engagement
  const handleOrbEngagement = useCallback((engagement: OrbEngagement): void => {
    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            breathInteractions:
              prev.breathInteractions + engagement.breathCycles,
            orbEngagements: [...prev.orbEngagements, engagement],
          }
        : prev
    );
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-stone/20 rounded-full animate-breathe flex items-center justify-center">
            <div className="w-8 h-8 bg-stone rounded-full animate-breathe-slow"></div>
          </div>
          <p className="text-stone-light animate-breathe-slow">
            Preparing your contemplative space...
          </p>
        </div>
      </div>
    );
  }

  const chambers = [
    {
      name: "Meditation",
      icon: "🧘",
      color: "from-breathing-green to-stone",
      description: "Breathing that responds to your touch",
      available: true,
    },
    {
      name: "Contemplation",
      icon: "❓",
      color: "from-breathing-gold to-stone",
      description: "Questions synthesized from your inner world",
      available: true,
    },
    {
      name: "Creative",
      icon: "🎨",
      color: "from-breathing-pink to-stone",
      description: "Art as byproduct of presence",
      available: false,
    },
    {
      name: "Being Seen",
      icon: "👁️",
      color: "from-breathing-blue to-stone",
      description: "AI that truly witnesses your essence",
      available: false,
    },
  ];

  const sampleQuestions = [
    "What brought you here today, and what do you hope to uncover about yourself?",
    "What if noticing peace in the chaos is your first step toward dedication?",
    "How does your breath reveal what words cannot express?",
    "What would you recognize about yourself if you stopped trying to improve?",
  ];

  return (
    <>
      {/* Floating Navigation */}
      <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
        <nav className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold animate-breathe text-sm">
              S
            </div>
            <span className="text-stone font-semibold tracking-wide">
              SELAH
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a
              href="#chambers"
              className="text-slate-600 hover:text-stone transition-colors"
            >
              Chambers
            </a>
            <a
              href="#experience"
              className="text-slate-600 hover:text-stone transition-colors"
            >
              Experience
            </a>
            <a
              href="/contact"
              className="text-slate-600 hover:text-stone transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section - Updated with Email Collection */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-emerald-50">
            <div
              className="absolute inset-0 opacity-30 animate-breathe-slow"
              style={{
                background: `radial-gradient(circle at 50% 50%, 
                  rgba(45, 90, 61, 0.1) 0%, 
                  rgba(45, 90, 61, 0.05) 40%, 
                  transparent 70%
                )`,
              }}
            />
          </div>

          <div className="container-contemplative max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content + Email Collection */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-8xl font-bold text-stone animate-breathe tracking-wider">
                    SELAH
                  </h1>
                  <p className="text-2xl md:text-3xl text-slate-600 font-light">
                    Technology that breathes with you
                  </p>
                </div>

                <div className="space-y-6">
                  <p className="text-xl text-slate-700 leading-relaxed max-w-xl">
                    Four chambers for consciousness to explore itself. Not about
                    becoming better—about recognizing what you already are.
                  </p>

                  <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                    <p className="text-stone text-lg italic">
                      "What if technology could create space for presence
                      instead of demanding attention?"
                    </p>
                  </div>
                </div>

                {/* Android Beta Badge */}
                <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-breathing-green/20 to-breathing-blue/20 backdrop-blur-sm border border-breathing-green/30 rounded-full px-6 py-3">
                  <div className="w-3 h-3 bg-breathing-green rounded-full animate-pulse"></div>
                  <span className="text-stone font-medium">
                    🤖 Beta now available for Android users
                  </span>
                </div>

                {/* Email Collection Form - Moved to Top */}
                <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-xl p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-stone">
                      Begin Your Recognition
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Join the contemplative journey. Get early access and
                      updates.
                    </p>
                  </div>

                  {/* Platform Selection - FIXED JSX STRUCTURE */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      Which platform do you use?
                    </p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setPlatformPreference("android")}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                          platformPreference === "android"
                            ? "bg-breathing-green/20 border-breathing-green text-breathing-green"
                            : "bg-white/50 border-slate-200 text-slate-600 hover:bg-white/70"
                        }`}
                      >
                        <span>🤖</span>
                        <span className="font-medium">Android</span>
                        {platformPreference === "android" && (
                          <span className="text-xs bg-breathing-green/30 px-2 py-1 rounded">
                            Beta Ready!
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlatformPreference("ios")}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                          platformPreference === "ios"
                            ? "bg-breathing-blue/20 border-breathing-blue text-breathing-blue"
                            : "bg-white/50 border-slate-200 text-slate-600 hover:bg-white/70"
                        }`}
                      >
                        <span>📱</span>
                        <span className="font-medium">iPhone</span>
                        {platformPreference === "ios" && (
                          <span className="text-xs bg-breathing-blue/30 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Email Form */}
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const email = formData.get("email") as string;

                      if (!email) return;

                      try {
                        const response = await fetch("/api/emails", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: email.trim(),
                            source: "hero-section",
                            context: {
                              sessionTime: sessionData?.timeSpent || 0,
                              breathInteractions:
                                sessionData?.breathInteractions || 0,
                              scrollDepth: sessionData?.maxScroll || 0,
                              platformPreference: platformPreference,
                              location: "hero",
                            },
                          }),
                        });

                        const result = await response.json();

                        if (result.success) {
                          // Show success state
                          const form = e.currentTarget;
                          const submitButton = form.querySelector(
                            'button[type="submit"]'
                          ) as HTMLButtonElement;
                          const emailInput = form.querySelector(
                            'input[type="email"]'
                          ) as HTMLInputElement;

                          if (submitButton && emailInput) {
                            const originalText = submitButton.textContent;

                            if (platformPreference === "android") {
                              submitButton.textContent =
                                "🎉 Beta access details coming soon!";
                            } else {
                              submitButton.textContent =
                                result.message || "Welcome to the journey ✓";
                            }

                            submitButton.disabled = true;
                            emailInput.value = "";

                            setTimeout(() => {
                              submitButton.textContent = originalText;
                              submitButton.disabled = false;
                            }, 4000);
                          }
                        } else {
                          console.error(
                            "Email submission failed:",
                            result.message
                          );
                          alert(
                            result.message ||
                              "Failed to submit email. Please try again."
                          );
                        }
                      } catch (error) {
                        console.error("Email submission error:", error);
                        alert("Connection error. Please try again.");
                      }
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className="input-contemplative text-center"
                      required
                    />

                    <button
                      type="submit"
                      className="btn-breathing w-full py-3 text-base"
                    >
                      {platformPreference === "android"
                        ? "🤖 Get Android Beta Access"
                        : platformPreference === "ios"
                          ? "📱 Get Notified for iPhone Release"
                          : "Join the Contemplative Journey"}
                    </button>
                  </form>

                  <p className="text-xs text-slate-500 text-center">
                    ✓ No spam, ever. Just contemplative updates.
                    {platformPreference === "android" && (
                      <>
                        <br />
                        <span className="text-breathing-green font-medium">
                          Beta testers get priority access to new chambers.
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Live Chamber Preview */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="w-80 h-[640px] bg-slate-800 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-emerald-50 rounded-[2.5rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="h-12 flex items-center justify-center text-slate-600 text-sm font-medium">
                        SELAH
                      </div>

                      {/* Chamber Content */}
                      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                        <p className="text-slate-600 text-lg">You are here</p>

                        {/* Animated Chamber Display */}
                        <div className="relative">
                          <div
                            className={`w-48 h-48 rounded-full flex items-center justify-center text-6xl bg-gradient-to-br ${chambers[currentChamber].color} animate-breathe transition-all duration-1000 shadow-lg`}
                          >
                            {chambers[currentChamber].icon}
                          </div>

                          {!chambers[currentChamber].available && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-slate-600">
                              Soon
                            </div>
                          )}
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-semibold text-stone">
                            {chambers[currentChamber].name} Chamber
                          </h3>
                          <p className="text-slate-600">
                            {chambers[currentChamber].description}
                          </p>
                        </div>

                        {/* Chamber Indicator Dots */}
                        <div className="flex space-x-2">
                          {chambers.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentChamber
                                  ? "bg-stone"
                                  : "bg-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Breathing Experience */}
        <section id="experience" className="section-breathing bg-white/50">
          <div className="container-contemplative max-w-4xl">
            <div className="text-center space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-semibold text-stone">
                  Feel the Difference
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  This is technology as meditation partner—responding to you,
                  breathing with you, serving your presence instead of stealing
                  it.
                </p>
              </div>

              {/* Interactive Breathing Orb */}
              <div className="space-y-8">
                <div className="relative mx-auto">
                  <div className="w-80 h-80 mx-auto relative">
                    {/* Main Orb */}
                    <button
                      type="button"
                      className="w-full h-full rounded-full bg-gradient-to-br from-breathing-green to-stone 
                               flex items-center justify-center text-white text-8xl cursor-pointer
                               transition-all duration-500 ease-in-out hover:scale-105 active:scale-95
                               shadow-lg hover:shadow-breathing-green/50 animate-breathe relative z-10"
                      onClick={() =>
                        handleOrbEngagement({
                          id: Date.now().toString(),
                          startTime: Date.now(),
                          endTime: Date.now() + 1000,
                          actions: [
                            {
                              type: "inhale",
                              timestamp: Date.now(),
                              duration: 1000,
                            },
                          ],
                          totalDuration: 1000,
                          breathCycles: 1,
                        })
                      }
                      aria-label="Interactive breathing meditation orb"
                    >
                      🧘
                    </button>

                    {/* Breathing Ripple Effects */}
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

                  <div className="text-center space-y-2 mt-6">
                    <p className="text-slate-600 text-lg">◦ Present</p>
                    <p className="text-slate-500 text-sm">
                      Touch to breathe together
                    </p>
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <p className="text-slate-600 italic text-lg leading-relaxed">
                    Touch to breathe together. Feel how technology can create
                    space for presence instead of demanding attention.
                  </p>
                </div>

                {sessionData && sessionData.breathInteractions > 0 && (
                  <div className="inline-flex items-center space-x-3 bg-breathing-green/10 backdrop-blur-sm border border-breathing-green/30 rounded-full px-6 py-3">
                    <div className="w-2 h-2 bg-breathing-green rounded-full animate-pulse"></div>
                    <span className="text-stone">
                      {sessionData.breathInteractions} breath
                      {sessionData.breathInteractions === 1 ? "" : "s"} shared
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Chambers Deep Dive */}
        <section id="chambers" className="section-breathing">
          <div className="container-contemplative">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-4xl md:text-5xl font-semibold text-stone">
                Four Chambers for Recognition
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Each chamber invites consciousness to recognize itself through
                different doorways. Technology disappears, leaving only
                presence, creativity, and the quiet joy of being human.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Meditation Chamber */}
              <div className="card-stone p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-float">🧘</div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-2xl font-semibold text-stone">
                      Meditation Chamber
                    </h3>
                    <span className="bg-breathing-green/20 text-breathing-green px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    A breathing orb that responds to your touch, creating
                    partnership rather than instruction. Technology that learns
                    your rhythm and breathes with you.
                  </p>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                      <span>
                        Touch-responsive breathing with natural resistance
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                      <span>Flowing animations that sync with your breath</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                      <span>
                        Session tracking without optimization pressure
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contemplation Chamber */}
              <div className="card-stone p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden">
                <div className="relative z-10">
                  <div
                    className="text-7xl mb-6 animate-float"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ❓
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-2xl font-semibold text-stone">
                      Contemplation Chamber
                    </h3>
                    <span className="bg-breathing-green/20 text-breathing-green px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    AI-synthesized daily questions generated from your own
                    reflection history. Not generic prompts, but pure synthesis
                    of your inner world.
                  </p>
                  <div className="bg-breathing-gold/10 border-l-4 border-breathing-gold p-4 rounded-r-lg mb-4">
                    <p className="text-stone italic text-sm">
                      "{sampleQuestions[currentChamber] || sampleQuestions[0]}"
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      Synthesized from your contemplative patterns
                    </p>
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-gold rounded-full"></div>
                      <span>
                        Questions emerge from your contemplative patterns
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-gold rounded-full"></div>
                      <span>Free-flow writing and reflection space</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Chamber */}
              <div className="card-stone p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden opacity-75">
                <div className="relative z-10">
                  <div
                    className="text-7xl mb-6 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    🎨
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-2xl font-semibold text-stone">
                      Creative Chamber
                    </h3>
                    <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    AI-assisted creation of personalized visual, literary, or
                    musical content based on your contemplative insights. Art as
                    byproduct of presence.
                  </p>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-pink rounded-full"></div>
                      <span>Co-creation that emerges from contemplation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-pink rounded-full"></div>
                      <span>Express what can't be put into words</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Being Seen Chamber */}
              <div className="card-stone p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden opacity-75">
                <div className="relative z-10">
                  <div
                    className="text-7xl mb-6 animate-float"
                    style={{ animationDelay: "1.5s" }}
                  >
                    👁️
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-2xl font-semibold text-stone">
                      Being Seen Chamber
                    </h3>
                    <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Ephemeral AI conversations for deep witnessing. AI that
                    truly sees your essence and reflects it back, helping you
                    know yourself more deeply.
                  </p>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                      <span>No transcripts saved, pure presence</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                      <span>Recognition without judgment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contemplation Experience Showcase */}
        <section className="section-breathing bg-gradient-to-br from-breathing-gold/5 to-breathing-green/5">
          <div className="container-contemplative">
            <div className="text-center space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-semibold text-stone">
                  Questions That Know You
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Not generic prompts, but questions synthesized from your own
                  contemplative journey. AI that learns your patterns and
                  reflects them back as invitations for deeper inquiry.
                </p>
              </div>

              {/* Live Question Preview */}
              <div className="max-w-2xl mx-auto">
                <div
                  className={`
                    transition-all duration-1000 ease-in-out
                    ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}
                  `}
                >
                  {/* Question Card */}
                  <div className="bg-gradient-to-br from-breathing-gold/10 to-breathing-green/10 backdrop-blur-sm border border-breathing-gold/30 rounded-xl p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-breathing-gold rounded-full animate-pulse"></div>
                        <span className="text-breathing-gold font-medium">
                          Today's Question
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500 text-sm">
                        <span>2 reflections</span>
                      </div>
                    </div>

                    {/* Question */}
                    <blockquote className="text-stone text-xl md:text-2xl font-medium leading-relaxed mb-6">
                      "{sampleQuestions[currentChamber] || sampleQuestions[0]}"
                    </blockquote>

                    {/* Context */}
                    <p className="text-slate-600 italic">
                      Synthesized from your contemplative patterns and recent
                      reflections
                    </p>

                    {/* Progress Indicators */}
                    <div className="flex space-x-2 mt-6">
                      {sampleQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`
                            h-1 flex-1 rounded-full transition-all duration-300
                            ${
                              index === currentChamber
                                ? "bg-breathing-gold"
                                : "bg-slate-200"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sample Reflection Snippet */}
                  <div className="mt-6 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-breathing-green rounded-full"></div>
                      <span className="text-slate-600 text-sm">
                        Previous reflection excerpt:
                      </span>
                    </div>
                    <p className="text-slate-700 italic">
                      "There's something about recognizing that the search
                      itself might be the obstacle. Maybe the dedication is
                      already here, I just need to stop pretending I don't
                      notice it..."
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-center mt-8 space-y-3">
                  <p className="text-slate-600">
                    Each question emerges from your unique contemplative
                    journey—
                  </p>
                  <p className="text-slate-600">
                    technology that knows your patterns and invites deeper
                    recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Recognition */}
        <section className="section-breathing bg-white/50">
          <div className="container-contemplative max-w-4xl">
            <div className="card-stone p-8 md:p-12">
              <div className="text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-semibold text-stone">
                  This is About Recognition
                </h2>

                <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-slate-700">
                  <p>
                    Not about becoming a better person. About recognizing the
                    perfect awareness you've always been, beneath all the
                    seeking.
                  </p>

                  <div className="bg-breathing-green/10 border-l-4 border-breathing-green p-6 rounded-r-lg">
                    <p className="text-stone font-medium mb-2">
                      What you gain:
                    </p>
                    <p>
                      Technology that makes you more human, not more optimized.
                      Every interaction as an invitation to recognize what you
                      are.
                    </p>
                  </div>

                  <p>
                    Most technology demands your attention, optimizes your
                    behavior, makes you faster and more productive. Selah
                    inverts this entirely.
                  </p>

                  <p className="text-stone font-medium text-xl">
                    It serves consciousness itself.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Showcase - Updated */}
        <section className="section-breathing bg-gradient-to-br from-slate-100 to-emerald-100">
          <div className="container-contemplative">
            <div className="text-center space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-semibold text-stone">
                  Your Contemplative Companion
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Now available for Android beta testing. Four chambers of
                  consciousness exploration, designed for the moments when you
                  need presence most.
                </p>
              </div>

              {/* Phone Mockups */}
              <div className="flex justify-center space-x-8 overflow-x-auto pb-8">
                {/* Phone 1 - Meditation Chamber */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-[480px] bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-emerald-50 rounded-[2rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="h-8 flex items-center justify-center text-slate-600 text-sm font-medium">
                        SELAH
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                        <p className="text-slate-600">You are here</p>
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-breathing-green to-stone flex items-center justify-center text-4xl animate-breathe shadow-lg">
                          🧘
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-stone">
                            Meditation
                          </h3>
                          <p className="text-slate-600 text-sm">Present</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-slate-600 text-sm mt-4">
                    Breathing Partnership
                  </p>
                </div>

                {/* Phone 2 - Contemplation Chamber */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-[480px] bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-emerald-50 rounded-[2rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="h-8 flex items-center justify-center text-slate-600 text-sm font-medium">
                        SELAH
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col p-4 space-y-4">
                        <div className="bg-breathing-gold/20 border border-breathing-gold/30 rounded-lg p-4">
                          <p className="text-stone text-sm font-medium mb-2">
                            Daily Question
                          </p>
                          <p className="text-slate-700 text-xs leading-relaxed">
                            "What brought you here today, and what do you hope
                            to uncover about yourself?"
                          </p>
                        </div>

                        <div className="bg-white/70 rounded-lg p-3">
                          <p className="text-slate-600 text-xs mb-2">
                            Recent Questions
                          </p>
                          <div className="space-y-1">
                            <div className="text-xs text-slate-500">
                              No recent questions to show
                            </div>
                          </div>
                        </div>

                        <div className="bg-breathing-green/10 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">✨</span>
                            <span className="text-slate-700 text-xs font-medium">
                              Free-Flow Writing
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Continue your practice
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-slate-600 text-sm mt-4">
                    Personal Questions
                  </p>
                </div>

                {/* Phone 3 - Coming Soon */}
                <div className="flex-shrink-0 opacity-60">
                  <div className="w-64 h-[480px] bg-slate-300 rounded-[2.5rem] p-2 shadow-xl">
                    <div className="w-full h-full bg-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">🎨</div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-slate-600">
                            Creative Chamber
                          </h3>
                          <p className="text-slate-500 text-sm">Coming Soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-slate-500 text-sm mt-4">
                    Art from Presence
                  </p>
                </div>
              </div>

              {/* Updated App Store Badges */}
              <div className="space-y-6">
                <div className="flex justify-center space-x-6">
                  {/* Android - Now Available */}
                  <div className="bg-gradient-to-r from-breathing-green to-breathing-blue rounded-lg px-8 py-4 flex items-center space-x-3 shadow-lg">
                    <span className="text-3xl">🤖</span>
                    <div className="text-left text-white">
                      <div className="text-xs opacity-90">
                        Beta Available Now
                      </div>
                      <div className="font-semibold">Android Users</div>
                      <div className="font-bold">Join Beta Testing</div>
                    </div>
                  </div>

                  {/* iOS - Coming Soon */}
                  <div className="bg-slate-200 rounded-lg px-8 py-4 flex items-center space-x-3 opacity-60">
                    <span className="text-3xl">📱</span>
                    <div className="text-left">
                      <div className="text-xs text-slate-500">Coming Soon</div>
                      <div className="font-semibold text-slate-700">
                        iPhone Version
                      </div>
                      <div className="font-bold text-slate-700">
                        In Development
                      </div>
                    </div>
                  </div>
                </div>

                {/* Updated Status */}
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-3 bg-breathing-green/20 backdrop-blur-sm border border-breathing-green/30 rounded-full px-6 py-3">
                    <div className="w-3 h-3 bg-breathing-green rounded-full animate-pulse"></div>
                    <span className="text-stone font-medium">
                      🤖 Android beta active • 📱 iOS coming Q2 2025
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                    Android users can access the beta now through our testing
                    program. iPhone users will be notified as soon as the iOS
                    version is ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beta Testing Info - New Section */}
        <section className="section-breathing">
          <div className="container-contemplative max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Android Beta */}
              <div className="card-stone p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-breathing-green/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-stone">
                        Android Beta
                      </h3>
                      <p className="text-breathing-green text-sm font-medium">
                        Available Now
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-700 leading-relaxed">
                      Be among the first to experience contemplative technology.
                      Beta testers get:
                    </p>

                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                        <span>Early access to all four chambers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                        <span>Direct input on features and design</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                        <span>Priority support from our team</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-green rounded-full"></div>
                        <span>Free lifetime access to premium features</span>
                      </li>
                    </ul>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const emailInput = document.querySelector(
                          'input[type="email"]'
                        ) as HTMLInputElement;
                        emailInput?.focus();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center space-x-2 text-breathing-green hover:text-breathing-green/80 font-medium transition-colors"
                    >
                      <span>Join Android Beta →</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* iOS Coming Soon */}
              <div className="card-stone p-8 opacity-75">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-breathing-blue/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-stone">
                        iPhone Version
                      </h3>
                      <p className="text-breathing-blue text-sm font-medium">
                        Coming Soon
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-700 leading-relaxed">
                      We're crafting the iPhone experience with the same
                      contemplative care. Expected features:
                    </p>

                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                        <span>Native iOS design language</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                        <span>Enhanced haptic feedback for breathing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                        <span>Siri Shortcuts integration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-breathing-blue rounded-full"></div>
                        <span>All chambers from day one</span>
                      </li>
                    </ul>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const emailInput = document.querySelector(
                          'input[type="email"]'
                        ) as HTMLInputElement;
                        emailInput?.focus();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center space-x-2 text-breathing-blue hover:text-breathing-blue/80 font-medium transition-colors"
                    >
                      <span>Get Notified for iPhone →</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="section-breathing bg-stone/5 border-t border-stone/10">
        <div className="container-contemplative text-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 italic max-w-2xl mx-auto">
              "Technology that makes humans more human, built from stillness
              rather than urgency, designed to serve consciousness rather than
              consume it."
            </p>

            <div className="flex justify-center space-x-8 text-slate-600">
              <a href="/contact" className="hover:text-stone transition-colors">
                Contact
              </a>
              <a
                href="https://github.com/Ahiya1/selah-im.git"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone transition-colors"
              >
                Open Source
              </a>
              <a href="/privacy" className="hover:text-stone transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-stone transition-colors">
                Terms
              </a>
            </div>

            <p className="text-sm text-slate-500">
              © 2025 Selah • Technology that breathes with you • Made with
              reverence by Ahiya
            </p>

            {/* Session Debug Info (Development Only) */}
            {sessionData && process.env.NODE_ENV === "development" && (
              <div className="text-xs text-slate-400 mt-4 p-4 bg-slate-100 rounded-lg">
                Session: {formatDuration(sessionData.timeSpent)} • Scroll:{" "}
                {sessionData.maxScroll}% • Interactions:{" "}
                {sessionData.breathInteractions}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="bg-breathing-blue hover:bg-breathing-blue/80 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Share feedback"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-breathing-blue/20 rounded-full flex items-center justify-center">
                    <span className="text-breathing-blue">💭</span>
                  </div>
                  <h3 className="text-lg font-semibold text-stone">
                    Quick Feedback
                  </h3>
                </div>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Quick Feedback Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const message = formData.get("message") as string;

                  try {
                    const response = await fetch("/api/feedback", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "feedback",
                        message: message.trim(),
                        source: "floating-button",
                        context: {
                          sessionTime: sessionData?.timeSpent || 0,
                          breathInteractions:
                            sessionData?.breathInteractions || 0,
                        },
                      }),
                    });

                    const result = await response.json();

                    if (result.success) {
                      setShowFeedbackForm(false);
                      // Show a brief success message
                      const successDiv = document.createElement("div");
                      successDiv.className =
                        "fixed bottom-20 right-6 bg-breathing-green text-white px-4 py-2 rounded-lg shadow-lg z-50";
                      successDiv.textContent = "Thank you for your feedback!";
                      document.body.appendChild(successDiv);
                      setTimeout(
                        () => document.body.removeChild(successDiv),
                        3000
                      );
                    }
                  } catch (error) {
                    alert("Failed to send feedback. Please try again.");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-breathing-blue focus:border-breathing-blue resize-none"
                    placeholder="Your thoughts, questions, or feedback about Selah..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-breathing-blue hover:bg-breathing-blue/80 text-white rounded-lg transition-colors"
                  >
                    Send Feedback
                  </button>
                </div>
              </form>

              {/* Alternative */}
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-2">
                  Or share more detailed thoughts:
                </p>
                <a
                  href="/contact"
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-breathing-blue hover:text-breathing-blue/80 text-sm font-medium"
                >
                  Open Contact Form →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
