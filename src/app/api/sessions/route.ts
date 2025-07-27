// src/app/api/sessions/route.ts - SELAH Sessions API
// Technology that breathes with you
// Session-based contemplative journey management

import { NextRequest, NextResponse } from "next/server";
import { sessionManager } from "@/lib/session-manager";
import { generateUserFingerprint } from "@/lib/rate-limiting";
import { generateSessionMetadata } from "@/lib/utils";
import type {
  ApiResponse,
  PresentationSession,
  SessionCreationRequest,
  SessionUpdateRequest,
} from "@/lib/types";

/**
 * POST - Create a new presentation session
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userContext } = body;

    // Generate user fingerprint for rate limiting
    const userFingerprint = generateUserFingerprint(request);

    // Generate session metadata
    const sessionMetadata = {
      userAgent: request.headers.get("user-agent") || "",
      viewport: body.viewport || { width: 0, height: 0 },
      timestamp: new Date().toISOString(),
    };

    const sessionRequest: SessionCreationRequest = {
      userContext: userContext || null,
      userFingerprint,
      sessionMetadata,
    };

    console.log(
      `🎭 Sessions API: Creating session with context=${!!userContext}`
    );

    // Create session through manager
    const session = await sessionManager.createSession(sessionRequest);

    const response: ApiResponse<PresentationSession> = {
      success: true,
      data: session,
      message: "Session created successfully",
      timestamp: new Date().toISOString(),
      aiGenerated: session.useAI,
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        "X-Session-ID": session.id,
        "X-AI-Enabled": session.useAI.toString(),
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to create session",
      message: "An error occurred while creating your contemplative session",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET - Retrieve session by ID
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Missing session ID",
        message: "Session ID is required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const session = await sessionManager.getSession(sessionId);

    if (!session) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Session not found",
        message: "The requested session could not be found",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const response: ApiResponse<PresentationSession> = {
      success: true,
      data: session,
      message: "Session retrieved successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "X-Session-Status": session.status,
        "X-AI-Enabled": session.useAI.toString(),
      },
    });
  } catch (error) {
    console.error("Session retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve session",
      message: "An error occurred while retrieving your session",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PATCH - Update session data
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { sessionId, updates } = body;

    if (!sessionId) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Missing session ID",
        message: "Session ID is required for updates",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const updateRequest: SessionUpdateRequest = {
      sessionId,
      updates,
    };

    const updatedSession = await sessionManager.updateSession(updateRequest);

    if (!updatedSession) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Session not found",
        message: "The session to update could not be found",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const response: ApiResponse<PresentationSession> = {
      success: true,
      data: updatedSession,
      message: "Session updated successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "X-Session-Updated": new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Session update error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to update session",
      message: "An error occurred while updating your session",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
