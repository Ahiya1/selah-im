// src/lib/claude-client.ts - SELAH Claude Client - MINIMAL CONTEMPLATIVE PROMPTS
// Technology that breathes with you
// Sacred contemplative prompting system - haikus not essays

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import type {
  ClaudeStreamRequest,
  PersonalizationContext,
  EngagementData,
} from "./types";

/**
 * Get the configured Claude model
 */
export function getClaudeModel() {
  const modelId = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
  return anthropic(modelId);
}

/**
 * Analyze user context to determine personalization approach
 */
export function analyzeUserContext(
  userContext: string
): PersonalizationContext {
  const context = userContext.toLowerCase();

  // Detect background type
  let userBackground: PersonalizationContext["userBackground"] = "unknown";

  if (
    context.includes("therapist") ||
    context.includes("therapy") ||
    context.includes("counselor")
  ) {
    userBackground = "therapist";
  } else if (
    context.includes("developer") ||
    context.includes("ai") ||
    context.includes("building") ||
    context.includes("coding")
  ) {
    userBackground = "developer";
  } else if (
    context.includes("meditat") ||
    context.includes("mindful") ||
    context.includes("buddhist") ||
    context.includes("zen")
  ) {
    userBackground = "meditation";
  } else if (
    context.includes("curious") ||
    context.includes("wonder") ||
    context.includes("explore")
  ) {
    userBackground = "curious";
  }

  // Extract keywords
  const keywords = extractKeywords(context);

  // Determine tone
  let tone: PersonalizationContext["tone"] = "general";
  if (userBackground === "therapist") tone = "therapeutic";
  else if (userBackground === "developer") tone = "technical";
  else if (userBackground === "curious") tone = "exploratory";

  // Determine experience level
  let experience: PersonalizationContext["experience"] = "beginner";
  if (
    context.includes("experience") ||
    context.includes("practice") ||
    context.includes("years")
  ) {
    experience = "intermediate";
  }
  if (
    context.includes("advanced") ||
    context.includes("deep") ||
    context.includes("studied")
  ) {
    experience = "advanced";
  }

  return {
    userBackground,
    keywords,
    tone,
    experience,
  };
}

/**
 * Extract meaningful keywords from user context
 */
function extractKeywords(context: string): string[] {
  const meaningfulWords = context
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "that",
          "this",
          "with",
          "from",
          "they",
          "have",
          "been",
          "said",
          "what",
          "were",
          "some",
          "like",
          "would",
          "could",
          "should",
        ].includes(word)
    )
    .slice(0, 10);

  return meaningfulWords;
}

/**
 * MINIMAL: Generate system prompt for contemplative brevity
 */
export function generateSystemPrompt(
  section: ClaudeStreamRequest["section"],
  context: PersonalizationContext,
  sessionData?: EngagementData
): string {
  const basePrompt = `You are SELAH - technology that serves consciousness.

Core principles:
- Write EXACTLY 10-25 words maximum
- One contemplative breath, one insight
- Recognition over explanation
- Present-moment awareness
- No optimization language

User: ${context.userBackground}
Keywords: ${context.keywords.slice(0, 3).join(", ")}`;

  const sectionPrompts = {
    recognition: `${basePrompt}

Write 10-20 words recognizing their background and pointing to breathing with responsive technology.

Examples:
- "Therapy creates space. Technology can too. You felt this breathing together."
- "You build with code. This builds with breath. Feel the difference."
- "Your curiosity led you to responsive technology. One breath shared."

${getBackgroundEssence(context.userBackground)}`,

    philosophy: `${basePrompt}

Write 15-25 words contrasting extractive vs contemplative technology in their language.

Examples:
- "Most apps demand attention. This responds to breath. Technology serving consciousness."
- "Code optimizes users. This recognizes being. Feel the inversion."
- "Apps track meditation. This breathes with you. Recognition, not optimization."

${getBackgroundEssence(context.userBackground)}`,

    chambers: `${basePrompt}

Write 10-20 words inviting exploration of four consciousness chambers.

Examples:
- "Four doorways: breath, questions, creation, recognition. Touch to explore."
- "Meditation, contemplation, creativity, being seen. Your inner architecture."
- "Four chambers where consciousness meets itself. Begin anywhere."

${getBackgroundEssence(context.userBackground)}`,

    invitation: `${basePrompt}

Write 10-15 words inviting them to continue this contemplative journey.

Examples:
- "Continue this recognition. Technology that breathes with consciousness."
- "Your contemplative journey begins. Stay connected to this experience."
- "Recognition continues. Join technology that serves awareness."

${getBackgroundEssence(context.userBackground)}`,
  };

  return sectionPrompts[section];
}

/**
 * MINIMAL: Background-specific essence guidance
 */
function getBackgroundEssence(
  background: PersonalizationContext["userBackground"]
): string {
  switch (background) {
    case "therapist":
      return `Therapeutic essence: Space over tracking, presence over goals, recognition over pathology.`;

    case "developer":
      return `Developer essence: Code serves consciousness, algorithms create space, technology responds rather than extracts.`;

    case "meditation":
      return `Meditation essence: Partner not instructor, recognition not achievement, breath not metrics.`;

    case "curious":
      return `Curiosity essence: Wonder over analysis, exploration over explanation, presence over performance.`;

    default:
      return `Universal essence: Recognition over optimization, presence over productivity, consciousness over engagement.`;
  }
}

/**
 * MINIMAL: Generate template content for fallback
 */
export function generateTemplateContent(
  section: ClaudeStreamRequest["section"],
  context?: PersonalizationContext
): Record<string, string> {
  const templates = {
    recognition: {
      essence:
        "You found your way here. Technology that responds, not demands.",
    },

    philosophy: {
      essence:
        "Most technology demands attention. Selah serves consciousness. You felt this breathing.",
    },

    chambers: {
      essence: "Four chambers for consciousness to explore itself.",
    },

    invitation: {
      essence: "Begin your recognition. Technology that breathes with you.",
    },
  };

  return templates[section] || templates.recognition;
}

/**
 * Stream contemplative content from Claude
 */
export async function streamContemplativeContent(
  request: ClaudeStreamRequest
): Promise<ReadableStream> {
  const context = analyzeUserContext(request.userContext);
  const systemPrompt = generateSystemPrompt(
    request.section,
    context,
    request.sessionData
  );

  const userMessage = createUserMessage(request, context);

  try {
    const result = await streamText({
      model: getClaudeModel(),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.8, // Higher creativity for poetic brevity
      maxTokens: 100, // Strict limit for brevity
    });

    return result.textStream;
  } catch (error) {
    console.error("Claude streaming error:", error);
    throw error;
  }
}

/**
 * MINIMAL: Create contextual user message for Claude
 */
function createUserMessage(
  request: ClaudeStreamRequest,
  context: PersonalizationContext
): string {
  const messages = {
    recognition: `Context: "${request.userContext}"

They just breathed with responsive technology. Write 10-20 words recognizing their ${context.userBackground} background and this moment.

Remember: One breath, one insight. Recognition not explanation.`,

    philosophy: `Background: ${context.userBackground}
Context: "${request.userContext}"

Write 15-25 words contrasting extractive technology vs contemplative technology in their language. Pure essence.`,

    chambers: `Background: ${context.userBackground}
Context: "${request.userContext}"

Write 10-20 words inviting exploration of four consciousness chambers: meditation, contemplation, creativity, being seen.`,

    invitation: `Background: ${context.userBackground}
Journey: They experienced contemplative technology
Breaths: ${request.sessionData?.breathInteractions || 0}

Write 10-15 words inviting them to continue this recognition journey.`,
  };

  return messages[request.section] || messages.recognition;
}

/**
 * Validate Claude API configuration
 */
export function validateClaudeConfig(): {
  valid: boolean;
  error?: string;
} {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      valid: false,
      error: "ANTHROPIC_API_KEY environment variable is required",
    };
  }

  if (!process.env.CLAUDE_MODEL) {
    console.warn(
      "CLAUDE_MODEL not set, using default: claude-sonnet-4-20250514"
    );
  }

  return { valid: true };
}

/**
 * Test Claude connection
 */
export async function testClaudeConnection(): Promise<{
  success: boolean;
  error?: string;
  model?: string;
}> {
  try {
    const model = getClaudeModel();

    const result = await streamText({
      model,
      messages: [
        {
          role: "user",
          content: 'Respond with exactly: "SELAH connection test successful"',
        },
      ],
      maxTokens: 50,
    });

    // Read the stream to test it works
    const reader = result.textStream.getReader();
    let response = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        response += value;
      }
    } finally {
      reader.releaseLock();
    }

    const success = response.includes("SELAH connection test successful");

    return {
      success,
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
      error: success ? undefined : "Unexpected response from Claude",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
