import type { TypeData } from "@/lib/types";

import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import {
  SURVEY_TRENDS_CONTENT,
  type SurveyTrendCompactType,
  type SurveyTrendFeaturedType,
} from "@/lib/trends-article";

import styles from "./trends-page.module.css";

type TrendsPageProps = {
  allTypes: TypeData[];
};

type TypeTrendEntry = SurveyTrendFeaturedType | SurveyTrendCompactType;

function buildTypeMap(allTypes: TypeData[]) {
  return new Map(allTypes.map((type) => [type.typeCode, type]));
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
    <article className={styles.typeSection}>
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
          <h3 className={styles.typeTitle}>
            {type.typeName}
            <span>{type.typeCode}</span>
          </h3>
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

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topLinkRow}>
          <Link href="/" prefetch={false} className={styles.backLink}>
            トップへ戻る
          </Link>
        </div>

        <article className={styles.article}>
          <header className={styles.hero}>
            <p className={styles.meta}>アンケート傾向まとめ</p>
            <h1 className={styles.title}>アンケートから見えたマダミス傾向</h1>
            <p className={styles.lead}>{SURVEY_TRENDS_CONTENT.hero.lead}</p>
            <p className={styles.note}>{SURVEY_TRENDS_CONTENT.hero.caution}</p>
          </header>

          <section className={styles.section}>
            <h2 className={styles.heading}>全体の傾向</h2>
            <div className={styles.sectionContent}>
              <p>
                今回の回答は
                {SURVEY_TRENDS_CONTENT.responseCount}
                件でした。特に多かったのは
                {SURVEY_TRENDS_CONTENT.dominantTypes
                  .map(({ typeCode, count }) => `${typeCode}（${count}件）`)
                  .join("、")}
                です。
              </p>
              <p>
                その次に多かったのは
                {SURVEY_TRENDS_CONTENT.supportingTypeCodes.join("、")}
                あたりでした。全体としては、次のような遊び方の方向に協力者が集まっていた印象です。
              </p>
              <ul className={styles.bulletList}>
                {SURVEY_TRENDS_CONTENT.overallSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section}>
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

          <section className={styles.section}>
            <h2 className={styles.heading}>タイプ別・よく薦められていた作品</h2>
            <div className={styles.sectionContent}>
              <p>ここからは、タイプごとに目立っていた作品をまとめています。</p>
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

          <section className={styles.section}>
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
            <Link href="/diagnosis" prefetch={false} className="primary-button">
              診断する
            </Link>
            <Link href="/" prefetch={false} className="secondary-button">
              トップページへ戻る
            </Link>
          </div>
        </article>

        <SiteFooter className={styles.footer} />
      </div>
    </main>
  );
}
