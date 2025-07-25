// src/app/loading.tsx - SELAH Loading Page
// Technology that breathes with you
// Global loading state

import React from "react";

export default function LoadingPage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-stone/20 rounded-full animate-breathe flex items-center justify-center">
          <div className="w-8 h-8 bg-stone rounded-full animate-breathe-slow"></div>
        </div>

        <div className="space-y-2">
          <p className="text-stone-light animate-breathe-slow font-medium">
            Preparing your contemplative space...
          </p>

          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-breathing-green rounded-full animate-breathe"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-breathing-blue rounded-full animate-breathe"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-breathing-pink rounded-full animate-breathe"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Technology that breathes with you
        </p>
      </div>
    </div>
  );
}
