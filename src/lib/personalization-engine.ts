// src/lib/personalization-engine.ts - SELAH Personalization Engine
// Technology that breathes with you
// Sacred content generation and context analysis

import {
  analyzeUserContext,
  generateTemplateContent,
  streamContemplativeContent,
} from "./claude-client";
import {
  checkRateLimit,
  recordAIRequest,
  generateUserFingerprint,
  getRateLimitMessage,
} from "./rate-limiting";
import type {
  ClaudeStreamRequest,
  ClaudeStreamResponse,
  PersonalizationContext,
  EngagementData,
} from "./types";

/**
 * Main personalization engine - orchestrates the entire AI experience
 */
export class PersonalizationEngine {
  private fallbackContentCache = new Map<string, any>();

  constructor() {
    this.preloadFallbackContent();
  }

  /**
   * Generate personalized content for a user
   */
  async generatePersonalizedContent(
    request: ClaudeStreamRequest,
    userFingerprint: string
  ): Promise<{
    stream?: ReadableStream;
    fallbackContent?: any;
    rateLimited: boolean;
    aiGenerated: boolean;
    message?: string;
  }> {
    // Check rate limiting first
    const rateLimitCheck = checkRateLimit(userFingerprint);

    if (!rateLimitCheck.allowed) {
      return {
        fallbackContent: this.generateFallbackContent(request),
        rateLimited: true,
        aiGenerated: false,
        message: getRateLimitMessage(rateLimitCheck.resetTime),
      };
    }

    // Validate user context
    if (!this.isValidContext(request.userContext)) {
      return {
        fallbackContent: this.generateFallbackContent(request),
        rateLimited: false,
        aiGenerated: false,
        message:
          "Universal journey - context not specific enough for personalization",
      };
    }

    try {
      // Record the AI request
      recordAIRequest(userFingerprint);

      // Generate AI content
      const stream = await streamContemplativeContent(request);

      return {
        stream,
        rateLimited: false,
        aiGenerated: true,
      };
    } catch (error) {
      console.error("AI generation failed:", error);

      // Return fallback content on error
      return {
        fallbackContent: this.generateFallbackContent(request),
        rateLimited: false,
        aiGenerated: false,
        message: "AI temporarily unavailable - using sacred template",
      };
    }
  }

  /**
   * Validate if user context is sufficient for personalization
   */
  private isValidContext(userContext: string): boolean {
    const trimmed = userContext.trim();

    // Minimum length check
    if (trimmed.length < 10) return false;

    // Must contain meaningful content (not just "hello" or "test")
    const meaningfulWords = [
      "therapist",
      "developer",
      "meditation",
      "app",
      "technology",
      "heard",
      "recommended",
      "mentioned",
      "building",
      "experience",
      "practice",
      "curious",
      "wondering",
      "friend",
      "colleague",
    ];

    const hasContext = meaningfulWords.some((word) =>
      trimmed.toLowerCase().includes(word)
    );

    return hasContext;
  }

  /**
   * Generate fallback content when AI is unavailable
   */
  private generateFallbackContent(request: ClaudeStreamRequest): any {
    const cacheKey = request.section;

    if (this.fallbackContentCache.has(cacheKey)) {
      return this.fallbackContentCache.get(cacheKey);
    }

    // Analyze context even for fallback to provide some personalization
    const context = request.userContext
      ? analyzeUserContext(request.userContext)
      : undefined;

    const content = generateTemplateContent(request.section, context);

    // Add some context-specific touches to template content
    if (context) {
      this.enhanceTemplateContent(content, context, request);
    }

    this.fallbackContentCache.set(cacheKey, content);
    return content;
  }

  /**
   * Enhance template content with context-specific touches
   */
  private enhanceTemplateContent(
    content: any,
    context: PersonalizationContext,
    request: ClaudeStreamRequest
  ): void {
    switch (context.userBackground) {
      case "therapist":
        if (request.section === "recognition") {
          content.recognition =
            "Right now, you're experiencing what therapeutic technology could look like - space for presence instead of tracking and optimization. Feel the difference?";
        }
        break;

      case "developer":
        if (request.section === "philosophy") {
          content.problem =
            "You understand the attention economy from the inside - algorithms optimizing for engagement, not wellbeing. Technology extracting value rather than serving consciousness.";
        }
        break;

      case "meditation":
        if (request.section === "recognition") {
          content.recognition =
            "This breathing orb honors your practice - technology as meditation partner, not instructor. No streaks, no tracking, just shared presence.";
        }
        break;

      case "curious":
        if (request.section === "recognition") {
          content.recognition =
            "Your curiosity led you to experience something rare - technology that responds without agenda, creates space without demands.";
        }
        break;
    }
  }

  /**
   * Preload fallback content for all sections
   */
  private preloadFallbackContent(): void {
    const sections: ClaudeStreamRequest["section"][] = [
      "recognition",
      "chambers",
      "philosophy",
      "invitation",
    ];

    sections.forEach((section) => {
      const content = generateTemplateContent(section);
      this.fallbackContentCache.set(section, content);
    });
  }

  /**
   * Get personalization statistics for admin dashboard
   */
  getPersonalizationStats(): {
    cacheSize: number;
    fallbackCacheHits: number;
    aiRequestsToday: number;
    rateLimitedRequests: number;
  } {
    // In a real implementation, these would come from persistent storage
    return {
      cacheSize: this.fallbackContentCache.size,
      fallbackCacheHits: 0, // Would track this in production
      aiRequestsToday: 0, // Would get from rate limiting storage
      rateLimitedRequests: 0, // Would get from rate limiting storage
    };
  }

  /**
   * Clear fallback content cache
   */
  clearCache(): void {
    this.fallbackContentCache.clear();
    this.preloadFallbackContent();
  }
}

/**
 * Global personalization engine instance
 */
export const personalizationEngine = new PersonalizationEngine();

/**
 * Convert streaming content to contemplative pace
 */
export function formatStreamForContemplativePace(
  stream: ReadableStream
): ReadableStream {
  const reader = stream.getReader();

  return new ReadableStream({
    async start(controller) {
      try {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Send any remaining content
            if (buffer.trim()) {
              controller.enqueue(buffer);
            }
            controller.close();
            break;
          }

          buffer += value;

          // Send content word by word for contemplative pacing
          const words = buffer.split(" ");
          buffer = words.pop() || ""; // Keep last incomplete word in buffer

          for (const word of words) {
            if (word.trim()) {
              controller.enqueue(word + " ");

              // Add contemplative delay between words
              await new Promise((resolve) =>
                setTimeout(resolve, getContemplativeDelay(word))
              );
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Calculate contemplative delay based on word characteristics
 */
function getContemplativeDelay(word: string): number {
  const baseDelay = 120; // Base 120ms between words

  // Longer pause after punctuation for breathing space
  if (word.endsWith(".") || word.endsWith("?") || word.endsWith("!")) {
    return 400;
  }

  // Slightly longer pause after commas
  if (word.endsWith(",")) {
    return 200;
  }

  // Vary delay based on word length for natural rhythm
  const lengthFactor = Math.min(word.length / 10, 1);
  const variance = Math.random() * 40; // 0-40ms variance

  return Math.floor(baseDelay + lengthFactor * 50 + variance);
}

/**
 * Analyze content sentiment for contemplative quality
 */
export function analyzeContemplativeQuality(content: string): {
  score: number; // 0-100
  feedback: string[];
  hasOptimizationLanguage: boolean;
  hasContemplativeLanguage: boolean;
} {
  const optimizationWords = [
    "improve",
    "optimize",
    "better",
    "faster",
    "more efficient",
    "boost",
    "enhance",
    "upgrade",
    "maximize",
    "achieve",
  ];

  const contemplativeWords = [
    "recognize",
    "presence",
    "awareness",
    "stillness",
    "breath",
    "sacred",
    "contemplative",
    "space",
    "witness",
    "being",
  ];

  const contentLower = content.toLowerCase();

  const hasOptimizationLanguage = optimizationWords.some((word) =>
    contentLower.includes(word)
  );

  const hasContemplativeLanguage = contemplativeWords.some((word) =>
    contentLower.includes(word)
  );

  let score = 50; // Start neutral

  // Subtract for optimization language
  if (hasOptimizationLanguage) score -= 30;

  // Add for contemplative language
  if (hasContemplativeLanguage) score += 30;

  // Add for present-tense language
  if (
    contentLower.includes("right now") ||
    contentLower.includes("this moment")
  ) {
    score += 10;
  }

  // Add for recognition language
  if (contentLower.includes("recognize") || contentLower.includes("already")) {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  const feedback: string[] = [];

  if (hasOptimizationLanguage) {
    feedback.push("Contains optimization-focused language");
  }

  if (hasContemplativeLanguage) {
    feedback.push("Uses contemplative language appropriately");
  }

  if (score < 40) {
    feedback.push("Content may be too goal-oriented for contemplative context");
  } else if (score > 70) {
    feedback.push("Content maintains contemplative quality");
  }

  return {
    score,
    feedback,
    hasOptimizationLanguage,
    hasContemplativeLanguage,
  };
}

/**
 * Generate content preview for testing
 */
export async function generateContentPreview(
  userContext: string,
  section: ClaudeStreamRequest["section"]
): Promise<{
  aiPreview?: string;
  templatePreview: string;
  personalizationContext: PersonalizationContext;
  qualityAnalysis: ReturnType<typeof analyzeContemplativeQuality>;
}> {
  const context = analyzeUserContext(userContext);
  const templateContent = generateTemplateContent(section, context);
  const templatePreview = Object.values(templateContent).join(" ");

  let aiPreview: string | undefined;

  try {
    // Generate a short AI preview (not rate limited for preview)
    const request: ClaudeStreamRequest = {
      userContext,
      section,
      templateStructure: templateContent,
    };

    const stream = await streamContemplativeContent(request);
    const reader = stream.getReader();

    let preview = "";
    let wordCount = 0;

    try {
      while (wordCount < 50) {
        // First 50 words for preview
        const { done, value } = await reader.read();
        if (done) break;

        preview += value;
        wordCount = preview.split(" ").length;
      }
    } finally {
      reader.releaseLock();
    }

    aiPreview = preview;
  } catch (error) {
    console.warn("AI preview generation failed:", error);
  }

  const qualityAnalysis = analyzeContemplativeQuality(
    aiPreview || templatePreview
  );

  return {
    aiPreview,
    templatePreview,
    personalizationContext: context,
    qualityAnalysis,
  };
}
