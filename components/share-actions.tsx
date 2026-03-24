"use client";

import { useState } from "react";

type ShareActionsProps = {
  id?: string;
  typeCode: string;
  typeName: string;
  shareText: string;
  shareUrl: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

export function ShareActions({
  id,
  typeCode,
  typeName,
  shareText,
  shareUrl,
  eyebrow = "Share",
  title = "結果をシェアする",
  description = "X、LINE、OSの共有シートからそのまま送れます。",
  className = "",
}: ShareActionsProps) {
  const [status, setStatus] = useState("");

  const encodedXUrl = `https://x.com/intent/tweet?${new URLSearchParams({
    text: shareText,
    url: shareUrl,
  }).toString()}`;

  const encodedLineUrl = `https://line.me/R/share?${new URLSearchParams({
    text: `${shareText} ${shareUrl}`,
  }).toString()}`;

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) {
      window.open(encodedXUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      await navigator.share({
        title: `${typeName} (${typeCode})`,
        text: shareText,
        url: shareUrl,
      });
      setStatus("共有シートを開きました。");
    } catch {
      setStatus("");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("リンクをコピーしました。");
    } catch {
      setStatus("リンクをコピーできませんでした。");
    }
  }

  return (
    <div
      id={id}
      className={`surface-panel flex flex-col gap-4 ${className}`.trim()}
    >
      <div className="flex flex-col gap-2">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={handleNativeShare} className="primary-button">
          共有する
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href={encodedXUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-button justify-center"
          >
            X で共有
          </a>
          <a
            href={encodedLineUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-button justify-center"
          >
            LINE で共有
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="secondary-button justify-center"
          >
            リンクをコピー
          </button>
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-[color:var(--color-text-subtle)]">
        {status}
      </p>
    </div>
  );
}
