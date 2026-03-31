/**
 * Dashboard Modern — Warm/light dashboard shell
 *
 * Non-glassmorphism alternative to glassmorphism-dashboard. Clean, elevated
 * layout with sidebar, top bar, and content area. Uses the elevation shadow
 * system instead of backdrop blur.
 *
 * Taxonomy: webapp (health, saas, ecommerce) · modern/organic styles · gentle-moderate intensity
 *
 * Dependencies: none (pure React + Tailwind). Uses shadcn Sidebar if available.
 */

"use client";

import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardModernProps {
  /** App name shown in sidebar header */
  appName: string;
  /** Navigation items */
  navItems: NavItem[];
  /** User info for avatar/name display */
  user?: { name: string; email: string; avatar?: string };
  /** Main content */
  children: React.ReactNode;
}

export function DashboardModern({
  appName,
  navItems,
  user,
  children,
}: DashboardModernProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col border-r bg-card
          transition-all duration-300 ease-out
          ${sidebarOpen ? "w-64" : "w-16"}
        `}
        style={{
          boxShadow: "1px 0 4px rgba(0,0,0,0.03)",
        }}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            {appName[0]}
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-sm">{appName}</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                text-muted-foreground
                hover:bg-accent hover:text-accent-foreground
                transition-colors duration-150
                ${!sidebarOpen ? "justify-center" : ""}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Sidebar footer (user) */}
        {user && sidebarOpen && (
          <div className="border-t p-3">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="border-t p-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className={`mx-auto h-4 w-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header
          className="flex h-16 items-center justify-between border-b bg-card px-6"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-muted-foreground"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb / page title placeholder */}
          <div className="hidden lg:block" />

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search, notifications, etc. — add as needed */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/**
 * Usage:
 *
 * <DashboardModern
 *   appName="NutriJourney"
 *   navItems={[
 *     { label: "Dashboard", href: "/", icon: <HomeIcon /> },
 *     { label: "Meals", href: "/meals", icon: <UtensilsIcon />, badge: "3" },
 *     { label: "Goals", href: "/goals", icon: <TargetIcon /> },
 *   ]}
 *   user={{ name: "Jane Doe", email: "jane@example.com" }}
 * >
 *   <DashboardContent />
 * </DashboardModern>
 *
 * Pair with:
 * - bento-grid for dashboard overview layout
 * - ScrollCounter for animated stat cards
 * - ElevatedButton for primary actions
 * - elevation shadow system from spatial-depth.md
 */
