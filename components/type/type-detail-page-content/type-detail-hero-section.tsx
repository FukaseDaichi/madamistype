import type { TypeData } from "@/lib/types";

import Image from "next/image";
import Link from "next/link";

import { TypeArtwork } from "@/components/type/type-artwork/type-artwork";

import styles from "./type-detail-page-content.module.css";

type TypeDetailHeroSectionProps = {
  mode: "public" | "shared";
  typeData: TypeData;
  publicUrl: string;
  sharedUserName?: string;
  hasChibi?: boolean;
};

export function TypeDetailHeroSection({
  mode,
  typeData,
  publicUrl,
  sharedUserName,
  hasChibi = false,
}: TypeDetailHeroSectionProps) {
  const isShared = mode === "shared";
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

  return (
    <>
      <header className={styles.mast}>
        <Link href="/" className={styles.mastLogo}>
          Murder Mystery Types
        </Link>
        <Link href={isShared ? publicUrl : "/"} className={styles.mastBack}>
          {"<-"} {isShared ? "タイプ公開ページへ" : "トップへ戻る"}
        </Link>
      </header>

      <section className={styles.suspectCard} aria-labelledby="result-heading">
        <span className={styles.stamp}>
          {isShared ? "Shared URL" : "Public File"}
        </span>

        <p className={styles.fileMeta}>Case File #{typeData.typeCode}</p>

        <h1 id="result-heading" className={styles.suspectName}>
          {isShared && sharedUserName ? (
            <>
              <em>{sharedUserName}</em>さんの
              <br />
              診断結果
            </>
          ) : (
            heroHeading
          )}
        </h1>

        <p className={styles.sharedNote}>- Image File</p>

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
    </>
  );
}
