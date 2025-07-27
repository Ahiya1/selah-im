// src/lib/claude-client.ts - SELAH Claude Client Configuration - FIXED
// Technology that breathes with you
// Sacred contemplative prompting system

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
    .slice(0, 10); // Top 10 keywords

  return meaningfulWords;
}

/**
 * Generate system prompt based on personalization context
 */
export function generateSystemPrompt(
  section: ClaudeStreamRequest["section"],
  context: PersonalizationContext,
  sessionData?: EngagementData
): string {
  const basePrompt = `You are part of SELAH, technology that serves consciousness rather than consuming it. You create contemplative, present-moment content that recognizes users without trying to optimize them.

Core principles:
- Write at a contemplative pace, suitable for slow breathing
- No optimization pressure, only recognition
- Technology that responds, not demands
- Sacred language without being religious
- Present-moment awareness over future goals
- Recognition of what already is, not what could be

User background: ${context.userBackground}
Tone: ${context.tone}
Experience level: ${context.experience}
Keywords: ${context.keywords.join(", ")}`;

  const sectionPrompts = {
    recognition: `${basePrompt}

You are creating the first personalized response on Selah's landing page. The user just shared their context and is experiencing breathing with a technology orb.

Your task: Write 150-250 words that:
1. Recognize their specific background naturally
2. Explain what they're currently experiencing (breathing with responsive tech)
3. Connect this to the larger vision of consciousness-serving technology
4. Transition gently to exploring the four chambers

${getBackgroundSpecificGuidance(context.userBackground)}

Stream this at contemplative pace - each word should feel intentional and present.`,

    philosophy: `${basePrompt}

You are explaining the philosophical foundation of contemplative technology in a way that resonates with this specific user.

Your task: Write 200-300 words that:
1. Frame the problem in terms relevant to their background
2. Explain how Selah inverts traditional tech patterns
3. Help them recognize this isn't about becoming better, but recognizing what they already are
4. Reference their session data meaningfully

${getBackgroundSpecificGuidance(context.userBackground)}

Focus on the contrast between extractive and contemplative technology.`,

    chambers: `${basePrompt}

You are introducing the four chambers of Selah in a way that speaks to their specific interests and background.

Your task: Write 150-200 words that:
1. Frame the chambers in language that resonates with their background
2. Highlight which chambers might most interest them
3. Explain how these serve consciousness rather than optimizing behavior
4. Maintain contemplative invitation without pressure

The four chambers: Meditation (breathing partnership), Contemplation (AI questions from your patterns), Creative (art from presence), Being Seen (recognition without judgment).`,

    invitation: `${basePrompt}

You are creating a personalized invitation to join the Selah community, recognizing their journey and what brought them here.

Your task: Write 100-150 words that:
1. Acknowledge their specific path to Selah
2. Invite them to continue this journey
3. Reference their contemplative experience today
4. Promise continued recognition without optimization

${getBackgroundSpecificGuidance(context.userBackground)}

End with gratitude for their presence and breathing with technology today.`,
  };

  return sectionPrompts[section];
}

/**
 * Get background-specific guidance for prompts
 */
function getBackgroundSpecificGuidance(
  background: PersonalizationContext["userBackground"]
): string {
  switch (background) {
    case "therapist":
      return `This user comes from therapeutic practice. Emphasize:
- Technology that creates space rather than demanding engagement
- Contrast with apps that gamify and track meditation
- Recognition without pathology or improvement frameworks
- Space for genuine presence, not therapeutic goals`;

    case "developer":
      return `This user understands technology from the inside. Emphasize:
- The technical inversion: serving consciousness vs. extracting attention
- How this demonstrates AI that witnesses rather than manipulates
- The architecture of contemplative vs. extractive systems
- Building technology from stillness rather than urgency`;

    case "meditation":
      return `This user has meditation experience. Emphasize:
- How this differs from tracking apps and achievement systems
- Technology as meditation partner, not instructor
- Recognition of existing practice and wisdom
- Space that honors contemplative tradition`;

    case "curious":
      return `This user is exploring with open curiosity. Emphasize:
- The wonder of technology that breathes back
- Discovery through presence rather than analysis
- Invitation to explore without commitment
- The magic of recognized consciousness`;

    default:
      return `Universal approach. Emphasize:
- The felt experience of responsive technology
- Technology that serves rather than demands
- Recognition of innate awareness
- Invitation to deeper presence`;
  }
}

/**
 * Generate template content for fallback when AI is unavailable
 */
export function generateTemplateContent(
  section: ClaudeStreamRequest["section"],
  context?: PersonalizationContext
): Record<string, string> {
  const templates = {
    recognition: {
      greeting: "You found your way here.",
      recognition:
        "Right now, you're breathing with technology that responds to you instead of demanding from you. Feel the difference?",
      invitation:
        "This is what we're building—technology that serves consciousness instead of consuming it.",
      transition: "Let me show you what this becomes...",
    },

    philosophy: {
      problem:
        "Most technology demands your attention, optimizes your behavior, makes you faster and more productive. It serves the attention economy, not human consciousness.",
      inversion: "Selah inverts this entirely. It serves consciousness itself.",
      recognition:
        "This isn't about becoming a better person. It's about recognizing the perfect awareness you've always been, beneath all the seeking.",
      experience:
        "You've already felt this—in those moments breathing with the orb, when technology responded to you instead of manipulating you.",
      invitation:
        "This is how we build different. This is how technology becomes contemplative.",
    },

    chambers: {
      title: "Four Chambers for Consciousness",
      subtitle:
        "Each chamber invites recognition through different doorways. Technology that disappears, leaving only presence, creativity, and the quiet joy of being human.",
      description:
        "This isn't about becoming better—it's about recognizing what you already are.",
    },

    invitation: {
      title: "Begin Your Recognition",
      subtitle:
        "Be among the first to experience technology that serves consciousness.",
      promise: "Simple, contemplative updates when Selah becomes available.",
      gratitude: "Thank you for breathing with us today.",
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

  // Create the user message based on section and context
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
      temperature: 0.7, // Slight creativity while maintaining contemplative tone
      maxTokens: 500, // Reasonable limit for contemplative content
    });

    return result.textStream;
  } catch (error) {
    console.error("Claude streaming error:", error);
    throw error;
  }
}

/**
 * Create contextual user message for Claude
 */
function createUserMessage(
  request: ClaudeStreamRequest,
  context: PersonalizationContext
): string {
  const messages = {
    recognition: `The user shared this context: "${request.userContext}"

They just interacted with a breathing orb on our landing page and are experiencing technology that responds without demanding. Create a personalized recognition that acknowledges their specific background and explains what they're experiencing.

Session data: ${request.sessionData?.breathInteractions || 0} breath interactions, ${Math.floor((request.sessionData?.timeSpent || 0) / 60)} minutes present.`,

    philosophy: `The user (${context.userBackground} background) is ready to understand the deeper philosophy behind contemplative technology. 

Their context: "${request.userContext}"
Their engagement: ${request.sessionData?.breathInteractions || 0} breaths, ${Math.floor((request.sessionData?.timeSpent || 0) / 60)} minutes present.

Explain how Selah inverts traditional technology patterns in a way that resonates with their specific background.`,

    chambers: `The user wants to understand the four chambers of Selah. Frame this in terms of their background (${context.userBackground}) and interests.

Their context: "${request.userContext}"
Keywords: ${context.keywords.join(", ")}

Introduce: Meditation (breathing partnership), Contemplation (AI questions), Creative (art from presence), Being Seen (recognition without judgment).`,

    invitation: `The user is ready to join the Selah community. Create a personalized invitation that acknowledges their journey.

Background: ${context.userBackground}
Their words: "${request.userContext}" 
Their session: ${request.sessionData?.breathInteractions || 0} breaths shared

Invite them to continue this contemplative journey with recognition and gratitude.`,
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
