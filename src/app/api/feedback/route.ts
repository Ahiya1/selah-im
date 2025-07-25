// src/app/api/feedback/route.ts - SELAH Feedback Collection API
// Technology that breathes with you
// Real feedback and inquiries from visitors

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import type { ApiResponse } from "@/lib/types";

interface FeedbackSubmission {
  id: string;
  type: "feedback" | "question" | "contact" | "bug-report" | "feature-request";
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  source: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
  status: "new" | "read" | "responded";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      type = "feedback",
      name,
      email,
      subject,
      message,
      source = "unknown",
    } = body;

    // Validate required fields
    if (!message || message.trim().length < 5) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Message too short",
        message: "Please provide a message with at least 5 characters",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        const errorResponse: ApiResponse = {
          success: false,
          error: "Invalid email format",
          message: "Please enter a valid email address",
          timestamp: new Date().toISOString(),
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Get request context
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const ipAddress = (
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"
    ).split(",")[0];

    const metadata = {
      userAgent,
      referer,
      ipAddress,
      source,
      timestamp: new Date().toISOString(),
    };

    // Insert feedback into database
    const result = await sql`
      INSERT INTO feedback (
        type, name, email, subject, message, source, 
        metadata, status, created_at
      )
      VALUES (
        ${type}, ${name || null}, ${email || null}, 
        ${subject || null}, ${message.trim()}, ${source},
        ${JSON.stringify(metadata)}, 'new', NOW()
      )
      RETURNING id, created_at
    `;

    const newFeedback = result.rows[0];

    const response: ApiResponse<FeedbackSubmission> = {
      success: true,
      data: {
        id: newFeedback.id.toString(),
        type,
        name,
        email,
        subject,
        message: message.trim(),
        source,
        timestamp: newFeedback.created_at,
        userAgent,
        ipAddress,
        status: "new",
      },
      message: "Thank you for your feedback",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Feedback submission error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to submit feedback",
      message: "An error occurred. Please try again.",
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions: string[] = [];
    let queryParams: any[] = [limit, offset];
    let paramIndex = 3;

    if (type) {
      whereConditions.push(`type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get feedback with pagination
    const feedbackResult = await sql.query(
      `
      SELECT id, type, name, email, subject, message, source, 
             metadata, status, created_at
      FROM feedback 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    // Get total count
    const countParams = queryParams.slice(2); // Remove limit and offset
    const countResult = await sql.query(
      `
      SELECT COUNT(*) as total FROM feedback ${whereClause}
    `,
      countParams
    );

    const total = parseInt(countResult.rows[0].total);

    const feedback: FeedbackSubmission[] = feedbackResult.rows.map((row) => ({
      id: row.id.toString(),
      type: row.type,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      source: row.source,
      timestamp: row.created_at,
      userAgent: row.metadata?.userAgent || "",
      ipAddress: row.metadata?.ipAddress || "",
      status: row.status,
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        feedback,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        summary: {
          totalFeedback: total,
          byType: {}, // TODO: Add aggregation by type
          byStatus: {}, // TODO: Add aggregation by status
        },
      },
      message: "Feedback retrieved successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Feedback retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve feedback",
      message: "An error occurred while fetching feedback",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Mark feedback as read
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Check admin authentication
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "default-password";

    if (!authHeader || authHeader.substring(7) !== adminPassword) {
      const response: ApiResponse = {
        success: false,
        error: "Unauthorized",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Missing required fields",
        message: "ID and status are required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Update feedback status
    await sql`
      UPDATE feedback 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `;

    const response: ApiResponse = {
      success: true,
      message: "Feedback status updated",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Feedback update error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to update feedback",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
