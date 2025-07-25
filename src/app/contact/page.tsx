"use client";

// src/app/contact/page.tsx - SELAH Contact Page
// Technology that breathes with you
// Genuine connection and feedback

import React, { useState } from "react";
import type { Metadata } from "next";

// Note: This is a client component, so metadata should be handled in layout or moved to a server component
// export const metadata: Metadata = {
//   title: "Contact - SELAH",
//   description: "Connect with SELAH. Share your thoughts, questions, or insights about contemplative technology.",
// };

("use client");

interface ContactFormData {
  type: "question" | "feedback" | "contact" | "collaboration";
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage(): JSX.Element {
  const [formData, setFormData] = useState<ContactFormData>({
    type: "question",
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "contact-page",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to send message");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto bg-breathing-green/20 rounded-full flex items-center justify-center animate-breathe">
            <span className="text-breathing-green text-3xl">✓</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-stone">
              Message Received
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Thank you for reaching out. Your message has been received and
              will be read with contemplative attention.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  type: "question",
                  name: "",
                  email: "",
                  subject: "",
                  message: "",
                });
              }}
              className="btn-breathing px-6 py-3"
            >
              Send Another Message
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-16">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <a
          href="/"
          className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-slate-600 hover:text-stone transition-colors"
        >
          <span>←</span>
          <span>Back to Selah</span>
        </a>
      </div>

      <div className="container-contemplative max-w-2xl pt-16">
        <div className="card-stone p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-stone/20 rounded-full flex items-center justify-center animate-breathe">
              <span className="text-stone text-2xl">💬</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-stone">
                Connect
              </h1>
              <p className="text-xl text-slate-600">
                Share your thoughts, questions, or insights
              </p>
            </div>

            <div className="bg-breathing-blue/10 border-l-4 border-breathing-blue p-4 rounded-r-lg text-left">
              <p className="text-slate-700">
                This is a space for genuine connection. Whether you have
                questions about contemplative technology, feedback on the
                experience, or ideas for collaboration—all perspectives are
                welcomed with presence.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What brings you here?
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input-contemplative w-full"
                required
              >
                <option value="question">I have a question</option>
                <option value="feedback">I want to share feedback</option>
                <option value="contact">General inquiry</option>
                <option value="collaboration">Collaboration opportunity</option>
              </select>
            </div>

            {/* Name and Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-contemplative w-full"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-contemplative w-full"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="input-contemplative w-full"
                placeholder="What's this about?"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="input-contemplative w-full resize-none"
                placeholder="Share your thoughts, questions, or insights..."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Express whatever wants to be expressed—questions, feedback,
                ideas, or reflections.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-breathing w-full py-4 text-lg"
            >
              {submitting ? (
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
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          {/* Alternative Contact */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center space-y-3">
              <p className="text-slate-600 text-sm">
                You can also reach out directly:
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:hello@selah.im"
                  className="inline-flex items-center space-x-2 text-stone hover:text-stone-dark transition-colors"
                >
                  <span>📧</span>
                  <span>hello@selah.im</span>
                </a>
              </div>
              <p className="text-xs text-slate-500">
                All messages are read with contemplative attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
