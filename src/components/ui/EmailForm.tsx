// src/components/ui/EmailForm.tsx - SELAH Email Form Component
// Technology that breathes with you
// Email collection with validation

import React, { useState, useCallback } from "react";
import { validateEmail } from "@/lib/utils";
import type {
  EmailFormProps,
  EmailFormState,
  EmailSubmission,
} from "@/lib/types";

const EmailForm: React.FC<EmailFormProps> = ({
  onSubmit,
  onValidation,
  variant = "default",
  placeholder = "your@email.com",
  className = "",
  disabled = false,
}) => {
  const [state, setState] = useState<EmailFormState>({
    email: "",
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    validationResult: null,
  });

  const handleEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const email = event.target.value;
      setState((prev) => ({ ...prev, email, error: null }));

      if (email) {
        const validationResult = validateEmail(email);
        setState((prev) => ({ ...prev, validationResult }));
        onValidation?.(validationResult);
      }
    },
    [onValidation]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (disabled || state.isSubmitting) return;

      const validationResult = validateEmail(state.email);

      if (!validationResult.isValid) {
        setState((prev) => ({
          ...prev,
          error: validationResult.error || "Invalid email address",
          validationResult,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      try {
        const submission: EmailSubmission = {
          id: Date.now().toString(),
          email: state.email,
          timestamp: new Date().toISOString(),
          source: "landing-page",
          validated: true,
        };

        // TODO: Send to API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          email: "",
        }));

        onSubmit?.(submission);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: "Failed to submit email. Please try again.",
        }));
      }
    },
    [state.email, state.isSubmitting, disabled, onSubmit]
  );

  const variantClasses = {
    default: "space-y-4 max-w-md mx-auto",
    inline: "flex space-x-2",
    modal: "space-y-6",
  };

  if (state.isSubmitted) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center">
          <span className="text-breathing-green text-xl">✓</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-stone">
            Welcome to the Journey
          </h3>
          <p className="text-slate-600">
            Thank you for joining our contemplative community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${variantClasses[variant]} ${className}`}
    >
      <div className={variant === "inline" ? "flex-1" : ""}>
        <input
          type="email"
          value={state.email}
          onChange={handleEmailChange}
          placeholder={placeholder}
          className={`
            input-contemplative
            ${variant === "default" ? "text-center" : ""}
            ${state.validationResult?.isValid === false ? "border-red-300 focus:border-red-500" : ""}
            ${variant === "inline" ? "rounded-r-none" : ""}
          `}
          disabled={disabled || state.isSubmitting}
          required
        />

        {state.error && variant !== "inline" && (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        )}

        {state.validationResult?.suggestions &&
          state.validationResult.suggestions.length > 0 && (
            <div className="mt-2 text-sm text-slate-600">
              <p>Did you mean:</p>
              <div className="space-x-2">
                {state.validationResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, email: suggestion }))
                    }
                    className="text-stone hover:text-stone-dark underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      <button
        type="submit"
        disabled={disabled || state.isSubmitting || !state.email}
        className={`
          btn-breathing
          ${variant === "inline" ? "rounded-l-none px-8" : "w-full py-4 text-lg"}
        `}
      >
        {state.isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Joining...
          </span>
        ) : (
          "Join the Contemplative Journey"
        )}
      </button>

      {variant !== "inline" && (
        <p className="text-sm text-slate-500 mt-4">
          ✓ No spam, ever. Just contemplative updates when Selah is ready.
        </p>
      )}
    </form>
  );
};

export default EmailForm;
