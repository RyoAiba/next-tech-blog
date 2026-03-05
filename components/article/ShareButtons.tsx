"use client";

/**
 * 記事シェアボタン
 */

import { useState } from "react";

type Props = {
  title: string;
};

export default function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);

    setVisible(true);
    setCopied(true);

    setTimeout(() => {
      setCopied(false); // フェードアウト開始
    }, 1200);

    setTimeout(() => {
      setVisible(false); // DOMから削除
    }, 1350);
  };

  const baseStyle =
  "w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-zinc-400 hover:text-[#00c8af]";

  return (
    <div className="mt-16 pt-8">
      <div className="flex gap-4 justify-end">
        {/* コピーアイコン */}
        <button
          onClick={handleCopy}
          className={`${baseStyle} relative`}
          aria-label="リンクをコピー"
        >
          {/* 吹き出し */}
          {visible && (
            <span
              className={`
                absolute
                -top-6
                left-1/2
                -translate-x-1/2
                bg-zinc-800
                text-white
                text-xs
                px-2
                py-1
                rounded-md
                whitespace-nowrap
                pointer-events-none
                ${copied ? "tooltip-enter" : "tooltip-exit"}
              `}
            >
              リンクをコピーしました
              <span
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  top-[calc(100%-4px)]
                  w-2
                  h-2
                  bg-zinc-800
                  rotate-45
                "
              />
            </span>
          )}

          <svg
            viewBox="0 0 27 27"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
          >
            <path d="M9.6 23.9c-3.6 0-6.5-3-6.5-6.6 0-1.7.7-3.4 1.9-4.6l2.3-2.3c.5-.4 1.2-.4 1.6.1.4.4.4 1 0 1.5l-2.3 2.3c-1.7 1.7-1.7 4.4 0 6.1s4.4 1.7 6.1 0l2.3-2.3c.5-.4 1.2-.4 1.6.1.4.4.4 1 0 1.5L14.3 22c-1.3 1.2-2.9 1.9-4.7 1.9Zm1-6.4c-.6 0-1.1-.5-1.1-1.1 0-.3.1-.6.3-.8l5.8-5.8c.4-.4 1.1-.4 1.6 0 .4.4.4 1.1 0 1.6l-5.8 5.8c-.2.2-.5.3-.8.3Zm8.3-.6c-.3 0-.6-.1-.8-.3-.4-.4-.4-1.1 0-1.6l2.3-2.3c1.7-1.7 1.7-4.4 0-6.1-1.7-1.7-4.4-1.7-6.1 0L12 8.9c-.5.4-1.2.4-1.6-.1-.4-.4-.4-1 0-1.5L12.7 5c2.6-2.6 6.7-2.6 9.2 0s2.6 6.7 0 9.2l-2.3 2.4c-.2.2-.5.3-.7.3Z" />
          </svg>
        </button>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyle}
          aria-label="Xでシェア"
        >
          {/* Xアイコン */}
          <svg
            viewBox="0 0 27 28"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M16.0687 11.7356L26.12 0H23.7382L15.0106 10.1899L8.03988 0H0L10.5411 15.4089L0 27.7155H2.38199L11.5985 16.9546L18.9601 27.7155H27L16.0681 11.7356H16.0687ZM12.8062 15.5447L11.7382 14.0103L3.24025 1.80106H6.89884L13.7568 11.6543L14.8248 13.1887L23.7393 25.9963H20.0807L12.8062 15.5452V15.5447Z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyle}
          aria-label="Facebookでシェア"
        >
          {/* Facebookアイコン */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M28 14C28 6.268 21.732 0 14 0C6.268 0 0 6.268 0 14C0 20.589 4.52 26.118 10.618 27.637V18.293H7.731V14H10.618V12.149C10.618 7.366 12.775 5.149 17.453 5.149C18.34 5.149 19.871 5.324 20.497 5.498V9.391C20.166 9.356 19.592 9.339 18.879 9.339C16.584 9.339 15.697 10.212 15.697 12.481V14H20.27L19.484 18.293H15.697V28C22.629 27.16 28 21.184 28 14Z"/>
          </svg>
        </a>

        {/* はてなブックマーク */}
        <a
          href={`https://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyle}
          aria-label="はてなブックマーク"
        >
          {/* はてなアイコン */}
          <svg
            viewBox="0 0 27 28"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.4999 0.729736H21.5001C24.5376 0.729736 27 3.19213 27 6.22964V22.2298C27 25.2673 24.5376 27.7297 21.5001 27.7297H5.4999C2.46239 27.7297 0 25.2673 0 22.2298V6.22964C0 3.19213 2.46239 0.729736 5.4999 0.729736ZM12.98 13.7472C13.8521 13.8136 14.5319 14.1209 15.0212 14.6673C15.512 15.2127 15.7572 15.9444 15.7572 16.8543C15.7572 17.5126 15.62 18.0877 15.3436 18.5867C15.0692 19.084 14.6756 19.4712 14.1604 19.7433C13.7441 19.9658 13.2289 20.1278 12.6155 20.2245C12.001 20.3179 10.9966 20.3665 9.6039 20.3665H6.13656V8.09392H9.50184C10.8859 8.09392 11.8503 8.13875 12.4016 8.22623C12.9503 8.31695 13.4206 8.4703 13.8164 8.68792C14.269 8.93902 14.6129 9.27437 14.8527 9.69341C15.0865 10.1151 15.2069 10.6028 15.2069 11.1546C15.2069 11.8512 15.0309 12.4053 14.6761 12.813C14.3197 13.2261 13.756 13.5355 12.98 13.7472ZM9.24372 10.8144V13.2768H9.91116C10.7352 13.2768 11.2984 13.1856 11.6073 13.0058C11.9124 12.8227 12.0663 12.5273 12.0663 12.0667C12.0663 11.6061 11.9216 11.2821 11.6375 11.0947C11.3497 10.9084 10.7919 10.8144 9.96192 10.8144H9.24372ZM9.24372 15.4703V18.1514H10.4128C11.2028 18.1514 11.7661 18.0531 12.0928 17.8523C12.4227 17.653 12.5863 17.3209 12.5863 16.8581C12.5863 16.3408 12.4367 15.9806 12.1338 15.7765C11.8357 15.5724 11.2747 15.4703 10.463 15.4703H9.24372ZM17.9593 8.09318H20.6593V16.2753H17.9593V8.09318ZM19.3093 17.257C18.4502 17.257 17.7547 17.9525 17.7547 18.8111C17.7547 19.6697 18.4507 20.3658 19.3093 20.3658C20.1679 20.3658 20.8634 19.6697 20.8634 18.8111C20.8634 17.9525 20.1668 17.257 19.3093 17.257Z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}