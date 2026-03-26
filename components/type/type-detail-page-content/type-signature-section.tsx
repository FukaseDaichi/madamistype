import type { AxisSummary, TypeData } from "@/lib/types";

import {
  TypeSectionFrame,
  type TypeSectionHeading,
} from "@/components/type/type-detail-page-content/type-section-frame";

import styles from "./type-detail-page-content.module.css";

const AXIS_LETTER_MAP: Record<string, { letter: string; english: string }> = {
  "発言型": { letter: "T", english: "Talk" },
  "観察型": { letter: "O", english: "Observe" },
  "事実重視": { letter: "F", english: "Fact" },
  "推理重視": { letter: "R", english: "Reasoning" },
  "論理派": { letter: "L", english: "Logic" },
  "感情派": { letter: "E", english: "Emotion" },
  "計画型": { letter: "P", english: "Plan" },
  "即興型": { letter: "I", english: "Improvise" },
};

type TypeSignatureSectionProps = {
  heading: TypeSectionHeading;
  typeData: TypeData;
  axisSummaries?: AxisSummary[];
};

export function TypeSignatureSection({
  heading,
  typeData,
  axisSummaries,
}: TypeSignatureSectionProps) {
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

  const summaryByIndex = axisSummaries
    ? (Object.fromEntries(
        axisSummaries.map((summary, index) => [index, summary]),
      ) as Record<number, AxisSummary>)
    : null;

  return (
    <TypeSectionFrame
      heading={heading}
      className={styles.signatureSection}
      headerAlign="center"
    >
      <div className={styles.sigCodeDisplay}>
        {axisRows.map((row, index) => {
          const dominantMeta = AXIS_LETTER_MAP[row.dominant];
          const otherMeta = AXIS_LETTER_MAP[row.other];
          const summary = summaryByIndex ? summaryByIndex[index] : null;
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
                <span
                  className={`${styles.sigLetter} ${styles.sigLetterDominant}`}
                >
                  {dominantMeta?.letter}
                </span>
                <span className={styles.sigEnglish}>
                  {dominantMeta?.english}
                </span>
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
                    <div
                      className={styles.sigBarFillLeft}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>

              <div className={`${styles.sigSide} ${styles.sigSideRight}`}>
                {otherPercent !== null ? (
                  <span className={styles.sigPercent}>{otherPercent}%</span>
                ) : null}
                <span className={styles.sigLabelSub}>{row.other}</span>
                <span className={styles.sigEnglishSub}>
                  {otherMeta?.english}
                </span>
                <span className={styles.sigLetterSub}>{otherMeta?.letter}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.sigCaption}>
        {typeData.typeCode} ={" "}
        {axisRows.map((row) => AXIS_LETTER_MAP[row.dominant]?.english).join(" + ")}
      </p>
    </TypeSectionFrame>
  );
}
