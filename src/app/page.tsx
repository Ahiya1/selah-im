// src/app/page.tsx - SELAH Four Section Contemplative Journey
// Technology that breathes with you - Scroll-snap breathing experience

"use client";

import React, { useState, useEffect, useRef } from "react";
import { generateSessionMetadata } from "@/lib/utils";
import type { EngagementData } from "@/lib/types";

// Section Components
import RecognitionSection from "@/components/sections/RecognitionSection";
import ChambersSection from "@/components/sections/ChambersSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import InvitationSection from "@/components/sections/InvitationSection";
import ScrollSnapContainer from "@/components/ui/ScrollSnapContainer";

export default function SelahHomePage(): JSX.Element {
  // User context and session tracking
  const [userContext, setUserContext] = useState<string>("");
  const [useAI, setUseAI] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<EngagementData | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const sessionStartTime = useRef<number>(Date.now());

  // Initialize session tracking
  useEffect(() => {
    const metadata = generateSessionMetadata();
    const initialSessionData: EngagementData = {
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
    };

    setSessionData(initialSessionData);
  }, []);

  // Handle context submission
  const handleContextSubmit = (context: string) => {
    setUserContext(context);
    setUseAI(context.trim().length > 0);
  };

  // Handle breathing interactions
  const handleBreathingInteraction = () => {
    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            breathInteractions: prev.breathInteractions + 1,
          }
        : prev
    );
  };

  // Handle section transitions
  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
  };

  // Jump to signup (shortcut)
  const jumpToSignup = () => {
    const signupSection = document.getElementById("invitation-section");
    signupSection?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionProps = {
    userContext,
    useAI,
    sessionData,
    onBreathingInteraction: handleBreathingInteraction,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2d5a3d 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Breathing gradient overlay */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none animate-breathe-slow"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            rgba(45, 90, 61, 0.1) 0%, 
            rgba(45, 90, 61, 0.05) 40%, 
            transparent 70%
          )`,
        }}
      />

      <ScrollSnapContainer
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      >
        {/* Section 1: Recognition & Entry */}
        <RecognitionSection
          {...sectionProps}
          onContextSubmit={handleContextSubmit}
          onJumpToSignup={jumpToSignup}
        />

        {/* Section 2: Chambers Reveal */}
        <ChambersSection {...sectionProps} />

        {/* Section 3: Philosophy & Recognition */}
        <PhilosophySection {...sectionProps} />

        {/* Section 4: Invitation & Signup */}
        <InvitationSection {...sectionProps} />
      </ScrollSnapContainer>
    </div>
  );
}
