import {
  TypeSectionFrame,
  type TypeSectionHeading,
} from "@/components/type/type-detail-page-content/type-section-frame";

import styles from "./type-detail-page-content.module.css";

type TypeListSectionProps = {
  heading: TypeSectionHeading;
  items: string[];
};

export function TypeListSection({ heading, items }: TypeListSectionProps) {
  return (
    <TypeSectionFrame heading={heading}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </TypeSectionFrame>
  );
}
