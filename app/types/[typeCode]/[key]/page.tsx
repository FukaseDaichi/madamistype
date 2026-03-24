import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AxisBalanceBars } from "@/components/axis-balance-bars";
import { ShareActions } from "@/components/share-actions";
import { TypeArtwork } from "@/components/type-artwork";
import { calculateDiagnosisResult } from "@/lib/diagnosis";
import { getQuestionMaster, getTypeByCode } from "@/lib/data";
import { stringifyJsonLd, getTypePageJsonLd } from "@/lib/json-ld";
import { decodeShareKey } from "@/lib/share-key";
import { getAbsoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ typeCode: string; key: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { typeCode, key } = await params;
  const [typeData, questionMaster] = await Promise.all([
    getTypeByCode(typeCode),
    getQuestionMaster(),
  ]);
  const payload = decodeShareKey(key);

  if (!typeData || !payload) {
    notFound();
  }

  const result =
    payload.v === 2 ? calculateDiagnosisResult(questionMaster, payload.a) : null;

  if (result && result.typeCode !== typeCode) {
    notFound();
  }

  return {
    title: `${payload.n}さんの診断結果`,
    description: `${payload.n}さんは「${typeData.typeName}（${typeData.typeCode}）」タイプでした。`,
    alternates: {
      canonical: `/types/${typeData.typeCode}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${payload.n}さんの結果: ${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      url: `/types/${typeData.typeCode}/${key}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${payload.n}さんの結果: ${typeData.typeName}`,
      description: typeData.tagline,
      images: [`/types/${typeData.typeCode}/opengraph-image`],
    },
  };
}

export default async function SharedResultPage({ params }: PageProps) {
  const { typeCode, key } = await params;
  const [typeData, questionMaster] = await Promise.all([
    getTypeByCode(typeCode),
    getQuestionMaster(),
  ]);
  const payload = decodeShareKey(key);

  if (!typeData || !payload) {
    notFound();
  }

  const result =
    payload.v === 2 ? calculateDiagnosisResult(questionMaster, payload.a) : null;

  if (result && result.typeCode !== typeCode) {
    notFound();
  }

  const shareUrl = getAbsoluteUrl(`/types/${typeData.typeCode}/${key}`);
  const publicUrl = `/types/${typeData.typeCode}`;

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
              <p className="eyebrow">Shared Result</p>
              <h1 className="section-title">{payload.n}さんの診断結果</h1>
            </div>
            <Link
              href={publicUrl}
              className="text-sm text-[color:var(--color-accent)] underline-offset-4 hover:underline"
            >
              公開ページを見る
            </Link>
          </div>

          <TypeArtwork
            typeCode={typeData.typeCode}
            typeName={typeData.typeName}
            palette={typeData.visualProfile.colorPalette}
            priority
          />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">
              {typeData.typeCode}
            </p>
            <h2 className="font-display text-4xl leading-tight">
              {typeData.typeName}
            </h2>
            <p className="font-display text-2xl leading-tight">{typeData.tagline}</p>
            <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
              {typeData.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className="primary-button justify-center">
              自分でも診断する
            </Link>
            <Link href={publicUrl} className="secondary-button justify-center">
              タイプの固定詳細を見る
            </Link>
          </div>
        </section>

        {result ? (
          <AxisBalanceBars
            items={result.axisSummaries}
            description="共有URLに含まれた回答から、その人の寄り方を再計算しています。"
          />
        ) : (
          <section className="surface-panel flex flex-col gap-3">
            <p className="eyebrow">Axis</p>
            <h2 className="section-title">4軸バランスは省略されています</h2>
            <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
              この共有URLは名前のみを含む形式です。タイプの公開詳細ページとして閲覧できます。
            </p>
          </section>
        )}

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
          shareUrl={shareUrl}
        />
      </div>
    </main>
  );
}
