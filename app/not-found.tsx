import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell py-12">
      <section className="surface-panel flex flex-col gap-4 text-center sm:text-left">
        <p className="eyebrow">Not Found</p>
        <h1 className="section-title">そのページは見つかりませんでした</h1>
        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          タイプコードか共有URLが壊れている可能性があります。トップページからもう一度診断を始めてください。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="primary-button justify-center">
            トップへ戻る
          </Link>
          <Link href="/diagnosis" className="secondary-button justify-center">
            診断ページへ
          </Link>
        </div>
      </section>
    </main>
  );
}
