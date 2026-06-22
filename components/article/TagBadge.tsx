"use client";

/**
 * 記事のタグバッジ
 */

import Link from "next/link";

type Props = {
  label: string;
  slug?: string;
};

export default function TagBadge({ label, slug }: Props) {
  const className = `
    inline-block
    rounded-full
    bg-zinc-100
    px-2 md:px-3
    py-0.5 md:py-1
    text-[10px] md:text-xs
    font-medium
    text-zinc-700
    transition-colors
    hover:bg-[var(--brand-150)]
  `;

  if (slug) {
    return (
      <Link
        href={`/tags/${slug}`}
        onClick={(e) => e.stopPropagation()}
        className={`${className} hover:text-[var(--brand-800)]`}
      >
        {label}
      </Link>
    );
  }

  return (
    <span className={className}>
      {label}
    </span>
  );
}
