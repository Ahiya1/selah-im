// src/lib/session-manager.ts - SELAH Session Manager
// Technology that breathes with you
// Clean session-based architecture for contemplative journeys

import { generateId, generateSessionMetadata } from "./utils";
import { checkRateLimit, recordAIRequest } from "./rate-limiting";
import {
  streamContemplativeContent,
  generateTemplateContent,
  analyzeUserContext,
} from "./claude-client";
import { supabase } from "./supbase";
import type {
  PresentationSession,
  SessionCreationRequest,
  SessionUpdateRequest,
  BubbleContent,
  ClaudeStreamRequest,
  EngagementData,
  BubbleJourneyData,
} from "./types";

/**
 * SessionManager - Handles all session lifecycle and AI generation
 */
export class SessionManager {
  private sessions = new Map<string, PresentationSession>();

  /**
   * Create a new presentation session
   */
  async createSession(
    request: SessionCreationRequest
  ): Promise<PresentationSession> {
    const sessionId = generateId("session");
    const hasContext = Boolean(
      request.userContext && request.userContext.trim().length > 0
    );

    console.log(
      `🎭 SessionManager: Creating session ${sessionId}, AI=${hasContext}`
    );

    // Initialize session with empty content
    const session: PresentationSession = {
      id: sessionId,
      userContext: request.userContext || null,
      useAI: hasContext,
      userFingerprint: request.userFingerprint,

      bubbleContent: {
        philosophy: {
          content: "",
          isAI: false,
          isStreaming: false,
          hasStreamed: false,
        },
        experience: {
          content: "",
          isAI: false,
          isStreaming: false,
          hasStreamed: false,
        },
        invitation: {
          content: "",
          isAI: false,
          isStreaming: false,
          hasStreamed: false,
        },
      },

      journey: {
        bubblesVisited: [0],
        timeInEachBubble: { 0: Date.now() },
        aiInteractions: hasContext ? 1 : 0,
        contextProvided: hasContext,
        completedJourney: false,
      },

      analytics: {
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
            bubbleId: "welcome",
          },
        ],
        userAgent: request.sessionMetadata.userAgent,
        viewport: request.sessionMetadata.viewport,
        timestamp: request.sessionMetadata.timestamp,
        bubbleJourney: {
          bubblesVisited: [0],
          timeInEachBubble: { 0: Date.now() },
          aiInteractions: hasContext ? 1 : 0,
          contextProvided: hasContext,
          completedJourney: false,
        },
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
    };

    // Generate all content upfront
    await this.generateAllContent(session);

    // Store in memory and database
    this.sessions.set(sessionId, session);
    await this.persistSession(session);

    console.log(`✨ SessionManager: Session ${sessionId} created successfully`);
    return session;
  }

  /**
   * Get session by ID
   */
  async getSession(
    sessionId: string
  ): Promise<PresentationSession | undefined> {
    // Check memory first
    let session = this.sessions.get(sessionId);

    if (!session) {
      // Try to load from database
      session = await this.loadSessionFromDB(sessionId);
      if (session) {
        this.sessions.set(sessionId, session);
      }
    }

    return session;
  }

  /**
   * Update session with new data
   */
  async updateSession(
    request: SessionUpdateRequest
  ): Promise<PresentationSession | undefined> {
    const session = await this.getSession(request.sessionId);
    if (!session) return undefined;

    // Update context and regenerate AI content if needed
    if (request.updates.userContext !== undefined) {
      const hadContext = Boolean(
        session.userContext && session.userContext.trim().length > 0
      );
      const hasContext = Boolean(
        request.updates.userContext &&
          request.updates.userContext.trim().length > 0
      );

      session.userContext = request.updates.userContext;
      session.useAI = hasContext;

      // If context changed from empty to having content, regenerate AI
      if (!hadContext && hasContext) {
        console.log(
          `🔄 SessionManager: Context added, regenerating AI content for ${session.id}`
        );
        await this.generateAllContent(session);
        session.journey.aiInteractions++;
        session.analytics.bubbleJourney!.aiInteractions++;
      }
    }

    // Update analytics
    if (request.updates.breathInteractions !== undefined) {
      session.analytics.breathInteractions = request.updates.breathInteractions;
    }

    if (request.updates.timeSpent !== undefined) {
      session.analytics.timeSpent = request.updates.timeSpent;
    }

    if (request.updates.orbEngagements) {
      session.analytics.orbEngagements = request.updates.orbEngagements;
    }

    if (request.updates.currentBubble !== undefined) {
      const bubbleId = this.getBubbleId(request.updates.currentBubble);
      session.journey.bubblesVisited = [
        ...new Set([
          ...session.journey.bubblesVisited,
          request.updates.currentBubble,
        ]),
      ];

      // Add page view
      session.analytics.pageViews.push({
        path: "/",
        timestamp: new Date().toISOString(),
        timeSpent: 0,
        scrollDepth: 0,
        interactions: [],
        bubbleId,
      });
    }

    session.updatedAt = new Date().toISOString();

    // Persist changes
    await this.persistSession(session);

    return session;
  }

  /**
   * Get content for a specific bubble
   */
  async getBubbleContent(
    sessionId: string,
    bubbleId: "philosophy" | "experience" | "invitation"
  ): Promise<BubbleContent | undefined> {
    const session = await this.getSession(sessionId);
    if (!session) return undefined;

    return session.bubbleContent[bubbleId];
  }

  /**
   * Generate all bubble content for a session
   */
  private async generateAllContent(
    session: PresentationSession
  ): Promise<void> {
    const bubbles: Array<"philosophy" | "experience" | "invitation"> = [
      "philosophy",
      "experience",
      "invitation",
    ];

    for (const bubbleId of bubbles) {
      await this.generateBubbleContent(session, bubbleId);
    }
  }

  /**
   * Generate content for a specific bubble
   */
  private async generateBubbleContent(
    session: PresentationSession,
    bubbleId: "philosophy" | "experience" | "invitation"
  ): Promise<void> {
    const content = session.bubbleContent[bubbleId];

    // Skip if already generated
    if (content.hasStreamed) return;

    if (session.useAI && session.userContext) {
      // Try AI generation
      try {
        // Check rate limiting
        const rateLimitCheck = checkRateLimit(session.userFingerprint);

        if (!rateLimitCheck.allowed) {
          console.log(
            `⏳ SessionManager: Rate limited for ${session.id}, using templates`
          );
          content.content = this.getTemplateContent(bubbleId);
          content.isAI = false;
          content.rateLimited = true;
        } else {
          // Generate AI content
          console.log(
            `🤖 SessionManager: Generating AI content for ${session.id}:${bubbleId}`
          );

          const aiContent = await this.generateAIContent(session, bubbleId);
          content.content = aiContent;
          content.isAI = true;
          content.generatedAt = new Date().toISOString();

          // Record AI usage
          recordAIRequest(session.userFingerprint);
        }
      } catch (error) {
        console.error(
          `❌ SessionManager: AI generation failed for ${session.id}:${bubbleId}`,
          error
        );
        content.content = this.getTemplateContent(bubbleId);
        content.isAI = false;
      }
    } else {
      // Use template content
      content.content = this.getTemplateContent(bubbleId);
      content.isAI = false;
    }

    content.hasStreamed = true;
    content.isStreaming = false;
  }

  /**
   * Generate AI content using Claude
   */
  private async generateAIContent(
    session: PresentationSession,
    bubbleId: "philosophy" | "experience" | "invitation"
  ): Promise<string> {
    const sectionMap = {
      philosophy: "philosophy" as const,
      experience: "chambers" as const,
      invitation: "invitation" as const,
    };

    const request: ClaudeStreamRequest = {
      userContext: session.userContext!,
      section: sectionMap[bubbleId],
      sessionData: session.analytics,
    };

    const stream = await streamContemplativeContent(request);
    const reader = stream.getReader();

    let content = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += value;
      }
    } finally {
      reader.releaseLock();
    }

    return content.trim();
  }

  /**
   * Get template content for fallback
   */
  private getTemplateContent(
    bubbleId: "philosophy" | "experience" | "invitation"
  ): string {
    const sectionMap = {
      philosophy: "philosophy" as const,
      experience: "chambers" as const,
      invitation: "invitation" as const,
    };

    const templateContent = generateTemplateContent(sectionMap[bubbleId]);
    return templateContent.essence || "";
  }

  /**
   * Get bubble ID from index
   */
  private getBubbleId(index: number): string {
    const bubbleIds = ["welcome", "philosophy", "experience", "invitation"];
    return bubbleIds[index] || "unknown";
  }

  /**
   * Persist session to database
   */
  private async persistSession(session: PresentationSession): Promise<void> {
    try {
      const { error } = await supabase.from("analytics").upsert({
        session_id: session.id,
        time_spent: session.analytics.timeSpent,
        breath_interactions: session.analytics.breathInteractions,
        engagement_data: {
          type: "presentation_session",
          session,
        },
      });

      if (error) {
        console.error("Failed to persist session:", error);
      }
    } catch (error) {
      console.warn("Session persistence failed:", error);
    }
  }

  /**
   * Load session from database
   */
  private async loadSessionFromDB(
    sessionId: string
  ): Promise<PresentationSession | undefined> {
    try {
      const { data, error } = await supabase
        .from("analytics")
        .select("engagement_data")
        .eq("session_id", sessionId)
        .eq("engagement_data->>type", "presentation_session")
        .single();

      if (error || !data) return undefined;

      return data.engagement_data.session as PresentationSession;
    } catch (error) {
      console.warn("Failed to load session from DB:", error);
      return undefined;
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = Date.now();
    const expireTime = 24 * 60 * 60 * 1000; // 24 hours
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - new Date(session.createdAt).getTime();
      if (sessionAge > expireTime) {
        session.status = "expired";
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get session statistics for admin
   */
  getStats(): {
    totalSessions: number;
    activeSessions: number;
    aiSessions: number;
    averageTimeSpent: number;
  } {
    const sessions = Array.from(this.sessions.values());

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter((s) => s.status === "active").length,
      aiSessions: sessions.filter((s) => s.useAI).length,
      averageTimeSpent:
        sessions.reduce((sum, s) => sum + s.analytics.timeSpent, 0) /
          sessions.length || 0,
    };
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();

// Cleanup expired sessions every hour
if (typeof setInterval !== "undefined") {
  setInterval(
    async () => {
      const cleaned = await sessionManager.cleanupExpiredSessions();
      if (cleaned > 0) {
        console.log(`SELAH: Cleaned up ${cleaned} expired sessions`);
      }
    },
    60 * 60 * 1000
  );
}
