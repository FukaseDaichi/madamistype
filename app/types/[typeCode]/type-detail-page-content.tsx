import type { TypeData } from "@/lib/types";

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

type TypeDetailPageContentProps = {
  mode: "public" | "shared";
  typeData: TypeData;
  shareUrl: string;
  publicUrl: string;
  hasChibi?: boolean;
};

export function TypeDetailPageContent({
  mode,
  typeData,
  shareUrl,
  publicUrl,
  hasChibi = false,
}: TypeDetailPageContentProps) {
  const isShared = mode === "shared";
  const axisRows = [
    {
      title: "発言 / 観察",
      dominant: typeData.axis.axis1,
      other: typeData.axis.axis1 === "発言型" ? "観察型" : "発言型",
      meaning:
        "卓で情報を取りにいくときに、まず会話を動かす側か、まず周囲を見て拾う側かを表す軸です。",
      tendencyLabel: `${typeData.axis.axis1}の傾向`,
      tendency:
        typeData.axis.axis1 === "発言型"
          ? "問いかけや話題整理で場を前に進めやすく、沈黙を破って議論の起点になりやすい傾向があります。"
          : "表情や言葉のズレを拾いながら状況を見極め、確度が上がったところで効く一言を出しやすい傾向があります。",
    },
    {
      title: "事実 / 推理",
      dominant: typeData.axis.axis2,
      other: typeData.axis.axis2 === "事実重視" ? "推理重視" : "事実重視",
      meaning:
        "証拠や発言の整合性を重く見るか、背景や意図まで含めて可能性を読むかを表す軸です。",
      tendencyLabel: `${typeData.axis.axis2}の傾向`,
      tendency:
        typeData.axis.axis2 === "事実重視"
          ? "証拠、時系列、発言の矛盾を足場にして、確かな情報から盤面を固める傾向があります。"
          : "表に出た情報だけでなく、動機や裏の意図まで広く読み、複数の筋を並行して考える傾向があります。",
    },
    {
      title: "論理 / 感情",
      dominant: typeData.axis.axis3,
      other: typeData.axis.axis3 === "論理派" ? "感情派" : "論理派",
      meaning:
        "筋道や合理性を優先するか、人間関係や気持ちの流れから盤面を読むかを表す軸です。",
      tendencyLabel: `${typeData.axis.axis3}の傾向`,
      tendency:
        typeData.axis.axis3 === "論理派"
          ? "主張のつながりや説明の一貫性を大切にし、納得できる筋道があるかで判断しやすい傾向があります。"
          : "言葉の温度や関係性の揺れに注目し、その人がなぜそう動いたかを感情の流れから捉えやすい傾向があります。",
    },
    {
      title: "計画 / 即興",
      dominant: typeData.axis.axis4,
      other: typeData.axis.axis4 === "計画型" ? "即興型" : "計画型",
      meaning:
        "発言順や進行を整理して進めるか、その場の流れに合わせて柔軟に動くかを表す軸です。",
      tendencyLabel: `${typeData.axis.axis4}の傾向`,
      tendency:
        typeData.axis.axis4 === "計画型"
          ? "話す順番や確認ポイントを整えながら進めやすく、卓全体の進行を安定させやすい傾向があります。"
          : "その場の反応や空気の変化を見て動き方を変えやすく、局面に応じて自然に立ち回りを切り替える傾向があります。",
    },
  ];

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
  const signatureDescription = `${typeData.typeName}は「${axisRows
    .map((row) => row.dominant)
    .join(
      "・",
    )}」が前に出やすいタイプです。卓で何を手がかりに動きやすいかを、4つの軸で読み解けます。`;
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
              このタイプの軸構成
            </h2>
            <p className={`${styles.detailText} ${styles.signatureIntro}`}>
              {signatureDescription}
            </p>
          </div>

          <div className={styles.signatureSnapshot}>
            <p className={styles.signatureSnapshotLabel}>
              このタイプで目立ちやすい傾向
            </p>
            <div className={styles.signatureSnapshotPills}>
              {axisRows.map((row) => (
                <span
                  key={`${row.title}-${row.dominant}`}
                  className={styles.signatureSnapshotPill}
                >
                  {row.dominant}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.signatureGrid}>
            {axisRows.map((row) => (
              <article key={row.title} className={styles.signatureCard}>
                <div className={styles.signatureCardHeader}>
                  <div className={styles.signatureCardHeading}>
                    <p className={styles.signatureLabel}>{row.title}</p>
                    <h3 className={styles.signatureCardTitle}>
                      {row.dominant}
                    </h3>
                  </div>
                  <span className={styles.signatureTrendBadge}>優勢</span>
                </div>

                <div className={styles.signaturePills}>
                  <span className={styles.signatureDominant}>
                    {row.dominant}
                  </span>
                  <span className={styles.signatureOther}>{row.other}</span>
                </div>

                <div className={styles.signatureBody}>
                  <div className={styles.signatureBlock}>
                    <p className={styles.signatureBlockLabel}>
                      この軸が表すこと
                    </p>
                    <p className={styles.signatureBlockText}>{row.meaning}</p>
                  </div>

                  <div className={styles.signatureBlock}>
                    <p className={styles.signatureBlockLabel}>
                      {row.tendencyLabel}
                    </p>
                    <p className={styles.signatureBlockText}>{row.tendency}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
