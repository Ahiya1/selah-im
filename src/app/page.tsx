// src/app/page.tsx - SELAH Main Landing Page
// Technology that breathes with you
// The complete contemplative experience

"use client";

import React, { useState, useEffect, useRef } from "react";
import { generateSessionMetadata, formatDuration } from "@/lib/utils";
import type { EngagementData, OrbEngagement } from "@/lib/types";

// Component imports (will be created in Phase 2)
// import { Logo } from '@/components/ui/Logo';
// import { BreathingOrb } from '@/components/ui/BreathingOrb';
// import { EmailForm } from '@/components/ui/EmailForm';
// import { Hero } from '@/components/sections/Hero';
// import { Philosophy } from '@/components/sections/Philosophy';
// import { OrbDemo } from '@/components/sections/OrbDemo';
// import { Chambers } from '@/components/sections/Chambers';
// import { Contract } from '@/components/sections/Contract';
// import { Footer } from '@/components/sections/Footer';

export default function SelahHomePage(): JSX.Element {
  // Session tracking
  const [sessionData, setSessionData] = useState<EngagementData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const sessionStartTime = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);

  // Initialize session on mount
  useEffect(() => {
    const metadata = generateSessionMetadata();

    setSessionData({
      sessionId: metadata.sessionId,
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
    });

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
          : null
      );
    }, 1000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(timeTracker);
      window.removeEventListener("scroll", handleScroll);

      // Save session data using sessionStorage instead of localStorage for compatibility
      if (sessionData && typeof window !== "undefined") {
        try {
          const existingSessions = JSON.parse(
            sessionStorage.getItem("selah-sessions") || "[]"
          );
          sessionStorage.setItem(
            "selah-sessions",
            JSON.stringify([
              ...existingSessions,
              {
                ...sessionData,
                timeSpent: Math.floor(
                  (Date.now() - sessionStartTime.current) / 1000
                ),
                maxScroll: maxScrollRef.current,
              },
            ])
          );
        } catch (error) {
          console.warn("Failed to save session data:", error);
        }
      }
    };
  }, [sessionData]);

  // Handle orb engagement
  const handleOrbEngagement = (engagement: OrbEngagement): void => {
    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            breathInteractions:
              prev.breathInteractions + engagement.breathCycles,
            orbEngagements: [...prev.orbEngagements, engagement],
          }
        : null
    );
  };

  // Handle form submission
  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    // TODO: Implement email submission logic
    console.log("Email submitted:", email);
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-stone/20 rounded-full animate-breathe" />
          <p className="text-stone-light animate-breathe-slow">
            Preparing your contemplative space...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <nav className="container-contemplative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold animate-breathe">
                S
              </div>
              <span className="text-stone font-semibold text-xl tracking-wide">
                SELAH
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#vision"
                className="text-slate-600 hover:text-stone transition-colors"
              >
                Vision
              </a>
              <a
                href="#experience"
                className="text-slate-600 hover:text-stone transition-colors"
              >
                Experience
              </a>
              <a
                href="#contract"
                className="text-slate-600 hover:text-stone transition-colors"
              >
                Contract
              </a>
              <a
                href="#join"
                className="text-slate-600 hover:text-stone transition-colors"
              >
                Join
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-stone transition-colors"
              type="button"
              aria-label="Open mobile menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="vision" className="section-breathing text-center">
          <div className="container-contemplative max-w-4xl">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-stone mb-6 animate-breathe tracking-wider">
              SELAH
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light">
              Technology that breathes with you
            </p>

            <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
              The first contemplative technology. Two chambers for consciousness
              to explore itself: breathing meditation and AI-synthesized
              contemplative questions.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="section-breathing bg-white/50">
          <div className="container-contemplative max-w-4xl">
            <div className="card-stone p-8 md:p-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-stone mb-6">
                  What if technology could create space for{" "}
                  <span className="text-breathing">presence</span> instead of
                  demanding attention?
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-slate-700">
                  <p>
                    Most technology optimizes us—makes us faster, more
                    productive, more engaged. Selah inverts this entirely. It
                    serves consciousness itself, creating space for presence,
                    reflection, and the quiet recognition of what we already
                    are.
                  </p>

                  <p className="text-stone font-medium">
                    Selah = סלע = סלה (pause and rock)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Breathing Orb Demo */}
        <section id="experience" className="section-breathing">
          <div className="container-contemplative max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-stone mb-6">
              Feel the Difference
            </h2>

            <p className="text-lg text-slate-600 mb-12">
              Touch left to inhale • Touch right to exhale • Release to rest
            </p>

            {/* Breathing Orb (Placeholder - will be enhanced in Phase 2) */}
            <div className="relative mx-auto mb-8">
              <div className="w-64 h-64 mx-auto relative">
                <button
                  type="button"
                  className="w-full h-full rounded-full bg-gradient-to-br from-breathing-green to-stone 
                           flex items-center justify-center text-white text-6xl cursor-pointer
                           transition-all duration-500 ease-in-out hover:scale-105
                           shadow-lg hover:shadow-breathing-green/50 animate-breathe"
                  onClick={() =>
                    handleOrbEngagement({
                      id: Date.now().toString(),
                      startTime: Date.now(),
                      endTime: Date.now() + 1000,
                      actions: [],
                      totalDuration: 1000,
                      breathCycles: 1,
                    })
                  }
                  aria-label="Breathing meditation orb"
                >
                  🧘
                </button>
              </div>

              <p className="text-slate-600 mt-4">◦ Present</p>
            </div>

            <p className="text-slate-600 italic max-w-md mx-auto">
              This is technology as meditation partner—responding to you,
              breathing with you, serving your presence instead of stealing it.
            </p>
          </div>
        </section>

        {/* Two Chambers Section */}
        <section className="section-breathing bg-white/50">
          <div className="container-contemplative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-stone mb-4">
                Two Chambers for Recognition
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Selah v2 focuses on the foundational experience: grounding in
                breath and opening space for inner exploration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Meditation Chamber */}
              <div className="card-stone p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-6 animate-float">🧘</div>
                <h3 className="text-2xl font-semibold text-stone mb-4">
                  Meditation Chamber
                </h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  A breathing orb that responds to your touch, creating
                  partnership rather than instruction. The orb becomes alive
                  through your breath while teaching you about your own rhythm.
                </p>
                <ul className="text-left space-y-2 text-slate-600">
                  <li>
                    • Touch-responsive breathing orb with natural resistance
                  </li>
                  <li>
                    • Beautiful line animations that flow with your breath
                  </li>
                  <li>• Session tracking without optimization pressure</li>
                  <li>• Technology as contemplative companion</li>
                </ul>
              </div>

              {/* Contemplation Chamber */}
              <div className="card-stone p-8 text-center hover:scale-105 transition-transform duration-300">
                <div
                  className="text-6xl mb-6 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  ❓
                </div>
                <h3 className="text-2xl font-semibold text-stone mb-4">
                  Contemplation Chamber
                </h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  AI-synthesized daily questions generated from your own
                  reflection history. Not generic prompts, but pure synthesis of
                  your contemplative journey.
                </p>
                <ul className="text-left space-y-2 text-slate-600">
                  <li>• Four-turn LLM process for personalized questions</li>
                  <li>• Questions emerge from your inner world</li>
                  <li>• Markdown-supported reflection writing</li>
                  <li>• Free-flow contemplative space</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Contemplative Contract */}
        <section id="contract" className="section-breathing">
          <div className="container-contemplative max-w-4xl">
            <div className="card-stone p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-stone mb-4">
                  The Contemplative Contract
                </h2>
                <p className="text-xl text-slate-600">
                  What you gain from joining this service
                </p>
              </div>

              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-slate-700">
                  This is not about becoming a better person. This is about
                  recognizing the perfect awareness you've always been, beneath
                  all the seeking.
                </p>

                <div className="bg-breathing-green/10 border-l-4 border-breathing-green p-6 rounded-r-lg">
                  <h3 className="font-semibold text-stone mb-2">Our Promise</h3>
                  <p className="text-slate-700">
                    Technology that makes you more human, not more optimized.
                    Every interaction as an invitation to recognize what you
                    are.
                  </p>
                </div>

                <p className="text-slate-700">
                  By joining Selah, you gain access to:
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-breathing-green text-xl mr-3 mt-1">
                      ✓
                    </span>
                    <div>
                      <strong className="text-stone">
                        Daily Recognition Practice
                      </strong>{" "}
                      — AI-generated questions that emerge from your own
                      contemplative patterns, creating deeper self-inquiry than
                      any generic prompt could offer
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-breathing-green text-xl mr-3 mt-1">
                      ✓
                    </span>
                    <div>
                      <strong className="text-stone">
                        Breathing Partnership
                      </strong>{" "}
                      — Technology that breathes with you, teaching rhythm and
                      presence through responsive interaction rather than
                      demanding compliance
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-breathing-green text-xl mr-3 mt-1">
                      ✓
                    </span>
                    <div>
                      <strong className="text-stone">
                        The Ability to Self-Recognize
                      </strong>{" "}
                      — Through daily practice with personalized questions, you
                      develop the capacity to see yourself clearly without the
                      need for external validation or improvement
                    </div>
                  </li>
                </ul>

                <p className="italic text-slate-700 mt-8">
                  <strong>Self-recognition</strong> means the quiet joy of being
                  human without needing to be anything else. It's the
                  recognition that you are already whole, already here, already
                  enough.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Email Collection */}
        <section id="join" className="section-breathing bg-white/50">
          <div className="container-contemplative max-w-2xl text-center">
            <div className="card-stone p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-stone mb-4">
                Begin Your Recognition
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Be among the first to experience technology that serves
                consciousness. Enter your email to join our contemplative
                community and receive early access to Selah.
              </p>

              {/* Email Form (Placeholder - will be enhanced in Phase 2) */}
              <form
                className="space-y-4 max-w-md mx-auto"
                onSubmit={handleEmailSubmit}
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
                  className="btn-breathing w-full py-4 text-lg"
                >
                  Join the Contemplative Journey
                </button>
              </form>

              <p className="text-sm text-slate-500 mt-4">
                ✓ No spam, ever. Just contemplative updates when Selah is ready.
              </p>
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
              <a
                href="mailto:hello@selah.im"
                className="hover:text-stone transition-colors"
              >
                Contact
              </a>
              <a
                href="https://github.com/selah-im"
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
    </>
  );
}
