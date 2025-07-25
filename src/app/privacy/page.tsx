// src/app/privacy/page.tsx - SELAH Privacy Page
// Technology that breathes with you
// Privacy policy and data handling

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SELAH",
  description: "How SELAH handles your data with contemplative care",
};

export default function PrivacyPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-16">
      <div className="container-contemplative max-w-4xl">
        <div className="card-stone p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-stone mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600">
              How we handle your data with contemplative care
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: January 2025
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Our Approach
              </h2>
              <p className="text-slate-700 leading-relaxed">
                At SELAH, we believe technology should serve consciousness, not
                exploit it. Our approach to data is guided by the same
                contemplative principles that shape our platform: mindfulness,
                respect, and genuine care for human wellbeing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="font-semibold mb-2">Email Address</h3>
                  <p>
                    When you join our contemplative community, we collect your
                    email address to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Send you updates about SELAH's development</li>
                    <li>Provide early access to new features</li>
                    <li>Share contemplative insights and content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Usage Analytics</h3>
                  <p>
                    We collect anonymous usage data to improve the contemplative
                    experience:
                  </p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Time spent in meditation sessions</li>
                    <li>Interaction patterns with breathing exercises</li>
                    <li>General usage patterns (no personal identification)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                How We Use Your Information
              </h2>
              <div className="text-slate-700 space-y-3">
                <p>Your information is used exclusively to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Provide you with SELAH updates and early access</li>
                  <li>Improve the contemplative technology experience</li>
                  <li>Understand how people engage with mindful technology</li>
                  <li>Ensure the platform serves consciousness effectively</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                What We Don't Do
              </h2>
              <div className="bg-breathing-green/10 border-l-4 border-breathing-green p-6 rounded-r-lg">
                <ul className="space-y-2 text-slate-700">
                  <li>❌ We never sell your email or data to third parties</li>
                  <li>❌ We don't use tracking for advertising purposes</li>
                  <li>❌ We don't collect unnecessary personal information</li>
                  <li>❌ We don't spam or overwhelm you with emails</li>
                  <li>❌ We don't use dark patterns or manipulative design</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Data Security
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Your data is stored securely using industry-standard encryption
                and security practices. We use trusted infrastructure providers
                and implement security measures appropriate for the type of data
                we collect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Your Rights
              </h2>
              <div className="text-slate-700 space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Unsubscribe from emails at any time</li>
                  <li>Request deletion of your data</li>
                  <li>Access the information we have about you</li>
                  <li>Correct any inaccurate information</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at{" "}
                  <a
                    href="mailto:privacy@selah.im"
                    className="text-stone hover:underline"
                  >
                    privacy@selah.im
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Changes to This Policy
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this privacy policy as SELAH evolves. Any changes
                will be communicated clearly, and we'll always maintain our
                commitment to contemplative, respectful data practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone mb-4">
                Contact Us
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Questions about privacy? We're here to help. Reach out to us at{" "}
                <a
                  href="mailto:privacy@selah.im"
                  className="text-stone hover:underline"
                >
                  privacy@selah.im
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
