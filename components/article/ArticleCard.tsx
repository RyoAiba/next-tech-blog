"use client";

/**
 * 記事カード
 */

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import TagBadge from "./TagBadge";
import type { Article } from "@/features/articles";

// タグ型
export type Tag = {
  name: string; // 表示用
  slug: string; // URL用
};

type Props = {
  article: Article;
  variant?: "list" | "related";
};

export default function ArticleCard({
  article,
  variant = "list",
}: Props) {
  const router = useRouter();
  const imageSrc = article.image ?? "/default-eyecatch.svg";
  const isRelated = variant == "related";
  return (
    <article
      onClick={() => router.push(`/articles/${article.slug}`)}
      className="
        card-base
        card-base-hover
        overflow-hidden
        p-4 md:p-5
      "
    >
      <div className={`flex gap-4 md:gap-5 ${isRelated ? "md:flex-col" : "md:flex-row"}`}>
        {/* 画像エリア */}
        <div
          className={`
            relative
            aspect-square
            shrink-0
            overflow-hidden
            self-center
            ${isRelated
              ? "h-20 w-20 md:w-full md:h-36"
              : "h-20 w-20 md:h-28 md:w-28"
            }
          `}
        >
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 160px"
            priority={false}
          />
        </div>

        {/* テキストエリア */}
        <div>
          {/* タイトル */}
          <div className="mb-1 md:mb-2 md:text-xl font-semibold text-zinc-900">
            {article.title}
          </div>

          {/* タグ */}
          <div className="mb-1 md:mb-2 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <TagBadge key={tag.slug} label={tag.name} slug={tag.slug} />
            ))}
          </div>

          {/* メタ */}
          <div className="flex items-center gap-0.5 text-xs text-zinc-500">
            <CalendarBlank
              size={14}
              weight="regular"
              className="shrink-0 text-zinc-400"
              aria-hidden="true"
            />
            <span>{article.updatedAt}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
