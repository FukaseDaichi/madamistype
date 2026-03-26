import styles from "./type-detail-page-content.module.css";

type TypeOverviewSectionProps = {
  detailDescription: string;
};

export function TypeOverviewSection({
  detailDescription,
}: TypeOverviewSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="overview-heading">
      <span className={styles.sectionEyebrow}>Overview</span>
      <h2 id="overview-heading" className={styles.sectionTitle}>
        詳しい見立て
      </h2>
      <p className={styles.detailText}>{detailDescription}</p>
    </section>
  );
}
