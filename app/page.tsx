import type { Metadata } from "next";
import {
  Bebas_Neue,
  Caveat,
  Noto_Serif_JP,
  Special_Elite,
} from "next/font/google";
import Link from "next/link";

import { StartDiagnosisForm } from "@/components/start-diagnosis-form";
import { TypeArtwork } from "@/components/type-artwork";
import { getAllTypes, getQuestionMaster } from "@/lib/data";
import { stringifyJsonLd, getWebsiteJsonLd } from "@/lib/json-ld";
import { LINE_STAMP_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";

import styles from "./page.module.css";

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

const FEATURE_SUMMARIES = [
  {
    number: "01",
    title: "卓での主導の仕方",
    copy: "前に出て流れを作るか、静かに観察して拾うかを解析",
  },
  {
    number: "02",
    title: "事実と推理の寄り方",
    copy: "証拠を固める型か、裏筋を読む型かを整理",
  },
  {
    number: "03",
    title: "結果ページと共有",
    copy: "強み・注意点・相性・向いている役回りまで一気に",
  },
] as const;

const FEATURED_TYPE_CODES = new Set(["TFLP", "TRLP", "OREI", "OFEP"]);

export const metadata: Metadata = {
  title: "トップ",
  description: SITE_DESCRIPTION,
};

export default async function HomePage() {
  const [allTypes, questionMaster] = await Promise.all([
    getAllTypes(),
    getQuestionMaster(),
  ]);

  const featuredTypes = allTypes.filter((type) =>
    FEATURED_TYPE_CODES.has(type.typeCode),
  );
  const spotlightTypes =
    featuredTypes.length > 0 ? featuredTypes : allTypes.slice(0, 4);
  const heroType =
    allTypes.find((type) => type.typeCode === "TFLP") ??
    spotlightTypes[0] ??
    null;

  if (!heroType) {
    return (
      <main id="main-content" className="page-shell py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyJsonLd(getWebsiteJsonLd()),
          }}
        />
        <section className="surface-panel flex flex-col gap-3">
          <p className="eyebrow">Home</p>
          <h1 className="section-title">タイプデータを読み込めませんでした。</h1>
          <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
            データ配置を確認してから、もう一度アクセスしてください。
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className={`${displayFont.variable} ${typewriterFont.variable} ${serifFont.variable} ${noteFont.variable} ${styles.home}`}
    >
      <div aria-hidden="true" className={styles.backdrop} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(getWebsiteJsonLd()) }}
      />

      <div className={styles.shell}>
        <header className={styles.masthead}>
          <div>
            <div className={styles.mastheadLogo}>Romantic Case File</div>
            <div className={styles.mastheadSub}>
              Murder Mystery Personality Diagnosis
            </div>
          </div>
          <nav aria-label="メインナビ">
            <ul className={styles.mastheadNav}>
              <li>
                <a href="#types">Types</a>
              </li>
              <li>
                <Link href="/types">All 16</Link>
              </li>
            </ul>
          </nav>
        </header>

        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.caseEnvelope}>
            <span className={styles.stampConfidential}>Confidential</span>

            <p className={styles.fileMeta}>
              Case File #RCF-2025 / Murder Mystery Behavioral Analysis
            </p>

            <h1 id="hero-heading" className={styles.caseTitle}>
              <em>あなたの</em>
              <br />
              {SITE_TAGLINE}
            </h1>

            <p className={styles.handnote}>- 卓上での立ち回りを解析せよ</p>

            <p className={styles.caseBody}>
              32問の答えから、マーダーミステリー卓での発言・推理・感情・進め方のクセを
              4軸で見立てます。一般的な性格診断ではなく、卓上での立ち回りに特化した
              16タイプ診断です。
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statBadge}>
                <strong>{questionMaster.meta.questionCount}</strong>
                Questions
              </div>
              <div className={styles.statBadge}>
                <strong>{questionMaster.meta.pageCount}</strong>
                Pages
              </div>
              <div className={styles.statBadge}>
                <strong>16</strong>
                Types
              </div>
              <div className={styles.statBadge}>
                <strong>4</strong>
                Axes
              </div>
            </div>

            <a href="#start" className={styles.ctaPrimary}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              診断を始める
            </a>

            <div className={styles.features}>
              {FEATURE_SUMMARIES.map((feature) => (
                <div key={feature.number} className={styles.featureItem}>
                  <span className={styles.featureNum}>{feature.number}</span>
                  <h2 className={styles.featureTitle}>{feature.title}</h2>
                  <p className={styles.featureCopy}>{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.photoCard}>
              <TypeArtwork
                typeCode={heroType.typeCode}
                typeName={heroType.typeName}
                palette={heroType.visualProfile.colorPalette}
                priority
                className={styles.heroArtwork}
              />

              <p className={styles.cardTypeCode}>
                Preview Type / {heroType.typeCode}
              </p>
              <p className={styles.cardTypeName}>{heroType.typeName}</p>
              <p className={styles.cardTagline}>{heroType.tagline}</p>
              <p className={styles.cardSummary}>{heroType.summary}</p>
              <Link
                href={`/types/${heroType.typeCode}`}
                className={styles.cardLink}
              >
                ファイルを開く →
              </Link>
            </div>

            <div className={styles.lineCard}>
              <p className={styles.lineLabel}>Line Stickers</p>
              <p className={styles.lineTitle}>LINEスタンプ展開予定</p>
              {LINE_STAMP_URL ? (
                <a
                  href={LINE_STAMP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.lineBtn}
                >
                  LINEスタンプを見る
                </a>
              ) : (
                <span className={`${styles.lineBtn} ${styles.lineBtnDisabled}`}>
                  準備中
                </span>
              )}
            </div>
          </aside>

          <div id="start" className={styles.formZone}>
            <div>
              <p className={styles.formLabel}>Start Diagnosis</p>
              <p className={styles.formSub}>診断スタート / 所要時間 約5分</p>
            </div>
            <div className={styles.formSlot}>
              <StartDiagnosisForm />
            </div>
          </div>
        </section>

        <section id="types" aria-labelledby="featured-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Featured</span>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              人気になりやすい4タイプ
            </h2>
          </div>
          <p className={styles.sectionCopy}>
            16タイプすべてに固有の名称とキャッチコピーがあります。まずは代表的な4タイプから世界観をご覧ください。
          </p>

          <div className={styles.featuredGrid}>
            {spotlightTypes.map((type) => (
              <Link
                key={type.typeCode}
                href={`/types/${type.typeCode}`}
                className={styles.typeCard}
              >
                <div
                  className={styles.typeCardVisual}
                  data-code={type.typeCode}
                  aria-hidden="true"
                >
                  <TypeArtwork
                    typeCode={type.typeCode}
                    typeName={type.typeName}
                    palette={type.visualProfile.colorPalette}
                    className={styles.typeArtwork}
                  />
                </div>

                <div className={styles.typeCardBody}>
                  <p className={styles.typeCardCode}>{type.typeCode}</p>
                  <h3 className={styles.typeCardName}>{type.typeName}</h3>
                  <p className={styles.typeCardTagline}>{type.tagline}</p>
                  <p className={styles.typeCardArrow}>
                    <span>Open file</span>
                    <span>→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.allTypes} aria-labelledby="all-types-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Index</span>
            <h2 id="all-types-heading" className={styles.sectionTitle}>
              16タイプ一覧
            </h2>
          </div>

          <div className={styles.typeChipGrid}>
            {allTypes.map((type) => (
              <Link
                key={type.typeCode}
                href={`/types/${type.typeCode}`}
                className={styles.typeChip}
              >
                <span className={styles.typeChipCode}>{type.typeCode}</span>
                <span className={styles.typeChipName}>{type.typeName}</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.footerCopy}>
            © Romantic Case File / Murder Mystery Behavioral Analysis System
          </p>
          <p className={styles.footerCopy}>
            Powered by 4-Axis Personality Framework
          </p>
        </footer>
      </div>
    </main>
  );
}
