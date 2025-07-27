// src/lib/types.ts - SELAH Enhanced TypeScript Definitions - FIXED
// Technology that breathes with you
// Type-safe contemplative data structures with Claude AI integration

// ============================================================================
// CLAUDE AI INTEGRATION TYPES
// ============================================================================

export interface ClaudeStreamRequest {
  userContext: string;
  section: "recognition" | "chambers" | "philosophy" | "invitation";
  templateStructure?: any;
  sessionData?: EngagementData;
}

export interface ClaudeStreamResponse {
  success: boolean;
  data?: string;
  error?: string;
  rateLimited?: boolean;
  fallbackUsed?: boolean;
  timestamp: string;
}

export interface RateLimitState {
  userId: string;
  requestCount: number;
  lastRequest: string;
  isBlocked: boolean;
  resetTime: string;
}

export interface PersonalizationContext {
  userBackground:
    | "therapist"
    | "developer"
    | "curious"
    | "meditation"
    | "unknown";
  keywords: string[];
  tone: "therapeutic" | "technical" | "exploratory" | "general";
  experience: "beginner" | "intermediate" | "advanced";
}

// ============================================================================
// BUBBLE NAVIGATION TYPES
// ============================================================================

export interface BubbleConfig {
  id: string;
  title: string;
  color: "green" | "orange" | "purple" | "blue";
  component: React.ComponentType<BubbleProps>;
  order: number;
  requiresContext?: boolean;
}

export interface BubbleProps {
  userContext: string;
  useAI: boolean;
  sessionData: EngagementData | null;
  onBreathingInteraction: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onComplete?: () => void;
  // Fixed: Made these optional to match component usage
  bubbleIndex?: number;
  isActive?: boolean;
  isComplete?: boolean;
}

export interface BubbleContainerState {
  currentBubble: number;
  totalBubbles: number;
  isTransitioning: boolean;
  transitionDirection: "forward" | "backward" | null;
  completedBubbles: number[];
}

export interface BubbleTransition {
  from: number;
  to: number;
  direction: "forward" | "backward";
  duration: number;
  easing: string;
}

// ============================================================================
// ORIGINAL EMAIL COLLECTION TYPES (Enhanced)
// ============================================================================

export interface EmailSubmission {
  id: string;
  email: string;
  timestamp: string;
  source: EmailSource;
  validated: boolean;
  engagement?: EngagementData;
  aiPersonalized?: boolean;
  contextProvided?: boolean;
}

export type EmailSource =
  | "landing-page"
  | "bubble-journey"
  | "orb-interaction"
  | "chambers-demo"
  | "ai-personalized";

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

// ============================================================================
// ENGAGEMENT ANALYTICS TYPES (Enhanced)
// ============================================================================

export interface EngagementData {
  sessionId: string;
  timeSpent: number; // seconds
  maxScroll: number; // percentage (deprecated for bubbles)
  breathInteractions: number;
  orbEngagements: OrbEngagement[];
  pageViews: PageView[];
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  timestamp: string;
  bubbleJourney?: BubbleJourneyData;
}

export interface BubbleJourneyData {
  bubblesVisited: number[];
  timeInEachBubble: Record<number, number>;
  aiInteractions: number;
  contextProvided: boolean;
  completedJourney: boolean;
  exitPoint?: number;
}

export interface OrbEngagement {
  id: string;
  startTime: number;
  endTime: number;
  actions: OrbAction[];
  totalDuration: number;
  breathCycles: number;
  bubbleContext?: number; // Which bubble the orb was in
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
  scrollDepth: number; // deprecated for bubbles
  interactions: string[];
  bubbleId?: string;
}

// ============================================================================
// UI COMPONENT TYPES (Enhanced)
// ============================================================================

export interface BreathingOrbProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "demo" | "meditation" | "bubble";
  onEngagement?: (engagement: OrbEngagement) => void;
  className?: string;
  disabled?: boolean;
  bubbleContext?: number;
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
  variant?: "default" | "inline" | "modal" | "bubble";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAIAttribution?: boolean;
}

export interface EmailFormState {
  email: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  validationResult: EmailValidationResult | null;
}

export interface StreamingTextProps {
  content?: any;
  userContext?: string;
  useAI?: boolean;
  className?: string;
  section?: "recognition" | "chambers" | "philosophy" | "invitation";
  onStreamComplete?: () => void;
  bubbleId?: string;
  // Fixed: Changed to accept both string and object
  fallbackContent?: string | any;
}

export interface StreamingTextState {
  displayedWords: string[];
  isStreaming: boolean;
  streamingComplete: boolean;
  contentToStream: string;
  isAIGenerated: boolean;
  rateLimited: boolean;
}

// ============================================================================
// NAVIGATION AND ROUTING TYPES (Enhanced for Bubbles)
// ============================================================================

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  bubbleId?: string;
}

export interface BubbleRef {
  id: string;
  title: string;
  element: HTMLElement | null;
  inView: boolean;
  completed: boolean;
  aiPersonalized: boolean;
}

// ============================================================================
// ADMIN DASHBOARD TYPES (Enhanced)
// ============================================================================

export interface AdminDashboardData {
  emails: EmailSubmission[];
  analytics: AnalyticsSummary;
  aiUsage?: AIUsageSummary;
  rateLimiting?: RateLimitingSummary;
  exportData: ExportData;
  lastUpdated: string;
}

export interface AIUsageSummary {
  totalAIRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  fallbackUsed: number;
  averageResponseTime: number;
  costEstimate: number;
  topContextTypes: Array<{
    type: PersonalizationContext["userBackground"];
    count: number;
  }>;
}

export interface RateLimitingSummary {
  totalUniqueUsers: number;
  blockedRequests: number;
  allowedRequests: number;
  topBlockedIPs: Array<{
    ip: string;
    attempts: number;
  }>;
}

export interface AnalyticsSummary {
  totalEmails: number;
  totalSessions: number;
  averageTimeSpent: number;
  totalOrbInteractions: number;
  bubbleCompletionRates?: Record<number, number>;
  aiPersonalizationRate?: number;
  topSources: Array<{
    source: EmailSource;
    count: number;
    percentage: number;
  }>;
  dailyStats: DailyStats[];
  engagementTrends: EngagementTrend[];
}

export interface DailyStats {
  date: string;
  emails: number;
  sessions: number;
  avgTimeSpent: number;
  orbInteractions: number;
  aiRequests?: number;
  bubbleCompletions?: number;
}

export interface EngagementTrend {
  date: string;
  metric: string;
  value: number;
  change: number; // percentage change from previous period
}

export interface ExportData {
  format: "csv" | "json";
  data: EmailSubmission[] | AnalyticsSummary | AIUsageSummary;
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
// CHAMBER TYPES (Enhanced for Bubble Preview)
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
  bubblePreview?: React.ComponentType;
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
  bubbleContext?: number;
}

export interface ContemplativeQuestion {
  id: string;
  content: string;
  source: "ai-generated" | "system" | "user-created";
  timestamp: string;
  reflections: Reflection[];
  tags?: string[];
  personalizedContext?: PersonalizationContext;
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
// STORAGE TYPES (Enhanced)
// ============================================================================

export interface LocalStorageData {
  emails: EmailSubmission[];
  analytics: EngagementData[];
  sessions: AdminSession[];
  preferences: UserPreferences;
  rateLimitState: RateLimitState;
  bubbleProgress: BubbleJourneyData;
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
  aiPersonalization: boolean;
  bubbleTransitions: "smooth" | "instant";
}

// ============================================================================
// API RESPONSE TYPES (Enhanced)
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  rateLimited?: boolean;
  aiGenerated?: boolean;
}

export interface EmailSubmissionResponse extends ApiResponse<EmailSubmission> {
  duplicate?: boolean;
  suggestions?: string[];
  aiPersonalized?: boolean;
}

export interface AnalyticsResponse extends ApiResponse<AnalyticsSummary> {
  cached?: boolean;
  cacheExpiry?: string;
}

export interface ClaudeAPIResponse extends ApiResponse<string> {
  tokens?: {
    input: number;
    output: number;
  };
  model?: string;
  rateLimited?: boolean;
  fallbackUsed?: boolean;
}

// ============================================================================
// ERROR TYPES (Enhanced)
// ============================================================================

export interface SelahError extends Error {
  code: string;
  type:
    | "validation"
    | "network"
    | "storage"
    | "auth"
    | "rate-limit"
    | "ai"
    | "unknown";
  context?: Record<string, any>;
  userMessage?: string;
  timestamp: string;
  retryable?: boolean;
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

// ============================================================================
// ANIMATION TYPES (Enhanced for Bubbles)
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

export interface BubbleAnimationConfig extends AnimationConfig {
  entryAnimation: "fade" | "scale" | "slide";
  exitAnimation: "fade" | "scale" | "slide";
  transitionAnimation: "morph" | "fade" | "slide";
  breathingEffect: boolean;
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
// COMPONENT PROP TYPES (Enhanced)
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

export interface BubbleComponentProps extends BaseComponentProps {
  bubbleId: string;
  isActive: boolean;
  isComplete: boolean;
  color: "green" | "orange" | "purple" | "blue";
  onActivate?: () => void;
  onComplete?: () => void;
}

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

export const BREATHING_STATES = ["inhale", "exhale", "still"] as const;
export type BreathingState = (typeof BREATHING_STATES)[number];

export const EMAIL_SOURCES = [
  "landing-page",
  "bubble-journey",
  "orb-interaction",
  "chambers-demo",
  "ai-personalized",
] as const;

export const CHAMBER_IDS = [
  "meditation",
  "contemplation",
  "creative",
  "being-seen",
] as const;

export const BUBBLE_COLORS = ["green", "orange", "purple", "blue"] as const;
export type BubbleColor = (typeof BUBBLE_COLORS)[number];

export const ADMIN_ROLES = ["admin", "viewer"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const PERSONALIZATION_BACKGROUNDS = [
  "therapist",
  "developer",
  "curious",
  "meditation",
  "unknown",
] as const;

export const CLAUDE_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
] as const;
export type ClaudeModel = (typeof CLAUDE_MODELS)[number];
