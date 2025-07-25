// src/app/terms/page.tsx - SELAH Terms of Service
// Technology that breathes with you
// Terms of service and usage agreement

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SELAH",
  description: "Terms of service for SELAH contemplative technology platform",
};

export default function TermsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-16">
      <div className="container-contemplative max-w-4xl">
        <div className="card-stone p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-stone mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600">
              Our contemplative agreement for using SELAH
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: January 2025
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Our Philosophy
              </h2>
              <div className="bg-breathing-green/10 border-l-4 border-breathing-green p-6 rounded-r-lg">
                <p className="text-slate-700 leading-relaxed">
                  These terms are written in the spirit of contemplative
                  technology—clear, respectful, and designed to serve
                  consciousness rather than legal complexity. We believe
                  agreements should be as mindful as the technology they govern.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-slate-700 leading-relaxed">
                By using SELAH, joining our email list, or engaging with our
                contemplative technology, you agree to these terms. If you don't
                agree, please don't use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                What SELAH Provides
              </h2>
              <div className="text-slate-700 space-y-3">
                <p>SELAH offers:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Contemplative technology designed to serve consciousness
                  </li>
                  <li>
                    Breathing meditation tools and interactive experiences
                  </li>
                  <li>
                    AI-generated contemplative questions (in future versions)
                  </li>
                  <li>A community focused on mindful technology use</li>
                  <li>Educational content about contemplative practices</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Your Responsibilities
              </h2>
              <div className="text-slate-700 space-y-3">
                <p>When using SELAH, please:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Use the platform in the spirit of contemplative practice
                  </li>
                  <li>Respect other community members</li>
                  <li>Provide accurate information when requested</li>
                  <li>Not use the service for harmful or illegal purposes</li>
                  <li>Not attempt to abuse or misuse the technology</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Intellectual Property
              </h2>
              <div className="text-slate-700 space-y-4">
                <p>
                  SELAH's code, design, and contemplative frameworks are our
                  intellectual property. However, we believe in open source
                  principles where appropriate.
                </p>
                <p>
                  Portions of SELAH will be open-sourced to inspire a movement
                  of contemplative technology. This includes design patterns,
                  interaction principles, and educational resources.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Disclaimers
              </h2>
              <div className="text-slate-700 space-y-4">
                <p>
                  <strong>Not Medical Advice:</strong> SELAH is a contemplative
                  technology tool, not a medical device. It's not intended to
                  diagnose, treat, or cure any medical condition. Please consult
                  healthcare professionals for medical advice.
                </p>
                <p>
                  <strong>Early Development:</strong> SELAH is in active
                  development. Features may change, and some functionality
                  described may not yet be available.
                </p>
                <p>
                  <strong>Personal Responsibility:</strong> Your contemplative
                  practice and wellbeing remain your responsibility. SELAH is a
                  tool to support your journey, not replace your judgment.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Service Availability
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We strive to keep SELAH available and functional, but we can't
                guarantee uninterrupted service. We may need to perform
                maintenance, updates, or modifications that temporarily affect
                availability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Privacy and Data
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Your privacy is important to us. Please review our{" "}
                <a href="/privacy" className="text-stone hover:underline">
                  Privacy Policy
                </a>{" "}
                to understand how we handle your information with contemplative
                care.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Limitation of Liability
              </h2>
              <p className="text-slate-700 leading-relaxed">
                To the fullest extent permitted by law, SELAH and its creators
                are not liable for any indirect, incidental, or consequential
                damages arising from your use of the service. Our liability is
                limited to the amount you've paid for the service (if any).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Changes to Terms
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We may update these terms as SELAH evolves. Significant changes
                will be communicated clearly, and continued use of the service
                constitutes acceptance of updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Termination
              </h2>
              <p className="text-slate-700 leading-relaxed">
                You may stop using SELAH at any time. We may terminate or
                suspend access if these terms are violated. In the spirit of
                contemplative practice, we'll communicate clearly about any
                issues before taking action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Contact
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Questions about these terms? We're here to help with clarity and
                understanding. Contact us at{" "}
                <a
                  href="mailto:legal@selah.im"
                  className="text-stone hover:underline"
                >
                  legal@selah.im
                </a>{" "}
                or{" "}
                <a
                  href="mailto:hello@selah.im"
                  className="text-stone hover:underline"
                >
                  hello@selah.im
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
