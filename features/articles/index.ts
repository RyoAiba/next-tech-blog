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
  updatedAtTimestamp?: number;
  content: string;
  tags: Tag[];
  image?: string;
};

/**
 * ページネーション結果型
 */
export type PaginatedArticles = {
  articles: Article[];
  totalPages: number;
  currentPage: number;
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
import { vuePerformanceOptimization } from "./content/vue-performance-optimization";
import { uiVisualHierarchy } from "./content/ui-visual-hierarchy";
import { javascriptAjax } from "./content/javascript-ajax";
import { javascriptGetUserMedia } from "./content/javascript-get-user-media";
import { javascriptAjaxPractice } from "./content/javascript-ajax-practice";
import { typescriptApiResponseType } from "./content/typescript-api-response-type";
import { vueCompositionVsOptions } from "./content/vue-composition-vs-options";
import { vueLoadingSpinner } from "./content/vue-loading-spinner";
import { vuePiniaIntroduction } from "./content/vue-pinia-introduction";
import { reactTocComponent } from "./content/react-toc-component";
import { reactTocComponentMobile } from "./content/react-toc-component-mobile";
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
  vuePerformanceOptimization,
  uiVisualHierarchy,
  javascriptAjax,
  javascriptGetUserMedia,
  javascriptAjaxPractice,
  typescriptApiResponseType,
  vueCompositionVsOptions,
  vueLoadingSpinner,
  vuePiniaIntroduction,
  reactTocComponent,
  reactTocComponentMobile,
];

/**
 * 更新日時を追加した記事配列
 */
export const articles: Article[] = rawArticles
  .map((article) => {
    const updatedAt = article.updatedAt ?? article.publishedAt
    const updatedAtTimestamp = article.updatedAtTimestamp ?? new Date(article.publishedAt.replace(/\./g, "-")).getTime();

    return {
      ...article,
      updatedAt: updatedAt,
      updatedAtTimestamp: updatedAtTimestamp,
    };
  })
  .sort((a, b) => {
    return (
      (b.updatedAtTimestamp ?? 0) -
      (a.updatedAtTimestamp ?? 0)
    );
  });
articles.map((a) => {
  console.log("title", a.title);
  console.log("updatedAt", a.updatedAt);
  console.log("updatedAtTimestamp", a.updatedAtTimestamp);
});

/**
 * 汎用ページネーション処理
 */
function paginate(
  items: Article[],
  page: number,
  perPage: number
): Article[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

/**
 * 全記事一覧取得(ページネーション対応)
 */
export function getAllArticles(
  page: number = 1,
  perPage: number = 5
): Article[] {
  return paginate(articles, page, perPage);
}

/**
 * 全記事件数取得
 */
export function getAllArticleCount() {
  return articles.length;
}

/**
 * タグ別記事一覧取得(ページネーション対応)
 */
export function getArticlesByTag(
  slug: string,
  page: number = 1,
  perPage: number = 5
): Article[] {
  const filtered = articles.filter((article) =>
    article.tags.some((tag) => tag.slug === slug)
  );
  return paginate(filtered, page, perPage);
}

/**
 * タグ別記事件数取得
 */
export function getArticleCountByTag(slug: string) {
  return articles.filter((article) =>
    article.tags.some((tag) => tag.slug === slug)
  ).length;
}

/**
 * slugから記事取得
 */
export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
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
  const current = getArticleBySlug(slug);

  if (!current) return [];

  // 現在記事のタグslug一覧
  const currentTagSlugs = current.tags.map((t) => t.slug);

  // 同タグ記事抽出（自分は除外）
  const related = articles.filter((article) => {
    if (article.slug === slug) return false;

    return article.tags.some((tag) =>
      currentTagSlugs.includes(tag.slug)
    );
  });

  // ランダムシャッフル
  const shuffled = related.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, max);
}
