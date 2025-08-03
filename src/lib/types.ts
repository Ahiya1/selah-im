// src/lib/types.ts - SELAH TypeScript Definitions
// Technology that breathes with you
// Enhanced type-safe contemplative data structures with platform tracking

// ============================================================================
// EMAIL COLLECTION TYPES
// ============================================================================

export interface EmailSubmission {
  id: string;
  email: string;
  timestamp: string;
  source: EmailSource;
  validated: boolean;
  engagement?: EngagementData;
}

export type EmailSource =
  | "landing-page"
  | "hero-section"
  | "orb-interaction"
  | "contract-section"
  | "chambers-demo";

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

// ============================================================================
// PLATFORM PREFERENCE TYPES
// ============================================================================

export type PlatformPreference = "android" | "ios" | null;

export interface PlatformContext {
  platformPreference: PlatformPreference;
  location: "hero" | "bottom" | "unknown";
  sessionTime: number;
  breathInteractions: number;
  scrollDepth: number;
}

export interface PlatformStats {
  android: number;
  ios: number;
  unspecified: number;
}

// ============================================================================
// ENGAGEMENT ANALYTICS TYPES
// ============================================================================

export interface EngagementData {
  sessionId: string;
  timeSpent: number; // seconds
  maxScroll: number; // percentage
  breathInteractions: number;
  orbEngagements: OrbEngagement[];
  pageViews: PageView[];
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  timestamp: string;
  // Enhanced tracking properties
  platformPreference?: PlatformPreference;
  location?: string;
  sessionMetrics?: SessionMetrics;
  sourceContext?: SourceContext;
  updateHistory?: UpdateHistoryEntry[];
}

export interface SessionMetrics {
  timeSpent: number;
  breathInteractions: number;
  scrollDepth: number;
}

export interface SourceContext {
  fromHero?: boolean;
  fromOrb?: boolean;
  fromChambers?: boolean;
  fromContract?: boolean;
}

export interface UpdateHistoryEntry {
  timestamp: string;
  source: EmailSource;
  platformPreference?: PlatformPreference;
  location?: string;
  action: string;
}

export interface OrbEngagement {
  id: string;
  startTime: number;
  endTime: number;
  actions: OrbAction[];
  totalDuration: number;
  breathCycles: number;
}

export interface OrbAction {
  type: "inhale" | "exhale" | "still";
  timestamp: number;
  duration: number;
  touchCoordinates?: {
    x: number;
    y: number;
  };
}

export interface PageView {
  path: string;
  timestamp: string;
  timeSpent: number;
  scrollDepth: number;
  interactions: string[];
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface BreathingOrbProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "demo" | "meditation";
  onEngagement?: (engagement: OrbEngagement) => void;
  className?: string;
  disabled?: boolean;
}

export interface BreathingOrbState {
  currentState: "inhale" | "exhale" | "still";
  isActive: boolean;
  breathCycles: number;
  sessionStartTime: number | null;
  lastStateChange: number;
}

export interface EmailFormProps {
  onSubmit?: (submission: EmailSubmission) => void;
  onValidation?: (result: EmailValidationResult) => void;
  variant?: "default" | "inline" | "modal";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  platformPreference?: PlatformPreference;
  onPlatformChange?: (platform: PlatformPreference) => void;
}

export interface EmailFormState {
  email: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  validationResult: EmailValidationResult | null;
  platformPreference: PlatformPreference;
}

// ============================================================================
// NAVIGATION AND ROUTING TYPES
// ============================================================================

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface SectionRef {
  id: string;
  title: string;
  element: HTMLElement | null;
  inView: boolean;
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface AdminDashboardData {
  emails: EmailSubmission[];
  analytics: AnalyticsSummary;
  exportData: ExportData;
  lastUpdated: string;
}

export interface AnalyticsSummary {
  totalEmails: number;
  totalSessions: number;
  averageTimeSpent: number;
  totalOrbInteractions: number;
  topSources: Array<{
    source: EmailSource;
    count: number;
    percentage: number;
  }>;
  dailyStats: DailyStats[];
  engagementTrends: EngagementTrend[];
  // Enhanced analytics
  platformStats: PlatformStats;
  sourceStats: Record<string, number>;
  locationStats: Record<string, number>;
  conversionMetrics: ConversionMetrics;
}

export interface ConversionMetrics {
  totalInteractions: number;
  avgSessionTime: number;
  avgScrollDepth: number;
  platformConversionRates?: {
    android: number;
    ios: number;
  };
}

export interface DailyStats {
  date: string;
  emails: number;
  sessions: number;
  avgTimeSpent: number;
  orbInteractions: number;
  platformBreakdown: PlatformStats;
}

export interface EngagementTrend {
  date: string;
  metric: string;
  value: number;
  change: number; // percentage change from previous period
  platformData?: Record<string, number>;
}

export interface ExportData {
  format: "csv" | "json";
  data: EmailSubmission[] | AnalyticsSummary;
  filename: string;
  size: number;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AdminSession {
  isAuthenticated: boolean;
  timestamp: string;
  expiresAt: string;
  sessionId: string;
}

export interface LoginAttempt {
  timestamp: string;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

// ============================================================================
// CHAMBER TYPES (Future-proofing)
// ============================================================================

export interface ChamberInfo {
  id: "meditation" | "contemplation" | "creative" | "being-seen";
  title: string;
  description: string;
  icon: string;
  available: boolean;
  comingSoon?: boolean;
  features: string[];
  color: string;
  backgroundColor: string;
}

export interface MeditationSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // seconds
  breathCycles: number;
  quality?: "poor" | "fair" | "good" | "excellent";
  notes?: string;
  orbEngagements: OrbEngagement[];
}

export interface ContemplativeQuestion {
  id: string;
  content: string;
  source: "ai-generated" | "system" | "user-created";
  timestamp: string;
  reflections: Reflection[];
  tags?: string[];
}

export interface Reflection {
  id: string;
  content: string;
  timestamp: string;
  wordCount: number;
  mood?: string;
  insights?: string[];
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface LocalStorageData {
  emails: EmailSubmission[];
  analytics: EngagementData[];
  sessions: AdminSession[];
  preferences: UserPreferences;
  version: string;
  lastSync: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  emailNotifications: boolean;
  analytics: boolean;
  orbSensitivity: "low" | "medium" | "high";
  breathingSpeed: "slow" | "normal" | "fast";
  platformPreference: PlatformPreference;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface EmailSubmissionResponse extends ApiResponse<EmailSubmission> {
  duplicate?: boolean;
  suggestions?: string[];
}

export interface AnalyticsResponse extends ApiResponse<AnalyticsSummary> {
  cached?: boolean;
  cacheExpiry?: string;
}

export interface EnhancedEmailResponse extends ApiResponse {
  data?: {
    emails: EmailSubmission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    analytics: {
      platformStats: PlatformStats;
      sourceStats: Record<string, number>;
      locationStats: Record<string, number>;
      conversionMetrics: ConversionMetrics;
    };
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface SelahError extends Error {
  code: string;
  type: "validation" | "network" | "storage" | "auth" | "unknown";
  context?: Record<string, any>;
  userMessage?: string;
  timestamp: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: SelahError | null;
  errorInfo: any;
  eventId?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField<T = string> {
  value: T;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

export interface PlatformFormState
  extends FormState<{
    email: string;
    platformPreference: PlatformPreference;
  }> {
  showPlatformSelection: boolean;
  platformMessage: string | null;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate";
}

export interface BreathingAnimationConfig extends AnimationConfig {
  inhaleScale: number;
  exhaleScale: number;
  stillScale: number;
  colorTransitions: {
    inhale: string;
    exhale: string;
    still: string;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type Timestamp = string; // ISO 8601 format
export type UUID = string; // UUID v4 format
export type EmailAddress = string; // Valid email format
export type Percentage = number; // 0-100
export type Milliseconds = number;
export type Seconds = number;

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
  children?: React.ReactNode;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface ContainerComponentProps extends BaseComponentProps {
  as?: React.ElementType;
  variant?: string;
  size?: "small" | "medium" | "large";
}

export interface PlatformAwareComponentProps extends BaseComponentProps {
  platformPreference?: PlatformPreference;
  onPlatformChange?: (platform: PlatformPreference) => void;
  showPlatformBadges?: boolean;
}

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

export const BREATHING_STATES = ["inhale", "exhale", "still"] as const;
export type BreathingState = (typeof BREATHING_STATES)[number];

export const EMAIL_SOURCES = [
  "landing-page",
  "hero-section",
  "orb-interaction",
  "contract-section",
  "chambers-demo",
] as const;

export const PLATFORM_PREFERENCES = ["android", "ios"] as const;

export const CHAMBER_IDS = [
  "meditation",
  "contemplation",
  "creative",
  "being-seen",
] as const;

export const ADMIN_ROLES = ["admin", "viewer"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// ============================================================================
// BETA TESTING TYPES
// ============================================================================

export interface BetaTester {
  id: string;
  email: string;
  platform: "android" | "ios";
  inviteStatus: "pending" | "sent" | "accepted" | "declined";
  invitedAt: string;
  acceptedAt?: string;
  testingNotes?: string;
  deviceInfo?: {
    model: string;
    osVersion: string;
    appVersion: string;
  };
}

export interface BetaTestingMetrics {
  totalTesters: number;
  androidTesters: number;
  iosWaitlist: number;
  activeTesters: number;
  feedbackReceived: number;
  averageRating?: number;
}

// ============================================================================
// FEATURE FLAGS TYPES
// ============================================================================

export interface FeatureFlags {
  androidBetaEnabled: boolean;
  iosBetaEnabled: boolean;
  platformSelectionEnabled: boolean;
  enhancedAnalytics: boolean;
  feedbackCollection: boolean;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface NotificationPreferences {
  betaUpdates: boolean;
  featureAnnouncements: boolean;
  communityHighlights: boolean;
  platformSpecific: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  platform?: PlatformPreference;
  variables: string[];
}
