// src/app/api/emails/route.ts - SELAH Real Email Collection API
// Technology that breathes with you
// Actual email storage and validation

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import type { EmailSubmission, ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, source = "landing-page", context = null } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Invalid email format",
        message: "Please enter a valid email address",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingEmail = await sql`
      SELECT id, created_at FROM emails 
      WHERE email = ${cleanEmail}
    `;

    if (existingEmail.rows.length > 0) {
      const response: ApiResponse<EmailSubmission> = {
        success: true,
        data: {
          id: existingEmail.rows[0].id.toString(),
          email: cleanEmail,
          timestamp: existingEmail.rows[0].created_at,
          source,
          validated: true,
        },
        message: "You're already on our contemplative journey",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Get additional context data
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const engagementData = {
      userAgent,
      referer,
      ipAddress: ipAddress.split(",")[0], // Take first IP if multiple
      source,
      context,
      timestamp: new Date().toISOString(),
    };

    // Insert new email
    const result = await sql`
      INSERT INTO emails (email, source, engagement_data, created_at)
      VALUES (${cleanEmail}, ${source}, ${JSON.stringify(engagementData)}, NOW())
      RETURNING id, created_at
    `;

    const newEmail = result.rows[0];

    const response: ApiResponse<EmailSubmission> = {
      success: true,
      data: {
        id: newEmail.id.toString(),
        email: cleanEmail,
        timestamp: newEmail.created_at,
        source,
        validated: true,
      },
      message: "Welcome to the contemplative journey",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Email submission error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to submit email",
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

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const source = searchParams.get("source");
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereClause = "";
    let queryParams: any[] = [limit, offset];

    if (source) {
      whereClause = "WHERE source = $3";
      queryParams.push(source);
    }

    // Get emails with pagination
    const emailsResult = await sql.query(
      `
      SELECT id, email, source, engagement_data, created_at
      FROM emails 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    // Get total count
    const countResult = await sql.query(
      `
      SELECT COUNT(*) as total FROM emails ${whereClause}
    `,
      source ? [source] : []
    );

    const total = parseInt(countResult.rows[0].total);

    const emails: EmailSubmission[] = emailsResult.rows.map((row) => ({
      id: row.id.toString(),
      email: row.email,
      timestamp: row.created_at,
      source: row.source,
      validated: true,
      engagement: row.engagement_data,
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        emails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      message: "Emails retrieved successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Email retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve emails",
      message: "An error occurred while fetching emails",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
