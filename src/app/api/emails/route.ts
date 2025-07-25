// src/app/api/emails/route.ts - SELAH Email API
// Technology that breathes with you
// API endpoint for email collection

import { NextRequest, NextResponse } from "next/server";
import type { EmailSubmission, ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, source = "landing-page" } = body;

    // TODO: Implement email validation and database storage
    console.log("Email submission:", { email, source });

    // Placeholder response
    const response: ApiResponse<EmailSubmission> = {
      success: true,
      data: {
        id: Date.now().toString(),
        email,
        timestamp: new Date().toISOString(),
        source,
        validated: true,
      },
      message: "Email submitted successfully",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Email submission error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to submit email",
      message: "An error occurred while processing your request",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // TODO: Implement email retrieval with proper authentication
    const response: ApiResponse = {
      success: false,
      error: "Not implemented",
      message: "Email retrieval will be implemented in Phase 2",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 501 });
  } catch (error) {
    console.error("Email retrieval error:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: "Failed to retrieve emails",
      message: "An error occurred while processing your request",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
