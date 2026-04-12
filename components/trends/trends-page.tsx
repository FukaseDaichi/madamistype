import type { TypeData } from "@/lib/types";
import {
  Bebas_Neue,
  Caveat,
  Noto_Serif_JP,
  Special_Elite,
} from "next/font/google";

import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import {
  SURVEY_TRENDS_CONTENT,
  type SurveyTrendCompactType,
  type SurveyTrendFeaturedType,
} from "@/lib/trends-article";

import styles from "./trends-page.module.css";

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

type TrendsPageProps = {
  allTypes: TypeData[];
};

type TypeTrendEntry = SurveyTrendFeaturedType | SurveyTrendCompactType;

function buildTypeMap(allTypes: TypeData[]) {
  return new Map(allTypes.map((type) => [type.typeCode, type]));
}

function formatTypeLabel(type: TypeData) {
  return `${type.typeName}（${type.typeCode}）`;
}

function TypeTrendSection({
  type,
  entry,
}: {
  type: TypeData;
  entry: TypeTrendEntry;
}) {
  const lead = "lead" in entry ? entry.lead : null;
  const body = "summary" in entry ? entry.summary : entry.insight;

  return (
    <article id={`type-${type.typeCode}`} className={styles.typeSection}>
      <div className={styles.typeHeader}>
        <div className={styles.typeAvatar}>
          <Image
            src={`/types/${type.typeCode}_chibi.png`}
            alt=""
            width={72}
            height={72}
            className={styles.typeAvatarImage}
          />
        </div>
        <div>
          <h3 className={styles.typeTitle}>{formatTypeLabel(type)}</h3>
          <p className={styles.typeTagline}>「{type.tagline}」</p>
        </div>
      </div>

      <div className={styles.sectionContent}>
        {lead ? <p>{lead}</p> : null}
        <p>{body}</p>
        <p className={styles.entryLabel}>代表的なおすすめ</p>
        <ul className={styles.bulletList}>
          {entry.recommendations.map((work) => (
            <li key={work}>{work}</li>
          ))}
        </ul>
        <p>
          <Link
            href={`/types/${type.typeCode}`}
            prefetch={false}
            className={styles.inlineLink}
          >
            このタイプの詳細を見る
          </Link>
        </p>
      </div>
    </article>
  );
}

export function TrendsPage({ allTypes }: TrendsPageProps) {
  const typeMap = buildTypeMap(allTypes);
  const surveyPeriodLabel = SURVEY_TRENDS_CONTENT.surveyPeriod.rangeLabel;
  const releaseDateLabel = SURVEY_TRENDS_CONTENT.surveyPeriod.releaseDateLabel;
  const dominantTypeLabels = SURVEY_TRENDS_CONTENT.dominantTypes
    .map(({ typeCode, count }) => {
      const type = typeMap.get(typeCode);
      return type
        ? `${formatTypeLabel(type)} が ${count}件`
        : `${typeCode} が ${count}件`;
    })
    .join("、");
  const supportingTypeLabels = SURVEY_TRENDS_CONTENT.supportingTypeCodes
    .map((typeCode) => {
      const type = typeMap.get(typeCode);
      return type ? formatTypeLabel(type) : typeCode;
    })
    .join("、");

  return (
    <main
      id="main-content"
      className={`${displayFont.variable} ${typewriterFont.variable} ${serifFont.variable} ${noteFont.variable} ${styles.page}`}
    >
      <div aria-hidden="true" className={styles.backdrop} />

      <div className={styles.shell}>
        <header className={styles.masthead}>
          <div>
            <Link href="/" prefetch={false} className={styles.mastheadLogo}>
              マダミスタイプ診断
            </Link>
          </div>

          <nav aria-label="傾向ページナビゲーション">
            <ul className={styles.mastheadNav}>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#type-trends">Type Trends</a>
              </li>
              <li>
                <a href="#feedback">Feedback</a>
              </li>
            </ul>
          </nav>
        </header>

        <article className={styles.caseFile}>
          <span className={styles.stamp}>Survey Report</span>

          <p className={styles.fileMeta}>
            Released {releaseDateLabel} / Collected {surveyPeriodLabel}
          </p>

          <h1 className={styles.caseTitle}>
            <em>アンケートから見た</em>
            <br />
            マダミス傾向
          </h1>

          <p className={styles.handnote}>
            - よく薦められた作品とタイプ分布の記録
          </p>

          <div className={styles.introBlock}>
            <p className={styles.caseBody}>{SURVEY_TRENDS_CONTENT.hero.lead}</p>
            <p className={styles.caseNote}>
              {SURVEY_TRENDS_CONTENT.hero.caution}
            </p>
          </div>

          <section id="overview" className={styles.section}>
            <p className={styles.sectionEyebrow}>Overview</p>
            <h2 className={styles.heading}>全体の傾向</h2>
            <div className={styles.sectionContent}>
              <p>
                {surveyPeriodLabel}
                に収集した回答は
                {SURVEY_TRENDS_CONTENT.responseCount}
                件でした。特に多かったのは
                {dominantTypeLabels}
                です。
              </p>
              <p>
                その次に多かったのは
                {supportingTypeLabels}
                あたりでした。全体としては、次のような遊び方の方向に協力者が集まっていた印象です。
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>Works</p>
            <h2 className={styles.heading}>全体でよく名前が挙がった作品</h2>
            <div className={styles.sectionContent}>
              <ol className={styles.numberList}>
                {SURVEY_TRENDS_CONTENT.overallWorks.map((work) => (
                  <li key={work}>{work}</li>
                ))}
              </ol>
              <p>{SURVEY_TRENDS_CONTENT.overallWorksNote}</p>
            </div>
          </section>

          <section id="type-trends" className={styles.section}>
            <p className={styles.sectionEyebrow}>Type Trends</p>
            <h2 className={styles.heading}>タイプ別・よく薦められていた作品</h2>
            <div className={styles.sectionContent}>
              <p>
                ここからは、
                {surveyPeriodLabel}
                の回答でタイプごとに目立っていた作品をまとめています。
              </p>
            </div>
            <div className={styles.typeSectionList}>
              {SURVEY_TRENDS_CONTENT.featuredTypes.map((entry) => {
                const type = typeMap.get(entry.typeCode);

                if (!type) {
                  return null;
                }

                return (
                  <TypeTrendSection
                    key={type.typeCode}
                    type={type}
                    entry={entry}
                  />
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>More Types</p>
            <h2 className={styles.heading}>そのほかのタイプ</h2>
            <div className={styles.typeSectionList}>
              {SURVEY_TRENDS_CONTENT.compactTypes.map((entry) => {
                const type = typeMap.get(entry.typeCode);

                if (!type) {
                  return null;
                }

                return (
                  <TypeTrendSection
                    key={type.typeCode}
                    type={type}
                    entry={entry}
                  />
                );
              })}
            </div>
          </section>

          <section id="feedback" className={styles.section}>
            <p className={styles.sectionEyebrow}>Feedback</p>
            <h2 className={styles.heading}>自由記述で多かった意見</h2>
            <div className={styles.sectionContent}>
              <p>
                作品の話とは別に、自由記述では設問の分かりやすさや診断の広がり方についても共通した声が見られました。
              </p>

              <h3 className={styles.subheading}>気になった点</h3>
              <ul className={styles.bulletList}>
                {SURVEY_TRENDS_CONTENT.feedback.concerns.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className={styles.subheading}>好意的な声</h3>
              <ul className={styles.bulletList}>
                {SURVEY_TRENDS_CONTENT.feedback.positives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className={styles.subheading}>今後の広がり</h3>
              <ul className={styles.bulletList}>
                {SURVEY_TRENDS_CONTENT.feedback.futureIdeas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>Summary</p>
            <h2 className={styles.heading}>まとめ</h2>
            <div className={styles.sectionContent}>
              <ul className={styles.bulletList}>
                {SURVEY_TRENDS_CONTENT.closingSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className={styles.actionRow}>
            <Link
              href="/diagnosis"
              prefetch={false}
              className={styles.primaryButton}
            >
              診断する
            </Link>
            <Link href="/" prefetch={false} className={styles.secondaryButton}>
              トップページへ戻る
            </Link>
          </div>
        </article>

        <SiteFooter className={styles.footer} />
      </div>
    </main>
  );
}
