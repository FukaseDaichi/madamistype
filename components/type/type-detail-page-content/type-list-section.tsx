import styles from "./type-detail-page-content.module.css";

type TypeListSectionProps = {
  eyebrow: string;
  title: string;
  headingId: string;
  items: string[];
};

export function TypeListSection({
  eyebrow,
  title,
  headingId,
  items,
}: TypeListSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <span className={styles.sectionEyebrow}>{eyebrow}</span>
      <h2 id={headingId} className={styles.sectionTitle}>
        {title}
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
