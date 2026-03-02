import { getUpdatedAt } from "@/lib/getUpdatedAt";

/**
 * タグ型
 */

export type Tag = {
  name: string; // 表示用
  slug: string; // URL用
};

/**
 * 記事型
 */
export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  content: string;
  tags: Tag[];
  image?: string;
};

import { nextjsArchitecture } from "./content/nextjs-architecture";
import { typescriptDesign } from "./content/typescript-design";
import { reactPerformance } from "./content/react-performance";
import { javascriptScrollChangeCss } from "./content/javascript-scroll-change-css";
import { gitStashUsage } from "./content/git-stash-usage";
import { whitespaceDesign } from "./content/whitespace-design";
import { cssAnimationMethods } from "./content/css-animation-methods";
import { buttonDesignBasics } from "./content/button-design-basics";
import { cssCursorHowToUse } from "./content/css-cursor-how-to-use";
import { cssTransitionHowToUse } from "./content/css-transition-how-to-use";
import { cssPositionBasics } from "./content/css-position-basics";
import { whatIsTypescript } from "./content/what-is-typescript";
import { cssLayoutFlexGridDifference } from "./content/css-layout-flex-grid-difference";
// 記事が増えたらここにimport追加

/**
 * 生記事配列
 */
const rawArticles = [
  nextjsArchitecture,
  typescriptDesign,
  reactPerformance,
  javascriptScrollChangeCss,
  gitStashUsage,
  whitespaceDesign,
  cssAnimationMethods,
  buttonDesignBasics,
  cssCursorHowToUse,
  cssTransitionHowToUse,
  cssPositionBasics,
  whatIsTypescript,
  cssLayoutFlexGridDifference,
];

/**
 * updatedAtを追加した記事配列
 */
export const articles: Article[] = rawArticles.map((article) => {
  return {
    ...article,
    updatedAt: (() => {
      try {
        return getUpdatedAt(
          `features/articles/content/${article.slug}.ts`
        );
      } catch {
        return article.publishedAt;
      }
    })(),
  };
});

/**
 * slugから記事取得
 */
export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/**
 * タグ別記事一覧取得
 */
export function getArticlesByTag(slug: string) {
  return articles.filter((article) =>
    article.tags.some((tag) => tag.slug === slug)
  );
}

/**
 * 全記事取得（SSG用）
 */
export function getAllArticles() {
  return articles;
}

/**
 * 前後記事を取得
 */
export function getAdjacentArticles(slug: string) {
  const index = articles.findIndex((a) => a.slug === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: articles[index + 1] ?? null, // 古い記事
    next: articles[index - 1] ?? null, // 新しい記事
  };
}

/**
 * 同じタグを持つ関連記事を取得
 */
export function getRelatedArticles(
  slug: string,
  max = 3
) {
  const all = getAllArticles();
  const current = getArticleBySlug(slug);

  if (!current) return [];

  // 現在記事のタグslug一覧
  const currentTagSlugs = current.tags.map((t) => t.slug);

  // 同タグ記事抽出（自分は除外）
  const related = all.filter((article) => {
    if (article.slug === slug) return false;

    return article.tags.some((tag) =>
      currentTagSlugs.includes(tag.slug)
    );
  });

  // ランダムシャッフル
  const shuffled = related.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, max);
}
