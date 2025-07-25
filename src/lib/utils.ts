// src/lib/utils.ts - SELAH Utility Functions
// Technology that breathes with you
// Helper functions for contemplative experience

import { type ClassValue, clsx } from "clsx";
import type {
  EmailValidationResult,
  SelahError,
  EngagementData,
  EmailSubmission,
  OrbEngagement,
  BreathingState,
} from "./types";

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Merge CSS class names with proper handling of conditional classes
 * Used throughout components for dynamic styling
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate breathing animation classes based on state
 */
export function getBreathingClasses(
  state: BreathingState,
  variant: "orb" | "text" | "container" = "orb"
): string {
  const baseClasses = "transition-all duration-500 ease-in-out";

  switch (variant) {
    case "orb":
      return cn(baseClasses, {
        "scale-125 shadow-breathing-blue": state === "inhale",
        "scale-75 shadow-breathing-pink": state === "exhale",
        "scale-100 shadow-breathing-green": state === "still",
      });

    case "text":
      return cn(baseClasses, {
        "text-breathing-blue animate-breathe-fast": state === "inhale",
        "text-breathing-pink animate-breathe-fast": state === "exhale",
        "text-breathing-green animate-breathe": state === "still",
      });

    case "container":
      return cn(baseClasses, {
        "bg-blue-50/50": state === "inhale",
        "bg-pink-50/50": state === "exhale",
        "bg-green-50/50": state === "still",
      });

    default:
      return baseClasses;
  }
}

// ============================================================================
// EMAIL VALIDATION UTILITIES
// ============================================================================

/**
 * Comprehensive email validation with suggestions
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmedEmail = email.trim().toLowerCase();

  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  if (trimmedEmail.length > 320) {
    return {
      isValid: false,
      error: "Email is too long",
    };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
      suggestions: generateEmailSuggestions(trimmedEmail),
    };
  }

  // Check for common typos in domains
  const suggestions = checkCommonDomainTypos(trimmedEmail);
  if (suggestions.length > 0) {
    return {
      isValid: true,
      suggestions,
    };
  }

  return { isValid: true };
}

/**
 * Generate email suggestions for common typos
 */
function generateEmailSuggestions(email: string): string[] {
  const suggestions: string[] = [];
  const atIndex = email.indexOf("@");

  if (atIndex === -1) {
    return suggestions;
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  // Common domain corrections
  const domainCorrections: Record<string, string> = {
    "gmial.com": "gmail.com",
    "gmai.com": "gmail.com",
    "yahooo.com": "yahoo.com",
    "hotmial.com": "hotmail.com",
    "outlok.com": "outlook.com",
  };

  if (domainCorrections[domainPart]) {
    suggestions.push(`${localPart}@${domainCorrections[domainPart]}`);
  }

  return suggestions;
}

/**
 * Check for common domain typos
 */
function checkCommonDomainTypos(email: string): string[] {
  const suggestions: string[] = [];
  const domain = email.split("@")[1];

  if (!domain) return suggestions;

  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];

  // Simple Levenshtein distance check
  commonDomains.forEach((commonDomain) => {
    if (calculateLevenshteinDistance(domain, commonDomain) === 1) {
      suggestions.push(email.replace(domain, commonDomain));
    }
  });

  return suggestions;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// ============================================================================
// DATE AND TIME UTILITIES
// ============================================================================

/**
 * Format timestamp for display
 */
export function formatTimestamp(
  timestamp: string,
  format: "short" | "long" | "relative" = "short"
): string {
  const date = new Date(timestamp);
  const now = new Date();

  switch (format) {
    case "short":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });

    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

    case "relative":
      return formatRelativeTime(date, now);

    default:
      return date.toISOString();
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return formatTimestamp(date.toISOString(), "short");
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

// ============================================================================
// ID GENERATION UTILITIES
// ============================================================================

/**
 * Generate unique ID for sessions, submissions, etc.
 */
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Generate session ID for analytics
 */
export function generateSessionId(): string {
  return generateId("session");
}

/**
 * Generate submission ID for emails
 */
export function generateSubmissionId(): string {
  return generateId("email");
}

// ============================================================================
// NUMBER FORMATTING UTILITIES
// ============================================================================

/**
 * Format numbers for display (e.g., 1,234)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage change between two numbers
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

/**
 * Calculate breathing quality score based on consistency
 */
export function calculateBreathingQuality(engagement: OrbEngagement): number {
  if (engagement.actions.length < 4) return 0;

  const breathCycleDurations: number[] = [];
  let currentCycleStart = 0;

  engagement.actions.forEach((action, index) => {
    if (action.type === "inhale" && index > 0) {
      breathCycleDurations.push(action.timestamp - currentCycleStart);
      currentCycleStart = action.timestamp;
    }
  });

  if (breathCycleDurations.length < 2) return 0;

  // Calculate consistency (lower variance = higher quality)
  const average =
    breathCycleDurations.reduce((sum, duration) => sum + duration, 0) /
    breathCycleDurations.length;
  const variance =
    breathCycleDurations.reduce(
      (sum, duration) => sum + Math.pow(duration - average, 2),
      0
    ) / breathCycleDurations.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / average;

  // Convert to 0-100 score (lower CoV = higher score)
  return Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100));
}

/**
 * Calculate engagement score based on multiple factors
 */
export function calculateEngagementScore(data: EngagementData): number {
  const timeScore = Math.min(100, (data.timeSpent / 180) * 100); // 3 minutes = 100%
  const scrollScore = Math.min(100, data.maxScroll);
  const interactionScore = Math.min(100, (data.breathInteractions / 10) * 100); // 10 interactions = 100%

  return timeScore * 0.4 + scrollScore * 0.3 + interactionScore * 0.3;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Create a structured error
 */
export function createSelahError(
  message: string,
  code: string,
  type: SelahError["type"] = "unknown",
  context?: Record<string, any>
): SelahError {
  const error = new Error(message) as SelahError;
  error.code = code;
  error.type = type;
  error.context = context;
  error.timestamp = new Date().toISOString();
  error.userMessage = generateUserFriendlyMessage(type, message);

  return error;
}

/**
 * Generate user-friendly error messages
 */
function generateUserFriendlyMessage(
  type: SelahError["type"],
  originalMessage: string
): string {
  switch (type) {
    case "validation":
      return "Please check your input and try again";
    case "network":
      return "Connection issue - please check your internet and try again";
    case "storage":
      return "Unable to save your data - please try again";
    case "auth":
      return "Authentication required - please sign in";
    default:
      return "Something unexpected happened - please try again";
  }
}

// ============================================================================
// BROWSER UTILITIES
// ============================================================================

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions() {
  if (!isBrowser()) return { width: 0, height: 0 };

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;

  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Get user agent information
 */
export function getUserAgent(): string {
  if (!isBrowser()) return "server";

  return navigator.userAgent;
}

/**
 * Check for reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ============================================================================
// CONTEMPLATIVE UTILITIES
// ============================================================================

/**
 * Generate contemplative session metadata
 */
export function generateSessionMetadata() {
  return {
    sessionId: generateSessionId(),
    startTime: new Date().toISOString(),
    viewport: getViewportDimensions(),
    userAgent: getUserAgent(),
    touchDevice: isTouchDevice(),
    reducedMotion: prefersReducedMotion(),
  };
}

/**
 * Calculate optimal breathing pace based on user interaction
 */
export function calculateOptimalBreathingPace(
  engagements: OrbEngagement[]
): number {
  if (engagements.length === 0) return 6000; // Default 6 seconds

  const recentEngagements = engagements.slice(-5); // Last 5 sessions
  const averageCycleDurations = recentEngagements.map((engagement) => {
    if (engagement.breathCycles === 0) return 6000;
    return engagement.totalDuration / engagement.breathCycles;
  });

  const averagePace =
    averageCycleDurations.reduce((sum, duration) => sum + duration, 0) /
    averageCycleDurations.length;

  // Clamp between 3-12 seconds
  return Math.max(3000, Math.min(12000, averagePace));
}

/**
 * Generate breathing pattern recommendations
 */
export function generateBreathingRecommendations(score: number): string[] {
  const recommendations: string[] = [];

  if (score < 30) {
    recommendations.push("Try slowing down your breathing rhythm");
    recommendations.push("Focus on making each breath the same length");
    recommendations.push("Consider taking a moment to center yourself first");
  } else if (score < 60) {
    recommendations.push("Good rhythm - try maintaining this pace");
    recommendations.push("Notice the natural pause between breaths");
  } else {
    recommendations.push("Excellent breathing consistency");
    recommendations.push("You've found a natural rhythm");
    recommendations.push("Consider exploring longer breathing sessions");
  }

  return recommendations;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: EmailSubmission[]): string {
  if (data.length === 0) return "";

  const headers = ["Email", "Timestamp", "Source", "Validated"];
  const rows = data.map((submission) => [
    submission.email,
    formatTimestamp(submission.timestamp, "long"),
    submission.source,
    submission.validated ? "Yes" : "No",
  ]);

  return [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");
}

/**
 * Download data as file
 */
export function downloadFile(
  content: string,
  filename: string,
  type: string = "text/plain"
): void {
  if (!isBrowser()) return;

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ============================================================================
// DEBOUNCE AND THROTTLE UTILITIES
// ============================================================================

/**
 * Debounce function to limit rapid calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function to limit call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
