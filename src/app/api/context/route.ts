// src/app/api/context/route.ts - SELAH Context Storage API
// Technology that breathes with you
// Store user context answers for personalization

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supbase";
import type { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { context, sessionId, timestamp } = body;

    // Validate required fields
    if (!context || typeof context !== "string") {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Invalid context",
        message: "Context is required and must be a string",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!sessionId) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Invalid session",
        message: "Session ID is required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get additional metadata
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const contextData = {
      context: context.trim(),
      sessionId,
      userAgent,
      referer,
      ipAddress: ipAddress.split(",")[0],
      timestamp: timestamp || new Date().toISOString(),
    };

    // Store context in analytics table with special marker
    const { data: newContext, error: insertError } = await supabase
      .from("analytics")
      .insert({
        session_id: sessionId,
        engagement_data: {
          type: "context_submission",
          ...contextData,
        },
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Context storage error:", insertError);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Failed to store context",
        message: "An error occurred while storing your context",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log(`📝 SELAH: Context stored for session ${sessionId}:`, {
      length: context.length,
      preview: context.substring(0, 50) + (context.length > 50 ? "..." : ""),
    });

    const response: ApiResponse = {
      success: true,
      data: {
        id: newContext.id.toString(),
        sessionId,
        stored: true,
      },
      message: "Context stored successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Context storage error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to store context",
      message: "An error occurred while storing your context",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check admin authentication
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "default-password";

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse = {
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== adminPassword) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid token",
        message: "Access denied",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Query contexts from analytics table
    const {
      data: contexts,
      error,
      count,
    } = await supabase
      .from("analytics")
      .select("id, session_id, engagement_data, created_at", { count: "exact" })
      .eq("engagement_data->>type", "context_submission")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Context retrieval error:", error);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Failed to retrieve contexts",
        message: "An error occurred while fetching contexts",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const total = count || 0;

    const formattedContexts = contexts.map((row) => ({
      id: row.id.toString(),
      sessionId: row.session_id,
      context: row.engagement_data.context,
      timestamp: row.created_at,
      userAgent: row.engagement_data.userAgent,
      ipAddress: row.engagement_data.ipAddress,
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        contexts: formattedContexts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      message: "Contexts retrieved successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Context retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve contexts",
      message: "An error occurred while fetching contexts",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
