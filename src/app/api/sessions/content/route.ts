// src/app/api/sessions/content/route.ts - SELAH Bubble Content API
// Technology that breathes with you
// Get pre-generated content for bubbles

import { NextRequest, NextResponse } from "next/server";
import { sessionManager } from "@/lib/session-manager";
import type { ApiResponse, BubbleContent } from "@/lib/types";

/**
 * GET - Get content for a specific bubble
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const bubbleId = searchParams.get("bubbleId") as
      | "philosophy"
      | "experience"
      | "invitation";

    // Validate parameters
    if (!sessionId) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Missing session ID",
        message: "Session ID is required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (
      !bubbleId ||
      !["philosophy", "experience", "invitation"].includes(bubbleId)
    ) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Invalid bubble ID",
        message: "Bubble ID must be philosophy, experience, or invitation",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get content from session manager
    const content = await sessionManager.getBubbleContent(sessionId, bubbleId);

    if (!content) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Content not found",
        message: "The requested bubble content could not be found",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    console.log(
      `📖 Bubble Content API: Serving ${bubbleId} content for ${sessionId} (AI=${content.isAI})`
    );

    const response: ApiResponse<BubbleContent> = {
      success: true,
      data: content,
      message: "Content retrieved successfully",
      timestamp: new Date().toISOString(),
      aiGenerated: content.isAI,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "X-Content-Type": bubbleId,
        "X-AI-Generated": content.isAI.toString(),
        "X-Rate-Limited": (content.rateLimited || false).toString(),
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Bubble content retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve content",
      message: "An error occurred while retrieving bubble content",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
