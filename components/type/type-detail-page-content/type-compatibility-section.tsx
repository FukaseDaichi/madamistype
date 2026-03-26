import type { TypeData } from "@/lib/types";

import Link from "next/link";

import {
  TypeSectionFrame,
  type TypeSectionHeading,
} from "@/components/type/type-detail-page-content/type-section-frame";

import styles from "./type-detail-page-content.module.css";

type CompatibleType = {
  typeCode: string;
  typeName: string;
};

type TypeCompatibilitySectionProps = {
  heading: TypeSectionHeading;
  compatibility: TypeData["compatibility"];
  compatibleTypes?: CompatibleType[];
};

export function TypeCompatibilitySection({
  heading,
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
    <TypeSectionFrame heading={heading}>
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
    </TypeSectionFrame>
  );
}
