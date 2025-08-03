// src/lib/analytics.ts - SELAH Analytics
// Technology that breathes with you
// Analytics and engagement tracking

import type { EngagementData, AnalyticsSummary, OrbEngagement } from "./types";

/**
 * Track user engagement with contemplative technology
 */
export function trackEngagement(data: Partial<EngagementData>): void {
  // TODO: Implement analytics tracking
  if (typeof window !== "undefined") {
    console.log("Engagement tracked:", data);

    // Store in sessionStorage for now (will be replaced with API calls)
    try {
      const existing = JSON.parse(
        sessionStorage.getItem("selah-analytics") || "[]"
      );
      existing.push({
        ...data,
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem("selah-analytics", JSON.stringify(existing));
    } catch (error) {
      console.warn("Failed to store analytics:", error);
    }
  }
}

/**
 * Calculate analytics summary from engagement data
 */
export function calculateAnalyticsSummary(
  engagements: EngagementData[]
): AnalyticsSummary {
  if (engagements.length === 0) {
    return {
      totalEmails: 0,
      totalSessions: 0,
      averageTimeSpent: 0,
      totalOrbInteractions: 0,
      topSources: [],
      dailyStats: [],
      engagementTrends: [],
      // Add the missing required properties
      platformStats: {
        android: 0,
        ios: 0,
        unspecified: 0,
      },
      sourceStats: {},
      locationStats: {},
      conversionMetrics: {
        totalInteractions: 0,
        avgSessionTime: 0,
        avgScrollDepth: 0,
      },
    };
  }

  const totalSessions = engagements.length;
  const totalTimeSpent = engagements.reduce((sum, e) => sum + e.timeSpent, 0);
  const averageTimeSpent = totalTimeSpent / totalSessions;
  const totalOrbInteractions = engagements.reduce(
    (sum, e) => sum + e.breathInteractions,
    0
  );

  // Calculate platform stats
  const platformStats = {
    android: engagements.filter((e) => e.platformPreference === "android")
      .length,
    ios: engagements.filter((e) => e.platformPreference === "ios").length,
    unspecified: engagements.filter((e) => !e.platformPreference).length,
  };

  // Calculate source stats
  const sourceMap = new Map<string, number>();
  engagements.forEach((e) => {
    // Extract source from pageViews if available
    const source = e.pageViews?.[0]?.path || "unknown";
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });

  const sourceStats: Record<string, number> = {};
  sourceMap.forEach((count, source) => {
    sourceStats[source] = count;
  });

  // Calculate location stats
  const locationStats = {
    hero: engagements.filter((e) => e.location === "hero").length,
    bottom: engagements.filter((e) => e.location === "bottom").length,
    unknown: engagements.filter((e) => !e.location || e.location === "unknown")
      .length,
  };

  // Calculate conversion metrics
  const totalInteractions = totalOrbInteractions;
  const avgSessionTime = averageTimeSpent;
  const avgScrollDepth =
    engagements.reduce((sum, e) => sum + e.maxScroll, 0) / totalSessions;

  const topSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
    source: source as any, // Will be properly typed when email data is available
    count,
    percentage: (count / totalSessions) * 100,
  }));

  return {
    totalEmails: 0, // TODO: Calculate from actual email data
    totalSessions,
    averageTimeSpent,
    totalOrbInteractions,
    topSources,
    dailyStats: [], // TODO: Group engagements by day
    engagementTrends: [], // TODO: Calculate trends over time
    platformStats,
    sourceStats,
    locationStats,
    conversionMetrics: {
      totalInteractions,
      avgSessionTime: Math.round(avgSessionTime),
      avgScrollDepth: Math.round(avgScrollDepth),
    },
  };
}

/**
 * Calculate engagement quality score based on multiple factors
 */
export function calculateEngagementQuality(data: EngagementData): number {
  let score = 0;
  let maxScore = 100;

  // Time spent factor (0-40 points)
  const timeScore = Math.min(40, (data.timeSpent / 300) * 40); // 5 minutes = full points
  score += timeScore;

  // Scroll depth factor (0-20 points)
  const scrollScore = (data.maxScroll / 100) * 20;
  score += scrollScore;

  // Breath interactions factor (0-40 points)
  const breathScore = Math.min(40, (data.breathInteractions / 10) * 40); // 10 interactions = full points
  score += breathScore;

  return Math.round(score);
}

/**
 * Calculate breathing consistency score from orb engagements
 */
export function calculateBreathingConsistency(
  engagements: OrbEngagement[]
): number {
  if (engagements.length === 0) return 0;

  const cycleDurations: number[] = [];

  engagements.forEach((engagement) => {
    if (engagement.breathCycles > 0) {
      const avgCycleDuration =
        engagement.totalDuration / engagement.breathCycles;
      cycleDurations.push(avgCycleDuration);
    }
  });

  if (cycleDurations.length < 2) return 0;

  // Calculate coefficient of variation (lower = more consistent)
  const mean =
    cycleDurations.reduce((sum, d) => sum + d, 0) / cycleDurations.length;
  const variance =
    cycleDurations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) /
    cycleDurations.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;

  // Convert to 0-100 score (lower CoV = higher score)
  return Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100));
}

/**
 * Get analytics data from storage
 */
export function getStoredAnalytics(): Partial<EngagementData>[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(sessionStorage.getItem("selah-analytics") || "[]");
  } catch (error) {
    console.warn("Failed to retrieve analytics:", error);
    return [];
  }
}

/**
 * Clear analytics data from storage
 */
export function clearStoredAnalytics(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("selah-analytics");
    } catch (error) {
      console.warn("Failed to clear analytics:", error);
    }
  }
}

/**
 * Export analytics data for admin dashboard
 */
export function exportAnalyticsData(format: "json" | "csv" = "json"): string {
  const data = getStoredAnalytics();

  if (format === "csv") {
    // Simple CSV export
    const headers = [
      "timestamp",
      "sessionId",
      "timeSpent",
      "maxScroll",
      "breathInteractions",
    ];
    const rows = data.map((item) => [
      item.timestamp || "",
      item.sessionId || "",
      item.timeSpent || 0,
      item.maxScroll || 0,
      item.breathInteractions || 0,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
  }

  return JSON.stringify(data, null, 2);
}
