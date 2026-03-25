import type { AxisSummary, TypeData } from "@/lib/types";

import Image from "next/image";
import {
  Bebas_Neue,
  Caveat,
  Noto_Serif_JP,
  Special_Elite,
} from "next/font/google";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { ShareActions } from "@/components/share-actions";
import { TypeArtwork } from "@/components/type-artwork";
import { stringifyJsonLd, getTypePageJsonLd } from "@/lib/json-ld";

import styles from "./[key]/page.module.css";

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

/** Maps each axis label to its English keyword and single-letter code. */
const AXIS_LETTER_MAP: Record<
  string,
  { letter: string; english: string }
> = {
  "発言型": { letter: "T", english: "Talk" },
  "観察型": { letter: "O", english: "Observe" },
  "事実重視": { letter: "F", english: "Fact" },
  "推理重視": { letter: "R", english: "Reasoning" },
  "論理派": { letter: "L", english: "Logic" },
  "感情派": { letter: "E", english: "Emotion" },
  "計画型": { letter: "P", english: "Plan" },
  "即興型": { letter: "I", english: "Improvise" },
};

type TypeDetailPageContentProps = {
  mode: "public" | "shared";
  typeData: TypeData;
  shareUrl: string;
  publicUrl: string;
  hasChibi?: boolean;
  axisSummaries?: AxisSummary[];
};

export function TypeDetailPageContent({
  mode,
  typeData,
  shareUrl,
  publicUrl,
  hasChibi = false,
  axisSummaries,
}: TypeDetailPageContentProps) {
  const isShared = mode === "shared";
  const axisRows = [
    {
      dominant: typeData.axis.axis1,
      other: typeData.axis.axis1 === "発言型" ? "観察型" : "発言型",
    },
    {
      dominant: typeData.axis.axis2,
      other: typeData.axis.axis2 === "事実重視" ? "推理重視" : "事実重視",
    },
    {
      dominant: typeData.axis.axis3,
      other: typeData.axis.axis3 === "論理派" ? "感情派" : "論理派",
    },
    {
      dominant: typeData.axis.axis4,
      other: typeData.axis.axis4 === "計画型" ? "即興型" : "計画型",
    },
  ];

  // Map axisSummaries by axis code for lookup (A1..A4)
  const summaryByIndex = axisSummaries
    ? Object.fromEntries(axisSummaries.map((s, i) => [i, s]))
    : null;

  const heroHeading = isShared ? (
    <>
      共有された
      <br />
      タイプ結果
    </>
  ) : (
    <>
      {typeData.typeName}
      <br />
      タイプ詳細
    </>
  );

  const heroNote = "Image File";
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
        <header className={styles.mast}>
          <Link href="/" className={styles.mastLogo}>
            Murder Mystery Types
          </Link>
          <Link href={isShared ? publicUrl : "/"} className={styles.mastBack}>
            {"<-"} {isShared ? "タイプ公開ページへ" : "トップへ戻る"}
          </Link>
        </header>

        <section
          className={styles.suspectCard}
          aria-labelledby="result-heading"
        >
          <span className={styles.stamp}>
            {isShared ? "Shared URL" : "Public File"}
          </span>

          <p className={styles.fileMeta}>Case File #{typeData.typeCode}</p>

          <h1 id="result-heading" className={styles.suspectName}>
            {heroHeading}
          </h1>

          <p className={styles.sharedNote}>- {heroNote}</p>

          <div className={styles.heroCols}>
            <div className={styles.artworkFrame}>
              <div className={styles.artworkInner}>
                <TypeArtwork
                  typeCode={typeData.typeCode}
                  typeName={typeData.typeName}
                  palette={typeData.visualProfile.colorPalette}
                  priority
                  className={styles.heroArtwork}
                />
              </div>
            </div>

            <div className={styles.typeInfo}>
              <p className={styles.typeCode}>{typeData.typeCode}</p>
              <div className={styles.typeNameRow}>
                <p className={styles.typeName}>{typeData.typeName}</p>
                {hasChibi ? (
                  <div className={styles.chibiHero} aria-hidden="true">
                    <div className={styles.chibiHeroFrame}>
                      <Image
                        src={`/types/${typeData.typeCode}_chibi.png`}
                        alt=""
                        width={100}
                        height={100}
                        className={styles.chibiHeroImage}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <p className={styles.typeTagline}>「{typeData.tagline}」</p>
              <p className={styles.typeSummary}>{typeData.summary}</p>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link href="/" className={styles.primaryButton}>
              自分でも診断する
            </Link>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.signatureSection}`}
          aria-labelledby="signature-heading"
        >
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionEyebrow}>Type Signature</span>
            <h2 id="signature-heading" className={styles.sectionTitle}>
              タイプコードの読み方
            </h2>
          </div>

          <div className={styles.sigCodeDisplay}>
            {axisRows.map((row, i) => {
              const dom = AXIS_LETTER_MAP[row.dominant];
              const oth = AXIS_LETTER_MAP[row.other];
              const summary = summaryByIndex ? summaryByIndex[i] : null;
              const isDominantPositive = summary
                ? summary.positiveLabel === row.dominant
                : null;
              const dominantPercent = summary
                ? isDominantPositive
                  ? summary.positivePercent
                  : summary.negativePercent
                : null;
              const otherPercent = summary
                ? isDominantPositive
                  ? summary.negativePercent
                  : summary.positivePercent
                : null;

              return (
                <div key={row.dominant} className={styles.sigAxisRow}>
                  <div className={styles.sigSide}>
                    <span className={`${styles.sigLetter} ${styles.sigLetterDominant}`}>
                      {dom?.letter}
                    </span>
                    <span className={styles.sigEnglish}>{dom?.english}</span>
                    <span className={styles.sigLabel}>{row.dominant}</span>
                    {dominantPercent !== null ? (
                      <span className={styles.sigPercent}>{dominantPercent}%</span>
                    ) : null}
                  </div>

                  <div className={styles.sigBarWrap}>
                    {summary ? (
                      <div className={styles.sigBar} aria-hidden="true">
                        <div
                          className={styles.sigBarFillLeft}
                          style={{ width: `${dominantPercent}%` }}
                        />
                      </div>
                    ) : (
                      <div className={styles.sigBarStatic} aria-hidden="true">
                        <div className={styles.sigBarFillLeft} style={{ width: "100%" }} />
                      </div>
                    )}
                  </div>

                  <div className={`${styles.sigSide} ${styles.sigSideRight}`}>
                    {otherPercent !== null ? (
                      <span className={styles.sigPercent}>{otherPercent}%</span>
                    ) : null}
                    <span className={styles.sigLabelSub}>{row.other}</span>
                    <span className={styles.sigEnglishSub}>{oth?.english}</span>
                    <span className={styles.sigLetterSub}>
                      {oth?.letter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={styles.sigCaption}>
            {typeData.typeCode} = {axisRows.map((r) => AXIS_LETTER_MAP[r.dominant]?.english).join(" + ")}
          </p>
        </section>

        <div className={styles.twoCol}>
          <section
            className={styles.section}
            aria-labelledby="strengths-heading"
          >
            <span className={styles.sectionEyebrow}>Strengths</span>
            <h2 id="strengths-heading" className={styles.sectionTitle}>
              強み
            </h2>
            <ul className={styles.list}>
              {typeData.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            aria-labelledby="cautions-heading"
          >
            <span className={styles.sectionEyebrow}>Cautions</span>
            <h2 id="cautions-heading" className={styles.sectionTitle}>
              注意したい点
            </h2>
            <ul className={styles.list}>
              {typeData.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.section} aria-labelledby="overview-heading">
          <span className={styles.sectionEyebrow}>Overview</span>
          <h2 id="overview-heading" className={styles.sectionTitle}>
            詳しい見立て
          </h2>
          <p className={styles.detailText}>{typeData.detailDescription}</p>
        </section>

        <div className={styles.twoCol}>
          <section
            className={styles.section}
            aria-labelledby="playstyle-heading"
          >
            <span className={styles.sectionEyebrow}>Playstyle</span>
            <h2 id="playstyle-heading" className={styles.sectionTitle}>
              向いている立ち回り
            </h2>
            <ul className={styles.list}>
              {typeData.recommendedPlaystyle.map((playstyle) => (
                <li key={playstyle}>{playstyle}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="roles-heading">
            <span className={styles.sectionEyebrow}>Roles</span>
            <h2 id="roles-heading" className={styles.sectionTitle}>
              向いている役回り
            </h2>
            <ul className={styles.list}>
              {typeData.suitableRoles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.section} aria-labelledby="compat-heading">
          <span className={styles.sectionEyebrow}>Compatibility</span>
          <h2 id="compat-heading" className={styles.sectionTitle}>
            相性の傾向
          </h2>
          <p className={styles.compatText}>{typeData.compatibility.summary}</p>
          {typeData.compatibility.goodWithTypeCodes?.length ? (
            <div className={styles.compatLinks}>
              {typeData.compatibility.goodWithTypeCodes.map((code) => (
                <Link
                  key={code}
                  href={`/types/${code}`}
                  className={styles.compatLink}
                >
                  {code}
                </Link>
              ))}
            </div>
          ) : null}
          {typeData.compatibility.goodWithDescription ? (
            <p className={styles.compatText}>
              {typeData.compatibility.goodWithDescription}
            </p>
          ) : null}
        </section>

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
