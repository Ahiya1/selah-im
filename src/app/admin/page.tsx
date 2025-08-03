// src/app/admin/page.tsx - SELAH Enhanced Admin Dashboard
// Technology that breathes with you
// Real data insights with platform preference analytics

"use client";

import React, { useState, useEffect } from "react";
import type { EmailSubmission } from "@/lib/types";

interface FeedbackItem {
  id: string;
  type: "feedback" | "question" | "contact" | "bug-report" | "feature-request";
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  source: string;
  timestamp: string;
  status: "new" | "read" | "responded";
}

interface PlatformStats {
  android: number;
  ios: number;
  unspecified: number;
}

interface ConversionMetrics {
  totalInteractions: number;
  avgSessionTime: number;
  avgScrollDepth: number;
}

interface DashboardData {
  emails: EmailSubmission[];
  feedback: FeedbackItem[];
  stats: {
    totalEmails: number;
    totalFeedback: number;
    newFeedback: number;
    emailsToday: number;
    feedbackToday: number;
    topSources: Array<{ source: string; count: number }>;
    platformStats: PlatformStats;
    sourceStats: Record<string, number>;
    locationStats: Record<string, number>;
    conversionMetrics: ConversionMetrics;
  };
}

export default function AdminDashboard(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "emails" | "feedback" | "analytics"
  >("overview");

  // Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem("selah-admin-token", password);
        await loadDashboardData();
      } else {
        setAuthError("Invalid password");
      }
    } catch (error) {
      setAuthError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("selah-admin-token");
      if (!token) return;

      // Load emails with enhanced analytics
      const emailsResponse = await fetch("/api/emails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const emailsResult = await emailsResponse.json();

      // Load feedback
      const feedbackResponse = await fetch("/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const feedbackResult = await feedbackResponse.json();

      if (emailsResult.success && feedbackResult.success) {
        const emails = emailsResult.data.emails || [];
        const feedback = feedbackResult.data.feedback || [];
        const analytics = emailsResult.data.analytics || {};

        // Calculate stats
        const today = new Date().toISOString().split("T")[0];
        const emailsToday = emails.filter((e: EmailSubmission) =>
          e.timestamp.startsWith(today)
        ).length;
        const feedbackToday = feedback.filter((f: FeedbackItem) =>
          f.timestamp.startsWith(today)
        ).length;
        const newFeedback = feedback.filter(
          (f: FeedbackItem) => f.status === "new"
        ).length;

        // Top sources (fallback if analytics not available)
        const sourceCount: Record<string, number> = analytics.sourceStats || {};
        if (Object.keys(sourceCount).length === 0) {
          emails.forEach((e: EmailSubmission) => {
            sourceCount[e.source] = (sourceCount[e.source] || 0) + 1;
          });
        }

        const topSources = Object.entries(sourceCount)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setData({
          emails,
          feedback,
          stats: {
            totalEmails: emails.length,
            totalFeedback: feedback.length,
            newFeedback,
            emailsToday,
            feedbackToday,
            topSources,
            platformStats: analytics.platformStats || {
              android: 0,
              ios: 0,
              unspecified: emails.length,
            },
            sourceStats: analytics.sourceStats || sourceCount,
            locationStats: analytics.locationStats || {},
            conversionMetrics: analytics.conversionMetrics || {
              totalInteractions: 0,
              avgSessionTime: 0,
              avgScrollDepth: 0,
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  // Mark feedback as read
  const markFeedbackAsRead = async (feedbackId: string) => {
    try {
      const token = localStorage.getItem("selah-admin-token");
      await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: feedbackId, status: "read" }),
      });

      await loadDashboardData(); // Reload data
    } catch (error) {
      console.error("Failed to mark feedback as read:", error);
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("selah-admin-token");
    if (token) {
      setPassword(token);
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="card-stone p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-stone rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                S
              </div>
              <h1 className="text-2xl font-semibold text-stone">SELAH Admin</h1>
              <p className="text-slate-600 mt-2">
                Access your contemplative data
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-contemplative w-full"
                required
                disabled={loading}
              />

              {authError && <p className="text-red-600 text-sm">{authError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-stone w-full py-3"
              >
                {loading ? "Authenticating..." : "Access Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <h1 className="text-xl font-semibold text-stone">SELAH Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                {data && `${data.stats.newFeedback} new messages`}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("selah-admin-token");
                  setIsAuthenticated(false);
                }}
                className="text-slate-600 hover:text-stone transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-lg p-1 mb-8 inline-flex">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "emails", label: "Email Signups", icon: "📧" },
            { id: "feedback", label: "Feedback", icon: "💬" },
            { id: "analytics", label: "Platform Analytics", icon: "📱" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2
                ${
                  activeTab === tab.id
                    ? "bg-stone text-white"
                    : "text-slate-600 hover:text-stone hover:bg-white/50"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "feedback" && data && data.stats.newFeedback > 0 && (
                <span className="bg-breathing-green text-white text-xs rounded-full px-2 py-0.5">
                  {data.stats.newFeedback}
                </span>
              )}
            </button>
          ))}
        </div>

        {!data ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 mx-auto bg-stone/20 rounded-full animate-breathe"></div>
              <p className="text-slate-600">Loading contemplative data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card-stone p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-breathing-green/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📧</span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-stone">
                          {data.stats.totalEmails}
                        </p>
                        <p className="text-slate-600 text-sm">Total Emails</p>
                        <p className="text-breathing-green text-xs">
                          +{data.stats.emailsToday} today
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-stone p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-breathing-blue/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-stone">
                          {data.stats.totalFeedback}
                        </p>
                        <p className="text-slate-600 text-sm">Total Feedback</p>
                        <p className="text-breathing-blue text-xs">
                          +{data.stats.feedbackToday} today
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-stone p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-breathing-gold/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-stone">
                          {data.stats.platformStats.android}
                        </p>
                        <p className="text-slate-600 text-sm">Android Users</p>
                        <p className="text-breathing-gold text-xs">
                          Beta Ready
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-stone p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-breathing-pink/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-stone">
                          {data.stats.platformStats.ios}
                        </p>
                        <p className="text-slate-600 text-sm">iPhone Users</p>
                        <p className="text-breathing-pink text-xs">
                          Waiting List
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-stone p-6">
                    <h3 className="text-lg font-semibold text-stone mb-4">
                      Platform Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🤖</span>
                          <span className="text-slate-700">Android</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-stone font-medium">
                            {data.stats.platformStats.android}
                          </span>
                          <span className="text-xs bg-breathing-green text-white px-2 py-1 rounded">
                            {Math.round(
                              (data.stats.platformStats.android /
                                data.stats.totalEmails) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📱</span>
                          <span className="text-slate-700">iPhone</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-stone font-medium">
                            {data.stats.platformStats.ios}
                          </span>
                          <span className="text-xs bg-breathing-blue text-white px-2 py-1 rounded">
                            {Math.round(
                              (data.stats.platformStats.ios /
                                data.stats.totalEmails) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">❓</span>
                          <span className="text-slate-700">Unspecified</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-stone font-medium">
                            {data.stats.platformStats.unspecified}
                          </span>
                          <span className="text-xs bg-slate-400 text-white px-2 py-1 rounded">
                            {Math.round(
                              (data.stats.platformStats.unspecified /
                                data.stats.totalEmails) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-stone p-6">
                    <h3 className="text-lg font-semibold text-stone mb-4">
                      Engagement Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Avg Session Time</span>
                        <span className="text-stone font-medium">
                          {Math.round(
                            data.stats.conversionMetrics.avgSessionTime
                          )}
                          s
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Avg Scroll Depth</span>
                        <span className="text-stone font-medium">
                          {Math.round(
                            data.stats.conversionMetrics.avgScrollDepth
                          )}
                          %
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">
                          Total Interactions
                        </span>
                        <span className="text-stone font-medium">
                          {data.stats.conversionMetrics.totalInteractions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Sources */}
                <div className="card-stone p-6">
                  <h3 className="text-lg font-semibold text-stone mb-4">
                    Top Email Sources
                  </h3>
                  <div className="space-y-3">
                    {data.stats.topSources.map((source, index) => (
                      <div
                        key={source.source}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-stone/10 rounded flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-slate-700 capitalize">
                            {source.source.replace("-", " ")}
                          </span>
                        </div>
                        <span className="text-stone font-medium">
                          {source.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="card-stone p-8">
                  <h2 className="text-xl font-semibold text-stone mb-6">
                    Platform Analytics Deep Dive
                  </h2>

                  {/* Platform Distribution Visual */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-stone mb-4">
                      Platform Distribution
                    </h3>
                    <div className="space-y-4">
                      {/* Android */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🤖</span>
                            <span className="font-medium text-slate-700">
                              Android Beta Users
                            </span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {data.stats.platformStats.android} users (
                            {Math.round(
                              (data.stats.platformStats.android /
                                data.stats.totalEmails) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-breathing-green h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(data.stats.platformStats.android / data.stats.totalEmails) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* iOS */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📱</span>
                            <span className="font-medium text-slate-700">
                              iPhone Waitlist
                            </span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {data.stats.platformStats.ios} users (
                            {Math.round(
                              (data.stats.platformStats.ios /
                                data.stats.totalEmails) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-breathing-blue h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(data.stats.platformStats.ios / data.stats.totalEmails) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Unspecified */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">❓</span>
                            <span className="font-medium text-slate-700">
                              Platform Not Selected
                            </span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {data.stats.platformStats.unspecified} users (
                            {Math.round(
                              (data.stats.platformStats.unspecified /
                                data.stats.totalEmails) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-slate-400 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(data.stats.platformStats.unspecified / data.stats.totalEmails) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-breathing-green/10 border-l-4 border-breathing-green p-4 rounded-r-lg">
                      <h4 className="font-semibold text-breathing-green mb-2">
                        Android Beta Ready
                      </h4>
                      <p className="text-sm text-slate-700">
                        {data.stats.platformStats.android} users are ready for
                        immediate beta access. This represents{" "}
                        {Math.round(
                          (data.stats.platformStats.android /
                            data.stats.totalEmails) *
                            100
                        )}
                        % of your total signups.
                      </p>
                    </div>

                    <div className="bg-breathing-blue/10 border-l-4 border-breathing-blue p-4 rounded-r-lg">
                      <h4 className="font-semibold text-breathing-blue mb-2">
                        iPhone Demand
                      </h4>
                      <p className="text-sm text-slate-700">
                        {data.stats.platformStats.ios} users are waiting for the
                        iPhone version. Strong demand indicator for iOS
                        development priority.
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {data.stats.platformStats.android > 0 && (
                    <div className="mt-6 bg-stone/5 border border-stone/20 rounded-lg p-6">
                      <h4 className="font-semibold text-stone mb-3">
                        📋 Action Items
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-breathing-green">•</span>
                          <span>
                            Send beta access instructions to{" "}
                            {data.stats.platformStats.android} Android users
                          </span>
                        </li>
                        {data.stats.platformStats.ios > 0 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-breathing-blue">•</span>
                            <span>
                              Keep {data.stats.platformStats.ios} iPhone users
                              engaged with development updates
                            </span>
                          </li>
                        )}
                        {data.stats.platformStats.unspecified > 0 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-slate-400">•</span>
                            <span>
                              Follow up with{" "}
                              {data.stats.platformStats.unspecified} users to
                              collect platform preference
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emails Tab */}
            {activeTab === "emails" && (
              <div className="card-stone p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-stone">
                    Email Signups
                  </h2>
                  <span className="text-slate-600">
                    {data.emails.length} total
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">
                          Platform
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">
                          Source
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.emails.map((email) => {
                        const platform = email.engagement?.platformPreference;
                        return (
                          <tr
                            key={email.id}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="py-3 px-4 text-slate-700">
                              {email.email}
                            </td>
                            <td className="py-3 px-4">
                              {platform === "android" && (
                                <span className="bg-breathing-green/20 text-breathing-green px-2 py-1 rounded text-xs flex items-center space-x-1">
                                  <span>🤖</span>
                                  <span>Android</span>
                                </span>
                              )}
                              {platform === "ios" && (
                                <span className="bg-breathing-blue/20 text-breathing-blue px-2 py-1 rounded text-xs flex items-center space-x-1">
                                  <span>📱</span>
                                  <span>iPhone</span>
                                </span>
                              )}
                              {!platform && (
                                <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs">
                                  Not specified
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-stone/10 text-stone px-2 py-1 rounded text-xs capitalize">
                                {email.source.replace("-", " ")}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-sm">
                              {new Date(email.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                {data.feedback.map((feedback) => (
                  <div key={feedback.id} className="card-stone p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-stone">
                            {feedback.name || feedback.email || "Anonymous"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              feedback.status === "new"
                                ? "bg-breathing-green/20 text-breathing-green"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {feedback.status}
                          </span>
                          <span className="bg-breathing-blue/20 text-breathing-blue px-2 py-1 rounded text-xs capitalize">
                            {feedback.type}
                          </span>
                        </div>

                        {feedback.subject && (
                          <h4 className="text-slate-700 font-medium">
                            {feedback.subject}
                          </h4>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          {feedback.email && <span>{feedback.email}</span>}
                          <span>
                            {new Date(feedback.timestamp).toLocaleString()}
                          </span>
                          <span className="capitalize">
                            {feedback.source.replace("-", " ")}
                          </span>
                        </div>
                      </div>

                      {feedback.status === "new" && (
                        <button
                          onClick={() => markFeedbackAsRead(feedback.id)}
                          className="text-breathing-green hover:text-breathing-green/80 text-sm font-medium transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {feedback.message}
                      </p>
                    </div>
                  </div>
                ))}

                {data.feedback.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-stone mb-2">
                      No feedback yet
                    </h3>
                    <p className="text-slate-600">
                      Messages from visitors will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
