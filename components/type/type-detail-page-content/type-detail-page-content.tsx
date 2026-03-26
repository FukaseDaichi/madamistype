import type { AxisSummary, TypeData } from "@/lib/types";

import {
  Bebas_Neue,
  Caveat,
  Noto_Serif_JP,
  Special_Elite,
} from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import { ShareActions } from "@/components/type/share-actions/share-actions";
import { getTypePageJsonLd, stringifyJsonLd } from "@/lib/json-ld";
import { TypeCompatibilitySection } from "@/components/type/type-detail-page-content/type-compatibility-section";
import { TypeDetailHeroSection } from "@/components/type/type-detail-page-content/type-detail-hero-section";
import { TypeListSection } from "@/components/type/type-detail-page-content/type-list-section";
import { TypeOverviewSection } from "@/components/type/type-detail-page-content/type-overview-section";
import { TypeSignatureSection } from "@/components/type/type-detail-page-content/type-signature-section";

import styles from "./type-detail-page-content.module.css";

const displayFont = Bebas_Neue({
  variable: "--rcf-font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const typewriterFont = Special_Elite({
  variable: "--rcf-font-typewriter",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const serifFont = Noto_Serif_JP({
  variable: "--rcf-font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const noteFont = Caveat({
  variable: "--rcf-font-note",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

type TypeDetailPageContentProps = {
  mode: "public" | "shared";
  typeData: TypeData;
  shareUrl: string;
  publicUrl: string;
  sharedUserName?: string;
  hasChibi?: boolean;
  axisSummaries?: AxisSummary[];
  compatibleTypes?: Array<{ typeCode: string; typeName: string }>;
};

export function TypeDetailPageContent({
  mode,
  typeData,
  shareUrl,
  publicUrl,
  sharedUserName,
  hasChibi = false,
  axisSummaries,
  compatibleTypes,
}: TypeDetailPageContentProps) {
  const isShared = mode === "shared";
  const shareDescription = isShared
    ? "共有リンクとしてそのまま送れます。個人名や回答パラメーターは表示しません。"
    : "X、LINE、OSの共有シートからそのまま送れます。";

  return (
    <main
      id="main-content"
      className={`${displayFont.variable} ${typewriterFont.variable} ${serifFont.variable} ${noteFont.variable} ${styles.page}`}
    >
      <div aria-hidden="true" className={styles.backdrop} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(getTypePageJsonLd(typeData)),
        }}
      />

      <div className={styles.shell}>
        <TypeDetailHeroSection
          mode={mode}
          typeData={typeData}
          publicUrl={publicUrl}
          sharedUserName={sharedUserName}
          hasChibi={hasChibi}
        />
        <TypeSignatureSection
          typeData={typeData}
          axisSummaries={axisSummaries}
        />

        <div className={styles.twoCol}>
          <TypeListSection
            eyebrow="Strengths"
            title="強み"
            headingId="strengths-heading"
            items={typeData.strengths}
          />
          <TypeListSection
            eyebrow="Cautions"
            title="注意したい点"
            headingId="cautions-heading"
            items={typeData.cautions}
          />
        </div>

        <TypeOverviewSection detailDescription={typeData.detailDescription} />

        <div className={styles.twoCol}>
          <TypeListSection
            eyebrow="Playstyle"
            title="向いている立ち回り"
            headingId="playstyle-heading"
            items={typeData.recommendedPlaystyle}
          />
          <TypeListSection
            eyebrow="Roles"
            title="向いている役回り"
            headingId="roles-heading"
            items={typeData.suitableRoles}
          />
        </div>

        <TypeCompatibilitySection
          compatibility={typeData.compatibility}
          compatibleTypes={compatibleTypes}
        />

        <ShareActions
          id="type-share-panel"
          typeCode={typeData.typeCode}
          typeName={typeData.typeName}
          shareText={typeData.shareText}
          shareUrl={shareUrl}
          eyebrow="Share"
          title={isShared ? "この共有URLを送る" : "このページを共有する"}
          description={shareDescription}
          className={styles.sharePanel}
        />

        <SiteFooter className={styles.footer} />
      </div>
    </main>
  );
}
