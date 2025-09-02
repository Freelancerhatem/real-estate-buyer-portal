"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import DashboardSidebar from "./DashboardSidebar";

/**
 * DashboardShell
 * - Renders the responsive/collapsible sidebar
 * - Provides a top bar (hamburger for mobile, collapse on lg+)
 * - Wraps page content via {children}
 */
export default function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  /** Optional page title to show in top bar */
  title?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar (fixed on lg) */}
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsedProp={collapsed}
        onToggleCollapsed={() => setCollapsed((x) => !x)}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20" role="banner">
          <div className="flex items-center gap-2 h-14 md:h-0 px-4 md:px-6">
            {/* mobile menu */}
            <button
              className="lg:hidden inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar menu"
            >
              <FiMenu />
              <span>Menu</span>
            </button>

            {/* page title (optional) */}
            {title ? (
              <h1 className="text-sm md:text-base font-medium truncate">
                {title}
              </h1>
            ) : null}
          </div>
        </header>

        {/* Skip link target */}
        <a id="main-content" className="sr-only">
          Main content
        </a>

        {/* Right-side content */}
        <main
          className="flex-1 p-4 md:p-6 "
          role="main"
          aria-labelledby="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
