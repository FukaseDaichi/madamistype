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

/* ── Radar geometry ── */

const SVG_SIZE = 200;
const C = SVG_SIZE / 2; // center
const R = 76; // max radius

// Axis directions: top, right, bottom, left
const DIRS: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function pt(axis: number, ratio: number): string {
  const [dx, dy] = DIRS[axis];
  return `${C + dx * R * ratio},${C + dy * R * ratio}`;
}

function diamondPath(ratio: number): string {
  return `M${pt(0, ratio)} L${pt(1, ratio)} L${pt(2, ratio)} L${pt(3, ratio)} Z`;
}

/* ── Component ── */

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
  const axes = [
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

  const summaryMap = axisSummaries
    ? (Object.fromEntries(
        axisSummaries.map((s, i) => [i, s]),
      ) as Record<number, AxisSummary>)
    : null;

  const percents = axes.map((ax, i) => {
    if (!summaryMap) return 65;
    const s = summaryMap[i];
    if (!s) return 65;
    return s.positiveLabel === ax.dominant
      ? s.positivePercent
      : s.negativePercent;
  });

  const hasData = Boolean(summaryMap);

  const dataPath = `M${pt(0, percents[0] / 100)} L${pt(1, percents[1] / 100)} L${pt(2, percents[2] / 100)} L${pt(3, percents[3] / 100)} Z`;

  // Position indices: 0=top, 1=right, 2=bottom, 3=left
  const positionClasses = [
    styles.radarLabelTop,
    styles.radarLabelRight,
    styles.radarLabelBottom,
    styles.radarLabelLeft,
  ];

  return (
    <TypeSectionFrame
      heading={heading}
      className={styles.signatureSection}
      headerAlign="center"
    >
      <div className={styles.radarGrid}>
        {axes.map((ax, i) => {
          const meta = AXIS_LETTER_MAP[ax.dominant];
          const otherMeta = AXIS_LETTER_MAP[ax.other];
          return (
            <div
              key={ax.dominant}
              className={`${styles.radarLabel} ${positionClasses[i]}`}
            >
              <span className={styles.radarLetter}>{meta?.letter}</span>
              <span className={styles.radarAxisName}>{ax.dominant}</span>
              {hasData ? (
                <span className={styles.radarPercent}>{percents[i]}%</span>
              ) : null}
              <span className={styles.radarAxisOther}>
                vs {otherMeta?.letter} {ax.other}
              </span>
            </div>
          );
        })}

        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className={styles.radarSvg}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="radar-fill-grad"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#c0392b"
                stopOpacity={hasData ? 0.32 : 0.12}
              />
              <stop
                offset="100%"
                stopColor="#d4820a"
                stopOpacity={hasData ? 0.22 : 0.08}
              />
            </linearGradient>
            <linearGradient
              id="radar-stroke-grad"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#c0392b"
                stopOpacity={hasData ? 0.85 : 0.35}
              />
              <stop
                offset="100%"
                stopColor="#d4820a"
                stopOpacity={hasData ? 0.85 : 0.35}
              />
            </linearGradient>
          </defs>

          {/* Grid diamonds */}
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <path
              key={level}
              d={diamondPath(level)}
              fill="none"
              stroke="rgba(196,169,107,0.1)"
              strokeWidth="0.5"
            />
          ))}

          {/* Axis lines */}
          {DIRS.map(([dx, dy], i) => (
            <line
              key={i}
              x1={C}
              y1={C}
              x2={C + dx * R}
              y2={C + dy * R}
              stroke="rgba(196,169,107,0.15)"
              strokeWidth="0.5"
            />
          ))}

          {/* Data polygon */}
          <path
            d={dataPath}
            fill="url(#radar-fill-grad)"
            stroke="url(#radar-stroke-grad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {percents.map((p, i) => {
            const [dx, dy] = DIRS[i];
            const ratio = p / 100;
            const cx = C + dx * R * ratio;
            const cy = C + dy * R * ratio;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill={hasData ? "#d4820a" : "rgba(196,169,107,0.25)"}
                stroke={hasData ? "rgba(192,57,43,0.7)" : "rgba(196,169,107,0.15)"}
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      <p className={styles.sigCaption}>
        {typeData.typeCode} ={" "}
        {axes.map((ax) => AXIS_LETTER_MAP[ax.dominant]?.english).join(" + ")}
      </p>
    </TypeSectionFrame>
  );
}
