import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ShareActions } from "@/components/share-actions";
import { TypeArtwork } from "@/components/type-artwork";
import { getAllTypeCodes, getTypeByCode } from "@/lib/data";
import { stringifyJsonLd, getTypePageJsonLd } from "@/lib/json-ld";
import { getAbsoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ typeCode: string }>;
};

export async function generateStaticParams() {
  const typeCodes = await getAllTypeCodes();
  return typeCodes.map((typeCode) => ({ typeCode }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { typeCode } = await params;
  const typeData = await getTypeByCode(typeCode);

  if (!typeData) {
    notFound();
  }

  return {
    title: `${typeData.typeName} (${typeData.typeCode})`,
    description: typeData.summary,
    alternates: {
      canonical: `/types/${typeData.typeCode}`,
    },
    openGraph: {
      title: `${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      url: `/types/${typeData.typeCode}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      images: [`/types/${typeData.typeCode}/opengraph-image`],
    },
  };
}

export default async function TypeDetailPage({ params }: PageProps) {
  const { typeCode } = await params;
  const typeData = await getTypeByCode(typeCode);

  if (!typeData) {
    notFound();
  }

  const publicUrl = getAbsoluteUrl(`/types/${typeData.typeCode}`);
  const axisRows = [
    {
      title: "発言 / 観察",
      dominant: typeData.axis.axis1,
      other: typeData.axis.axis1 === "発言型" ? "観察型" : "発言型",
    },
    {
      title: "事実 / 推理",
      dominant: typeData.axis.axis2,
      other: typeData.axis.axis2 === "事実重視" ? "推理重視" : "事実重視",
    },
    {
      title: "論理 / 感情",
      dominant: typeData.axis.axis3,
      other: typeData.axis.axis3 === "論理派" ? "感情派" : "論理派",
    },
    {
      title: "計画 / 即興",
      dominant: typeData.axis.axis4,
      other: typeData.axis.axis4 === "計画型" ? "即興型" : "計画型",
    },
  ];

  return (
    <main id="main-content" className="page-shell py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(getTypePageJsonLd(typeData)),
        }}
      />

      <div className="flex flex-col gap-5">
        <section className="surface-panel flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="eyebrow">Public Type Page</p>
              <h1 className="section-title">
                {typeData.typeName}
                <span className="ml-2 text-base text-[color:var(--color-text-subtle)]">
                  {typeData.typeCode}
                </span>
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm text-[color:var(--color-accent)] underline-offset-4 hover:underline"
            >
              トップへ戻る
            </Link>
          </div>

          <TypeArtwork
            typeCode={typeData.typeCode}
            typeName={typeData.typeName}
            palette={typeData.visualProfile.colorPalette}
            priority
          />

          <div className="flex flex-col gap-3">
            <p className="font-display text-3xl leading-tight">{typeData.tagline}</p>
            <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className="primary-button justify-center">
              診断を始める
            </Link>
            <a
              href={publicUrl}
              className="secondary-button justify-center"
              target="_blank"
              rel="noreferrer"
            >
              このページを共有する
            </a>
          </div>
        </section>

        <section className="surface-panel flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Type Signature</p>
            <h2 className="section-title">このタイプの軸構成</h2>
            <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
              公開ページではタイプの構成だけを見せています。実際の回答バランスは診断後の共有ページで確認できます。
            </p>
          </div>

          <div className="grid gap-3">
            {axisRows.map((row) => (
              <div
                key={row.title}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[color:var(--color-line)] bg-white/70 p-4"
              >
                <p className="text-sm font-semibold text-[color:var(--color-text-subtle)]">
                  {row.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-sm font-semibold text-[color:var(--color-accent)]">
                    {row.dominant}
                  </span>
                  <span className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-sm text-[color:var(--color-text-subtle)]">
                    {row.other}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <section className="surface-panel flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Strengths</p>
              <h2 className="section-title">強み</h2>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </section>

          <section className="surface-panel flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Cautions</p>
              <h2 className="section-title">注意したい点</h2>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </section>
        </section>

        <section className="surface-panel flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Overview</p>
            <h2 className="section-title">詳しい見立て</h2>
          </div>
          <p className="text-sm leading-8 text-[color:var(--color-text-subtle)]">
            {typeData.detailDescription}
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <section className="surface-panel flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Playstyle</p>
              <h2 className="section-title">向いている立ち回り</h2>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.recommendedPlaystyle.map((playstyle) => (
                <li key={playstyle}>{playstyle}</li>
              ))}
            </ul>
          </section>

          <section className="surface-panel flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Roles</p>
              <h2 className="section-title">向いている役回り</h2>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.suitableRoles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </section>
        </section>

        <section className="surface-panel flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Compatibility</p>
            <h2 className="section-title">相性の傾向</h2>
          </div>
          <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
            {typeData.compatibility.summary}
          </p>
          {typeData.compatibility.goodWithTypeCodes?.length ? (
            <div className="flex flex-wrap gap-2">
              {typeData.compatibility.goodWithTypeCodes.map((code) => (
                <Link
                  key={code}
                  href={`/types/${code}`}
                  className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-sm text-[color:var(--color-accent)]"
                >
                  {code}
                </Link>
              ))}
            </div>
          ) : null}
          {typeData.compatibility.goodWithDescription ? (
            <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.compatibility.goodWithDescription}
            </p>
          ) : null}
        </section>

        <ShareActions
          typeCode={typeData.typeCode}
          typeName={typeData.typeName}
          shareText={typeData.shareText}
          shareUrl={publicUrl}
        />
      </div>
    </main>
  );
}
