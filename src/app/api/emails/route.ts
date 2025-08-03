// src/app/api/emails/route.ts - SELAH Email Collection API with Platform Tracking
// Technology that breathes with you
// Enhanced email storage and validation with platform preferences

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supbase";
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

    // Check if email already exists - USE ADMIN CLIENT
    const { data: existingEmail, error: checkError } = await supabaseAdmin
      .from("emails")
      .select("id, created_at, engagement_data")
      .eq("email", cleanEmail)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Database check error:", checkError);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Database error",
        message: "An error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 500 });
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
      // Enhanced tracking for platform preferences
      platformPreference: context?.platformPreference || null,
      location: context?.location || "unknown",
      sessionMetrics: {
        timeSpent: context?.sessionTime || 0,
        breathInteractions: context?.breathInteractions || 0,
        scrollDepth: context?.scrollDepth || 0,
      },
      // Track source context for better analytics
      sourceContext: {
        fromHero: source === "hero-section",
        fromOrb: source === "orb-interaction",
        fromChambers: source === "chambers-demo",
        fromContract: source === "contract-section",
      },
    };

    if (existingEmail) {
      // Update existing email with new context if platform preference changed
      const existingContext = existingEmail.engagement_data || {};
      const shouldUpdate =
        context?.platformPreference &&
        existingContext.platformPreference !== context.platformPreference;

      if (shouldUpdate) {
        const { error: updateError } = await supabaseAdmin
          .from("emails")
          .update({
            engagement_data: {
              ...existingContext,
              ...engagementData,
              updateHistory: [
                ...(existingContext.updateHistory || []),
                {
                  timestamp: new Date().toISOString(),
                  source,
                  platformPreference: context.platformPreference,
                  location: context.location,
                  action: "platform_preference_updated",
                },
              ],
            },
            updated_at: new Date().toISOString(),
          })
          .eq("email", cleanEmail);

        if (updateError) {
          console.error("Database update error:", updateError);
        }
      }

      // Customize response based on platform preference and source
      let message = "You're already on our contemplative journey";

      if (context?.platformPreference === "android") {
        message =
          "🤖 You're set for Android beta access! Check your email soon.";
      } else if (context?.platformPreference === "ios") {
        message = "📱 You'll be notified when iPhone version is ready";
      } else if (source === "hero-section") {
        message = "Welcome back! You're already part of the journey.";
      }

      const response: ApiResponse<EmailSubmission> = {
        success: true,
        data: {
          id: existingEmail.id.toString(),
          email: cleanEmail,
          timestamp: existingEmail.created_at,
          source,
          validated: true,
        },
        message,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Insert new email - USE ADMIN CLIENT
    const { data: newEmail, error: insertError } = await supabaseAdmin
      .from("emails")
      .insert({
        email: cleanEmail,
        source,
        engagement_data: engagementData,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Failed to submit email",
        message: "An error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Customize success message based on platform preference and source
    let successMessage = "Welcome to the contemplative journey";

    if (context?.platformPreference === "android") {
      successMessage =
        "🤖 Welcome! Beta access details coming soon to your inbox";
    } else if (context?.platformPreference === "ios") {
      successMessage =
        "📱 Welcome! You'll be first to know when iPhone version launches";
    } else if (source === "hero-section") {
      successMessage = "🧘 Welcome to your contemplative technology journey";
    } else if (source === "orb-interaction") {
      successMessage =
        "✨ Thank you for breathing with us. Updates coming soon.";
    }

    const response: ApiResponse<EmailSubmission> = {
      success: true,
      data: {
        id: newEmail.id.toString(),
        email: cleanEmail,
        timestamp: newEmail.created_at,
        source,
        validated: true,
      },
      message: successMessage,
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
    const platform = searchParams.get("platform"); // New filter for platform preference
    const location = searchParams.get("location"); // New filter for location context
    const offset = (page - 1) * limit;

    // Build query with enhanced filtering
    let query = supabaseAdmin
      .from("emails")
      .select("id, email, source, engagement_data, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (source) {
      query = query.eq("source", source);
    }

    // Filter by platform preference if specified
    if (platform) {
      query = query.contains("engagement_data", {
        platformPreference: platform,
      });
    }

    // Filter by location context if specified
    if (location) {
      query = query.contains("engagement_data", { location: location });
    }

    const { data: emails, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Failed to retrieve emails",
        message: "An error occurred while fetching emails",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const total = count || 0;

    const formattedEmails: EmailSubmission[] = emails.map((row) => ({
      id: row.id.toString(),
      email: row.email,
      timestamp: row.created_at,
      source: row.source,
      validated: true,
      engagement: row.engagement_data,
    }));

    // Calculate enhanced statistics
    const platformStats = {
      android: emails.filter(
        (e) => e.engagement_data?.platformPreference === "android"
      ).length,
      ios: emails.filter((e) => e.engagement_data?.platformPreference === "ios")
        .length,
      unspecified: emails.filter((e) => !e.engagement_data?.platformPreference)
        .length,
    };

    const sourceStats = {
      "hero-section": emails.filter((e) => e.source === "hero-section").length,
      "landing-page": emails.filter((e) => e.source === "landing-page").length,
      "orb-interaction": emails.filter((e) => e.source === "orb-interaction")
        .length,
      "chambers-demo": emails.filter((e) => e.source === "chambers-demo")
        .length,
      "contract-section": emails.filter((e) => e.source === "contract-section")
        .length,
    };

    const locationStats = {
      hero: emails.filter((e) => e.engagement_data?.location === "hero").length,
      bottom: emails.filter((e) => e.engagement_data?.location === "bottom")
        .length,
      unknown: emails.filter(
        (e) =>
          !e.engagement_data?.location ||
          e.engagement_data?.location === "unknown"
      ).length,
    };

    // Calculate conversion metrics
    const totalInteractions = emails.reduce((sum, e) => {
      return sum + (e.engagement_data?.sessionMetrics?.breathInteractions || 0);
    }, 0);

    const avgSessionTime =
      emails.reduce((sum, e) => {
        return sum + (e.engagement_data?.sessionMetrics?.timeSpent || 0);
      }, 0) / Math.max(emails.length, 1);

    const response: ApiResponse = {
      success: true,
      data: {
        emails: formattedEmails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        analytics: {
          platformStats,
          sourceStats,
          locationStats,
          conversionMetrics: {
            totalInteractions,
            avgSessionTime: Math.round(avgSessionTime),
            avgScrollDepth:
              emails.reduce((sum, e) => {
                return (
                  sum + (e.engagement_data?.sessionMetrics?.scrollDepth || 0)
                );
              }, 0) / Math.max(emails.length, 1),
          },
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
