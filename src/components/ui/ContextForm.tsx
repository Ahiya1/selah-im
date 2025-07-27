// src/components/ui/ContextForm.tsx - SELAH Sacred Context Form
// Technology that breathes with you - Sacred context gathering

"use client";

import React, { useState } from "react";

interface ContextFormProps {
  onSubmit: (context: string) => void;
  className?: string;
}

const ContextForm: React.FC<ContextFormProps> = ({
  onSubmit,
  className = "",
}) => {
  const [context, setContext] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  if (isSubmitted) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
          <span className="text-breathing-green text-xl">✓</span>
        </div>
        <div className="space-y-2">
          <p className="text-slate-600 font-medium">
            {context.trim()
              ? "Creating your personalized experience..."
              : "Continuing with the universal journey..."}
          </p>
          <p className="text-slate-500 text-sm">
            Breathing words into existence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
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

        {/* Sacred Input Field */}
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="I heard about this from... I know that..."
            className={`
              input-contemplative resize-none transition-all duration-500 ease-out
              ${isExpanded ? "h-28" : "h-14"}
            `}
            rows={isExpanded ? 4 : 2}
          />
        </div>

        {/* Sacred Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 px-6 py-3 text-slate-600 glass-light hover:glass-medium 
                     rounded-lg transition-all duration-300 text-sm font-medium
                     hover:transform hover:scale-105"
          >
            Continue without context
          </button>
          <button
            type="submit"
            disabled={!context.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-breathing-green to-stone 
                     text-white rounded-lg transition-all duration-300 text-sm font-medium
                     hover:from-breathing-blue hover:to-stone-dark hover:scale-105 hover:shadow-breathing-green
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     animate-breathe-subtle"
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
      </form>

      {/* Sacred Explanation */}
      <div className="mt-8 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-xs text-slate-500 leading-relaxed">
            This helps the experience recognize you specifically. Or continue
            without— the universal journey is equally profound.
          </p>
          <div className="flex items-center justify-center space-x-1 mt-3">
            <div className="w-1 h-1 bg-breathing-green rounded-full animate-pulse"></div>
            <div
              className="w-1 h-1 bg-breathing-blue rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-1 h-1 bg-breathing-pink rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextForm;
