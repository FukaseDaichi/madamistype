import type { CSSProperties } from "react";

import type { AxisSummary, TypeData } from "@/lib/types";

import {
  TypeSectionFrame,
  type TypeSectionHeading,
} from "@/components/type/type-detail-page-content/type-section-frame";

import styles from "./type-detail-page-content.module.css";

const AXIS_LETTER_MAP: Record<string, { letter: string; english: string }> = {
  発言型: { letter: "T", english: "Talk" },
  観察型: { letter: "O", english: "Observe" },
  事実重視: { letter: "F", english: "Fact" },
  推理重視: { letter: "R", english: "Reasoning" },
  論理派: { letter: "L", english: "Logic" },
  感情派: { letter: "E", english: "Emotion" },
  計画型: { letter: "P", english: "Plan" },
  即興型: { letter: "I", english: "Improvise" },
};

const AXIS_TONE_MAP = [
  {
    accent: "#d85f67",
    soft: "rgba(216, 95, 103, 0.2)",
    glow: "rgba(216, 95, 103, 0.4)",
  },
  {
    accent: "#e2a12f",
    soft: "rgba(226, 161, 47, 0.2)",
    glow: "rgba(226, 161, 47, 0.4)",
  },
  {
    accent: "#43a1a6",
    soft: "rgba(67, 161, 166, 0.2)",
    glow: "rgba(67, 161, 166, 0.38)",
  },
  {
    accent: "#4f86da",
    soft: "rgba(79, 134, 218, 0.22)",
    glow: "rgba(79, 134, 218, 0.4)",
  },
] as const;

const DEFAULT_SIGNATURE_PERCENT = 65;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
  const rawAxes = [
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

  const summaryMap = axisSummaries?.length
    ? (Object.fromEntries(axisSummaries.map((s, i) => [i, s])) as Record<
        number,
        AxisSummary
      >)
    : null;

  const axisDetails = rawAxes.map((axis, index) => {
    const dominantMeta = AXIS_LETTER_MAP[axis.dominant] ?? {
      letter: axis.dominant.charAt(0),
      english: axis.dominant,
    };
    const otherMeta = AXIS_LETTER_MAP[axis.other] ?? {
      letter: axis.other.charAt(0),
      english: axis.other,
    };

    if (!summaryMap) {
      return {
        ...axis,
        dominantMeta,
        otherMeta,
        percent: DEFAULT_SIGNATURE_PERCENT,
        trackPercent: DEFAULT_SIGNATURE_PERCENT,
        tone: AXIS_TONE_MAP[index],
      };
    }

    const s = summaryMap[index];
    const percent = !s
      ? DEFAULT_SIGNATURE_PERCENT
      : s.positiveLabel === axis.dominant
        ? s.positivePercent
        : s.negativePercent;

    return {
      ...axis,
      dominantMeta,
      otherMeta,
      percent,
      trackPercent: clamp(percent, 6, 94),
      tone: AXIS_TONE_MAP[index],
    };
  });

  const hasData = Boolean(axisSummaries?.length);

  const dataPath = `M${pt(0, axisDetails[0].percent / 100)} L${pt(1, axisDetails[1].percent / 100)} L${pt(2, axisDetails[2].percent / 100)} L${pt(3, axisDetails[3].percent / 100)} Z`;
  const signatureFormula = axisDetails
    .map((axis) => axis.dominantMeta.english)
    .join(" + ");
  const boardStyle = {
    ["--signature-ogp-url" as string]: `url("/types/${typeData.typeCode}-ogp.png")`,
  } as CSSProperties;
  const radarFillId = `${typeData.typeCode.toLowerCase()}-radar-fill-grad`;
  const radarStrokeId = `${typeData.typeCode.toLowerCase()}-radar-stroke-grad`;

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
      <div className={styles.signatureShowcase}>
        <div className={styles.signatureBoard} style={boardStyle}>
          <div className={styles.signatureBoardPlate}>
            <p className={styles.signatureBoardMark}>MADAMIS TYPE</p>
            <p className={styles.signatureBoardCode}>{typeData.typeCode}</p>
            <p className={styles.signatureBoardName}>{typeData.typeName}</p>
          </div>

          <div className={styles.signatureBoardRadar}>
            <div className={styles.radarGrid}>
              {axisDetails.map((axis, i) => (
                <div
                  key={axis.dominant}
                  className={`${styles.radarLabel} ${positionClasses[i]}`}
                >
                  <span className={styles.radarLetter}>
                    {axis.dominantMeta.letter}
                  </span>
                  {hasData ? (
                    <span className={styles.radarPercent}>{axis.percent}%</span>
                  ) : null}
                  <span className={styles.radarAxisName}>{axis.dominant}</span>
                  <span className={styles.radarAxisOther}>
                    vs {axis.otherMeta.letter}
                  </span>
                </div>
              ))}

              <svg
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                className={styles.radarSvg}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={radarFillId} x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#c0392b"
                      stopOpacity={hasData ? 0.34 : 0.14}
                    />
                    <stop
                      offset="100%"
                      stopColor="#d4820a"
                      stopOpacity={hasData ? 0.24 : 0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id={radarStrokeId}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#e7664f"
                      stopOpacity={hasData ? 0.92 : 0.42}
                    />
                    <stop
                      offset="100%"
                      stopColor="#f1aa29"
                      stopOpacity={hasData ? 0.92 : 0.42}
                    />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75, 1].map((level) => (
                  <path
                    key={level}
                    d={diamondPath(level)}
                    fill="none"
                    stroke="rgba(196, 169, 107, 0.16)"
                    strokeWidth="0.7"
                  />
                ))}

                {DIRS.map(([dx, dy], i) => (
                  <line
                    key={i}
                    x1={C}
                    y1={C}
                    x2={C + dx * R}
                    y2={C + dy * R}
                    stroke="rgba(196, 169, 107, 0.16)"
                    strokeWidth="0.7"
                  />
                ))}

                <path
                  d={dataPath}
                  fill={`url(#${radarFillId})`}
                  stroke={`url(#${radarStrokeId})`}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {axisDetails.map((axis, i) => {
                  const [dx, dy] = DIRS[i];
                  const ratio = axis.percent / 100;
                  const cx = C + dx * R * ratio;
                  const cy = C + dy * R * ratio;

                  return (
                    <circle
                      key={axis.dominant}
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill={hasData ? "#f29d15" : "rgba(196, 169, 107, 0.28)"}
                      stroke={
                        hasData
                          ? "rgba(192, 57, 43, 0.78)"
                          : "rgba(196, 169, 107, 0.18)"
                      }
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className={styles.signatureBoardMetrics}>
            {axisDetails.map((axis) => (
              <div
                key={`${axis.dominant}-metric`}
                className={styles.signatureBoardMetric}
                style={
                  {
                    ["--signature-axis-accent" as string]: axis.tone.accent,
                    ["--signature-axis-accent-soft" as string]: axis.tone.soft,
                    ["--signature-axis-accent-glow" as string]: axis.tone.glow,
                  } as CSSProperties
                }
              >
                <div className={styles.signatureBoardMetricHead}>
                  <span className={styles.signatureBoardMetricLetter}>
                    {axis.dominantMeta.letter}
                  </span>
                  {hasData ? (
                    <span className={styles.signatureBoardMetricValue}>
                      {axis.percent}%
                    </span>
                  ) : null}
                </div>
                <div
                  className={styles.signatureBoardMetricTrack}
                  aria-hidden="true"
                >
                  <span
                    className={styles.signatureBoardMetricFill}
                    style={{ width: `${axis.trackPercent}%` }}
                  />
                </div>
                <span className={styles.signatureBoardMetricPair}>
                  {axis.dominant} vs {axis.other}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.signatureBoardCaption}>
            <p className={styles.signatureBoardFormula}>{signatureFormula}</p>
            <p className={styles.signatureBoardCase}>
              CASE FILE #{typeData.typeCode}
            </p>
            <p className={styles.signatureBoardCaptionName}>
              {typeData.typeName}
            </p>
          </div>
        </div>
      </div>
    </TypeSectionFrame>
  );
}
