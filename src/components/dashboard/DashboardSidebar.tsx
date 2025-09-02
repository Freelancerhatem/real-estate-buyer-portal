"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiSearch,
  FiUser,
  FiStar,
  FiMail,
  FiGrid,
  FiX,
  FiSidebar,
} from "react-icons/fi";

/**
 * Navigation items with icon + label.
 * - Keep labels concise
 * - Icons: react-icons/fi (Feather)
 */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: <FiGrid /> },
  { href: "/listings", label: "Browse Listings", icon: <FiHome /> },
  { href: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
  { href: "/search", label: "Search", icon: <FiSearch /> },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: <FiMail /> },
  { href: "/dashboard/favorites", label: "Favorites", icon: <FiStar /> },
] as const;

type Props = {
  /** true = mobile drawer open */
  mobileOpen?: boolean;
  /** callback to close mobile drawer */
  onMobileClose?: () => void;
  /** controlled collapsed state for lg+ */
  collapsedProp?: boolean;
  /** callback to toggle collapsed state */
  onToggleCollapsed?: () => void;
};

/**
 * DashboardSidebar
 *
 * Responsibilities:
 * - Provide main navigation for /dashboard and related pages
 * - Mobile (sm/md): slides in as full-height drawer with backdrop
 * - Desktop (lg+): collapsible between expanded (72px) and compact (20px) widths
 * - Shows active link state using pathname
 *
 * Implementation notes:
 * - Collapsed state is either controlled externally or local
 * - Uses Tailwind transitions for width and transform
 * - Locks body scroll when mobile drawer is open
 */
export default function DashboardSidebar({
  mobileOpen = false,
  onMobileClose,
  collapsedProp,
  onToggleCollapsed,
}: Props) {
  const pathname = usePathname();

  // Local collapsed state if no external prop provided
  const [collapsedLocal, setCollapsedLocal] = useState(false);
  const collapsed = collapsedProp ?? collapsedLocal;

  const toggleCollapsed = () => {
    if (onToggleCollapsed) onToggleCollapsed();
    else setCollapsedLocal((x) => !x);
  };

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /**
   * Render nav links.
   * - Active item highlighted
   * - Labels hidden when collapsed (desktop)
   */
  const Nav = useMemo(
    () => (
      <nav className="px-2 pb-4 space-y-1">
        {NAV_ITEMS.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                active ? "bg-gray-200 font-medium" : "hover:bg-gray-100",
              ].join(" ")}
            >
              <span className="text-lg shrink-0">{it.icon}</span>
              {/* Hide labels when collapsed on lg+ */}
              <span className={collapsed ? "lg:hidden truncate" : "truncate"}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
    ),
    [pathname, collapsed]
  );

  return (
    <>
      {/* === Desktop Sidebar (lg+) === */}
      <aside
        className={[
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30",
          "bg-gray-50 border-r shadow-sm",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "lg:w-20" : "lg:w-72",
        ].join(" ")}
      >
        {/* Header: Title + Collapse Toggle */}
        <div className="flex items-center justify-between p-3">
          <div className={collapsed ? "lg:hidden" : ""}>
            <h2 className="text-base font-semibold">Buyer Dashboard</h2>
          </div>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
            className="inline-flex items-center justify-center rounded border px-2 py-1 text-sm hover:bg-gray-100"
          >
            <FiSidebar
              className={`transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="overflow-y-auto">{Nav}</div>
      </aside>

      {/* Spacer to offset fixed sidebar */}
      <div
        className={["hidden lg:block", collapsed ? "w-20" : "w-72"].join(" ")}
      />

      {/* === Mobile Drawer (sm/md) === */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-40",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity ${
            mobileOpen ? "bg-black/40 opacity-100" : "opacity-0"
          }`}
          onClick={onMobileClose}
        />

        {/* Drawer Panel */}
        <div
          className={[
            "absolute inset-y-0 left-0 w-full max-w-[85%] sm:max-w-xs",
            "bg-gray-50 border-r shadow-xl",
            "transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            "flex flex-col",
          ].join(" ")}
        >
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="text-base font-semibold">Buyer Dashboard</h2>
            <button
              aria-label="Close menu"
              onClick={onMobileClose}
              className="inline-flex items-center justify-center rounded border px-2 py-1 text-sm hover:bg-gray-100"
            >
              <FiX />
            </button>
          </div>
          <div className="overflow-y-auto">{Nav}</div>
        </div>
      </div>
    </>
  );
}
