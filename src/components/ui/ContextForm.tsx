// src/components/ui/ContextForm.tsx - SELAH Simplified Context Form
// Technology that breathes with you - Single focused question

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ContextFormProps {
  onSubmit: (context: string) => void;
  className?: string;
  variant?: "default" | "bubble" | "minimal";
  placeholder?: string;
  showSkipOption?: boolean;
  autoFocus?: boolean;
}

const ContextForm: React.FC<ContextFormProps> = ({
  onSubmit,
  className = "",
  variant = "default",
  placeholder = "I heard about this from... I know that...",
  showSkipOption = true,
  autoFocus = false,
}) => {
  const [context, setContext] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmit(context);
  };

  const handleSkip = () => {
    setIsSubmitted(true);
    onSubmit(""); // Empty context = use default template
  };

  // Different styling for bubble vs regular context
  const variantClasses = {
    default: "max-w-xl mx-auto",
    bubble: "w-full max-w-lg",
    minimal: "max-w-md mx-auto",
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "text-center space-y-4",
          variantClasses[variant],
          className
        )}
      >
        <div className="w-12 h-12 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
          <span className="text-breathing-green text-xl">✓</span>
        </div>
        <div className="space-y-2">
          <p className="text-slate-600 font-medium">
            {context.trim()
              ? "Creating your personalized experience..."
              : "Continuing with the universal journey..."}
          </p>
          <p className="text-slate-500 text-sm animate-pulse">
            Breathing words into existence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sacred Question */}
        <div className="text-center space-y-4">
          <p className="text-slate-700 text-lg leading-relaxed font-light">
            How did you find us and what do you know about Selah and
            contemplative technology?
          </p>
          <p className="text-slate-500 text-sm italic">
            This helps create a more personal experience, or continue without
          </p>
        </div>

        {/* Sacred Input Field */}
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="input-contemplative resize-none w-full h-24"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Sacred Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {showSkipOption && (
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-6 py-3 text-slate-600 glass-light hover:glass-medium rounded-lg transition-all duration-300 text-sm font-medium hover:transform hover:scale-105"
            >
              Continue without context
            </button>
          )}

          <button
            type="submit"
            className={cn(
              "flex-1 px-6 py-3 bg-gradient-to-r from-breathing-green to-stone",
              "text-white rounded-lg transition-all duration-300 text-sm font-medium",
              "hover:from-breathing-blue hover:to-stone-dark hover:scale-105 hover:shadow-breathing-green",
              "animate-breathe-subtle",
              {
                "opacity-100": context.trim() || !context.trim(),
              }
            )}
          >
            {context.trim() ? "Create my experience" : "Continue"}
          </button>
        </div>
      </form>

      {/* Sacred Explanation */}
      <div className="mt-6 text-center">
        <div className="mx-auto space-y-2 max-w-sm">
          <p className="text-xs text-slate-500 leading-relaxed">
            This helps the experience recognize you. Or continue without—the
            universal journey is equally profound.
          </p>

          {/* Sacred breathing dots */}
          <div className="flex items-center justify-center space-x-1 mt-3">
            <div className="w-1 h-1 bg-breathing-green rounded-full animate-pulse" />
            <div
              className="w-1 h-1 bg-breathing-blue rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="w-1 h-1 bg-breathing-pink rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextForm;
