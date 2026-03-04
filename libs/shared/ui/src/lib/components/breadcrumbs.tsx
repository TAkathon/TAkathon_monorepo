"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Show a back button that navigates to the previous breadcrumb's href */
  showBack?: boolean;
}

/**
 * Shared breadcrumb component for detail/nested pages.
 *
 * Usage:
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Teams", href: "/dashboard/teams" },
 *     { label: "Code Warriors" },
 *   ]}
 *   showBack
 * />
 * ```
 */
export function Breadcrumbs({ items, showBack = false }: BreadcrumbsProps) {
  // Find the last item with an href (for "back" navigation)
  const backHref = showBack
    ? [...items].reverse().find((i) => i.href)?.href
    : undefined;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {backHref && (
        <Link
          href={backHref}
          className="text-white/50 hover:text-white transition-colors mr-1"
          aria-label="Go back"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                className="w-3.5 h-3.5 text-white/30"
                aria-hidden="true"
              />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "text-white font-medium" : "text-white/50"}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
