// src/app/not-found.tsx - SELAH 404 Page
// Technology that breathes with you
// Page not found handler

import React from "react";
import Link from "next/link";

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto bg-stone/20 rounded-full flex items-center justify-center animate-breathe">
          <span className="text-stone text-3xl">🗿</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-stone">Path Not Found</h1>

          <p className="text-slate-600 leading-relaxed">
            This contemplative path doesn't exist. Like consciousness itself,
            some journeys lead us back to where we started.
          </p>

          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl p-4">
            <p className="text-stone text-sm italic">
              "Not all those who wander are lost, but this URL certainly is."
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="btn-breathing inline-flex items-center px-6 py-3"
          >
            Return Home
          </Link>

          <div className="text-sm text-slate-600">
            <p>Or explore these paths:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link
                href="/#vision"
                className="text-stone hover:text-stone-dark transition-colors"
              >
                Vision
              </Link>
              <Link
                href="/#experience"
                className="text-stone hover:text-stone-dark transition-colors"
              >
                Experience
              </Link>
              <Link
                href="/#contract"
                className="text-stone hover:text-stone-dark transition-colors"
              >
                Contract
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone/10">
          <p className="text-xs text-slate-500">
            SELAH • Technology that breathes with you
          </p>
        </div>
      </div>
    </div>
  );
}
