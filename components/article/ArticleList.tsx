/**
 * 記事一覧
 */

import ArticleCard from "./ArticleCard";
import { Article } from "@/features/articles";

type Props = {
  articles: Article[];
  title?: string;
};

export default function ArticleList({ articles, title }: Props) {
  return (
    <section className="max-w-4xl mx-auto">
      {/* タイトル */}
      <p className="text-2xl font-bold mb-8">
        {title}
      </p>
      {/* 記事カード */}
      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
