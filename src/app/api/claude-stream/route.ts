// src/app/api/claude-stream/route.ts - SELAH Claude Streaming API
// Technology that breathes with you
// Main AI streaming endpoint for personalized contemplative content

import { NextRequest, NextResponse } from "next/server";
import { generateUserFingerprint, withRateLimit } from "@/lib/rate-limiting";
import { personalizationEngine } from "@/lib/personalization-engine";
import { validateClaudeConfig } from "@/lib/claude-client";
import type { ClaudeStreamRequest, ApiResponse } from "@/lib/types";

export const runtime = "edge"; // Use Edge Runtime for better streaming performance
export const maxDuration = 30; // 30 seconds max for contemplative content

/**
 * Handle Claude AI streaming requests
 */
async function handleClaudeStream(request: NextRequest): Promise<Response> {
  try {
    // Validate Claude configuration
    const configValidation = validateClaudeConfig();
    if (!configValidation.valid) {
      console.error("Claude configuration invalid:", configValidation.error);
      return createErrorResponse(
        "AI service temporarily unavailable",
        500,
        "config-error"
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const streamRequest = validateStreamRequest(body);

    if (!streamRequest.valid) {
      return createErrorResponse(
        streamRequest.error || "Invalid request format",
        400,
        "validation-error"
      );
    }

    const claudeRequest: ClaudeStreamRequest = streamRequest.data!;

    // Generate user fingerprint for rate limiting
    const userFingerprint = generateUserFingerprint(request);

    // Get personalized content (handles rate limiting internally)
    const result = await personalizationEngine.generatePersonalizedContent(
      claudeRequest,
      userFingerprint
    );

    // Handle rate limited case
    if (result.rateLimited) {
      return createFallbackResponse(
        result.fallbackContent,
        result.message || "Rate limited",
        true
      );
    }

    // Handle AI-generated streaming content
    if (result.stream && result.aiGenerated) {
      return createStreamingResponse(result.stream, true);
    }

    // Handle fallback content
    return createFallbackResponse(
      result.fallbackContent,
      result.message || "Using template content",
      false
    );
  } catch (error) {
    console.error("Claude stream error:", error);

    return createErrorResponse(
      "An error occurred while generating content",
      500,
      "internal-error"
    );
  }
}

/**
 * Validate incoming stream request
 */
function validateStreamRequest(body: any): {
  valid: boolean;
  error?: string;
  data?: ClaudeStreamRequest;
} {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: "Request body must be a JSON object",
    };
  }

  const { userContext, section, templateStructure, sessionData } = body;

  // Validate required fields
  if (typeof userContext !== "string") {
    return {
      valid: false,
      error: "userContext must be a string",
    };
  }

  if (
    !["recognition", "chambers", "philosophy", "invitation"].includes(section)
  ) {
    return {
      valid: false,
      error:
        "section must be one of: recognition, chambers, philosophy, invitation",
    };
  }

  // Validate userContext length
  if (userContext.length > 1000) {
    return {
      valid: false,
      error: "userContext too long (max 1000 characters)",
    };
  }

  return {
    valid: true,
    data: {
      userContext,
      section,
      templateStructure,
      sessionData,
    },
  };
}

/**
 * Create streaming response for AI-generated content
 */
function createStreamingResponse(
  stream: ReadableStream,
  aiGenerated: boolean
): Response {
  // Transform the stream to add metadata
  const transformedStream = new ReadableStream({
    start(controller) {
      // Send initial metadata
      const metadata =
        JSON.stringify({
          type: "metadata",
          aiGenerated,
          timestamp: new Date().toISOString(),
        }) + "\n";

      controller.enqueue(new TextEncoder().encode(metadata));
    },

    async pull(controller) {
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Send completion metadata
            const completion =
              JSON.stringify({
                type: "complete",
                timestamp: new Date().toISOString(),
              }) + "\n";

            controller.enqueue(new TextEncoder().encode(completion));
            controller.close();
            break;
          }

          // Send content chunk
          const chunk =
            JSON.stringify({
              type: "content",
              text: value,
            }) + "\n";

          controller.enqueue(new TextEncoder().encode(chunk));
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(transformedStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-AI-Generated": aiGenerated.toString(),
      "X-Selah-Service": "claude-stream",
    },
  });
}

/**
 * Create fallback response for template content
 */
function createFallbackResponse(
  content: any,
  message: string,
  rateLimited: boolean
): Response {
  const response: ApiResponse = {
    success: true,
    data: {
      content,
      aiGenerated: false,
      fallbackUsed: true,
      rateLimited,
      message,
    },
    message,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: rateLimited ? 429 : 200,
    headers: {
      "Content-Type": "application/json",
      "X-AI-Generated": "false",
      "X-Fallback-Used": "true",
      "X-Rate-Limited": rateLimited.toString(),
      "X-Selah-Service": "claude-stream",
    },
  });
}

/**
 * Create error response
 */
function createErrorResponse(
  message: string,
  status: number,
  errorCode: string
): Response {
  const response: ApiResponse = {
    success: false,
    error: errorCode,
    message,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Error-Code": errorCode,
      "X-Selah-Service": "claude-stream",
    },
  });
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(request: NextRequest): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * POST endpoint with rate limiting middleware
 */
export const POST = withRateLimit(handleClaudeStream);

/**
 * Health check endpoint
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const configValidation = validateClaudeConfig();

    const health = {
      status: "healthy",
      service: "claude-stream",
      timestamp: new Date().toISOString(),
      config: configValidation.valid,
      version: "1.0.0",
    };

    return NextResponse.json(health, {
      headers: {
        "Cache-Control": "no-cache",
        "X-Selah-Service": "claude-stream",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        service: "claude-stream",
        error: "Service check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
