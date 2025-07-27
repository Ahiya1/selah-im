// src/components/ui/ContextForm.tsx - SELAH Enhanced Sacred Context Form
// Technology that breathes with you - Sacred context gathering with bubble support

"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ContextFormProps {
  onSubmit: (context: string) => void;
  className?: string;
  variant?: "default" | "bubble" | "minimal";
  placeholder?: string;
  showSkipOption?: boolean;
  bubbleContext?: boolean;
  autoFocus?: boolean;
}

const ContextForm: React.FC<ContextFormProps> = ({
  onSubmit,
  className = "",
  variant = "default",
  placeholder = "I heard about this from... I know that...",
  showSkipOption = true,
  bubbleContext = false,
  autoFocus = false,
}) => {
  const [context, setContext] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [suggestedPrompts] = useState([
    "My therapist mentioned meditation apps...",
    "I'm building AI products and curious about...",
    "I've been exploring meditation but apps feel...",
    "A friend recommended this and I'm wondering...",
    "I'm curious about technology that doesn't...",
  ]);

  useEffect(() => {
    setCharCount(context.length);
  }, [context]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmit(context);

    // Sacred visual feedback
    setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  const handleSkip = () => {
    setIsSubmitted(true);
    onSubmit(""); // Empty context = use default template
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setContext(prompt);
    setIsExpanded(true);
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
            How did you hear about this space, and what do you already know?
          </p>
          <p className="text-slate-500 text-sm italic">
            (Optional - helps create a more personal experience)
          </p>
        </div>

        {/* Suggested Prompts - only show in bubble variant */}
        {variant === "bubble" && !isExpanded && context.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 text-center">
              Or choose a starting point:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-xs px-3 py-1 bg-white/50 hover:bg-white/70 border border-white/30 rounded-full text-slate-600 hover:text-stone transition-all duration-300 hover:scale-105"
                >
                  {prompt.length > 30
                    ? prompt.substring(0, 30) + "..."
                    : prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sacred Input Field */}
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "input-contemplative resize-none transition-all duration-500 ease-out w-full",
              {
                "h-32": isExpanded || bubbleContext,
                "h-14": !isExpanded && !bubbleContext,
              }
            )}
            rows={isExpanded || bubbleContext ? 5 : 2}
            maxLength={1000}
          />

          {/* Character count indicator */}
          {(isExpanded || context.length > 0) && (
            <div className="absolute bottom-2 right-3 text-xs text-slate-400">
              {charCount}/1000
            </div>
          )}
        </div>

        {/* Sacred Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {showSkipOption && (
            <button
              type="button"
              onClick={handleSkip}
              className={cn(
                "flex-1 px-6 py-3 text-slate-600 glass-light hover:glass-medium",
                "rounded-lg transition-all duration-300 text-sm font-medium",
                "hover:transform hover:scale-105",
                {
                  "order-2 sm:order-1": variant === "bubble",
                }
              )}
            >
              Continue without context
            </button>
          )}

          <button
            type="submit"
            disabled={!context.trim()}
            className={cn(
              "flex-1 px-6 py-3 bg-gradient-to-r from-breathing-green to-stone",
              "text-white rounded-lg transition-all duration-300 text-sm font-medium",
              "hover:from-breathing-blue hover:to-stone-dark hover:scale-105 hover:shadow-breathing-green",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "animate-breathe-subtle",
              {
                "order-1 sm:order-2": variant === "bubble",
              }
            )}
          >
            {context.trim()
              ? "Create my experience"
              : "Share your context first"}
          </button>
        </div>

        {/* Sacred Character Hint */}
        {context.length > 0 && (
          <div className="text-center animate-breathe-in">
            <p className="text-xs text-slate-500">
              {context.length} characters • The more context, the more
              personalized the experience
            </p>
          </div>
        )}

        {/* Context Quality Indicator */}
        {context.length > 10 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Context quality:</span>
              <span
                className={cn({
                  "text-slate-400": context.length < 50,
                  "text-breathing-gold":
                    context.length >= 50 && context.length < 150,
                  "text-breathing-green": context.length >= 150,
                })}
              >
                {context.length < 50
                  ? "Basic"
                  : context.length < 150
                    ? "Good"
                    : "Excellent"}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div
                className={cn("h-1 rounded-full transition-all duration-300", {
                  "bg-slate-400": context.length < 50,
                  "bg-breathing-gold":
                    context.length >= 50 && context.length < 150,
                  "bg-breathing-green": context.length >= 150,
                })}
                style={{
                  width: `${Math.min(100, (context.length / 200) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </form>

      {/* Sacred Explanation */}
      <div className="mt-8 text-center">
        <div
          className={cn("mx-auto space-y-2", {
            "max-w-md": variant !== "bubble",
            "max-w-sm": variant === "bubble",
          })}
        >
          <p className="text-xs text-slate-500 leading-relaxed">
            This helps the experience recognize you specifically. Or continue
            without— the universal journey is equally profound.
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
