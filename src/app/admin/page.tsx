// src/app/admin/page.tsx - SELAH Admin Dashboard
// Technology that breathes with you
// Admin dashboard for analytics and email management

import React from "react";

export default function AdminPage(): JSX.Element {
  // TODO: Implement admin dashboard
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-700">
                Analytics and email management for SELAH contemplative
                technology.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Emails
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🧘</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Sessions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-stone rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💫</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg Engagement
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Admin functionality will be implemented in Phase 2 of development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
