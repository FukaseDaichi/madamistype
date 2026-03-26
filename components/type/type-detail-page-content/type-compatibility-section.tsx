import type { TypeData } from "@/lib/types";

import Link from "next/link";

import styles from "./type-detail-page-content.module.css";

type CompatibleType = {
  typeCode: string;
  typeName: string;
};

type TypeCompatibilitySectionProps = {
  compatibility: TypeData["compatibility"];
  compatibleTypes?: CompatibleType[];
};

export function TypeCompatibilitySection({
  compatibility,
  compatibleTypes,
}: TypeCompatibilitySectionProps) {
  const resolvedCompatibleTypes =
    compatibleTypes?.length
      ? compatibleTypes
      : (compatibility.goodWithTypeCodes ?? []).map((typeCode) => ({
          typeCode,
          typeName: typeCode,
        }));

  return (
    <section className={styles.section} aria-labelledby="compat-heading">
      <span className={styles.sectionEyebrow}>Compatibility</span>
      <h2 id="compat-heading" className={styles.sectionTitle}>
        相性の傾向
      </h2>
      <p className={styles.compatText}>{compatibility.summary}</p>
      {resolvedCompatibleTypes.length ? (
        <div className={styles.compatLinks}>
          {resolvedCompatibleTypes.map((compatibleType) => (
            <Link
              key={compatibleType.typeCode}
              href={`/types/${compatibleType.typeCode}`}
              className={styles.compatLink}
            >
              {`${compatibleType.typeName} (${compatibleType.typeCode})`}
            </Link>
          ))}
        </div>
      ) : null}
      {compatibility.goodWithDescription ? (
        <p className={styles.compatText}>{compatibility.goodWithDescription}</p>
      ) : null}
    </section>
  );
}
