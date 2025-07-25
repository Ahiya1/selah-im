// src/app/error.tsx - SELAH Error Page
// Technology that breathes with you
// Global error boundary

"use client";

import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): JSX.Element {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("SELAH Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto bg-stone/20 rounded-full flex items-center justify-center">
          <span className="text-stone text-2xl">🤲</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-stone">
            Something unexpected happened
          </h1>

          <p className="text-slate-600 leading-relaxed">
            The contemplative space encountered an error. Take a breath, and
            we'll try again.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-gray-100 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <button onClick={reset} className="btn-breathing px-6 py-3">
            Try Again
          </button>

          <div>
            <a
              href="/"
              className="text-stone hover:text-stone-dark transition-colors text-sm"
            >
              Return to Home
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          If this issue persists, please contact{" "}
          <a
            href="mailto:hello@selah.im"
            className="text-stone hover:underline"
          >
            hello@selah.im
          </a>
        </p>
      </div>
    </div>
  );
}
