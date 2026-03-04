/**
 * タグ別一覧ページ
 */

import { notFound } from "next/navigation";
import ArticleArchive from "@/components/article/ArticleArchive";
import { getArticlesByTag, getArticleCountByTag } from "@/features/articles";
import { tags } from "@/lib/tags";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const tagInfo = tags.find((t) => t.slug === slug);
  if (!tagInfo) notFound();
  const currentPage = Number(page ?? "1");
  if (!Number.isInteger(currentPage) || currentPage < 1) notFound();
  const totalCount = getArticleCountByTag(slug);
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / 2)
  );
  if (currentPage > totalPages) notFound();
  const articles  = getArticlesByTag(slug, currentPage, 2);
  const label = tagInfo?.name ?? slug;

  return (
    <main className="max-w-7xl mx-auto px-4 md:pl-10 md:pr-4 py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-10">
        <ArticleArchive
          title={`# ${label} の記事`}
          articles={articles}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath={`/tags/${slug}`}
        />
      </div>
    </main>
  );
}