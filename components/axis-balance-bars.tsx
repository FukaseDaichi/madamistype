import type { AxisSummary } from "@/lib/types";

type AxisBalanceBarsProps = {
  items: AxisSummary[];
  eyebrow?: string;
  title?: string;
  description?: string;
  note?: string;
  className?: string;
};

export function AxisBalanceBars({
  items,
  eyebrow = "Axis",
  title = "4軸バランス",
  description = "回答の寄り方を、4つの軸で見ています。",
  note,
  className = "",
}: AxisBalanceBarsProps) {
  return (
    <section
      className={`surface-panel flex flex-col gap-5 ${className}`.trim()}
    >
      <div className="flex flex-col gap-2">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          {description}
        </p>
        {note ? <p className="axis-note text-sm">{note}</p> : null}
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.axis} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span
                className={
                  item.positivePercent >= item.negativePercent
                    ? "font-semibold text-[color:var(--color-text)]"
                    : "text-[color:var(--color-text-subtle)]"
                }
              >
                {item.positiveLabel} {item.positivePercent}
              </span>
              <span
                className={
                  item.negativePercent > item.positivePercent
                    ? "font-semibold text-[color:var(--color-text)]"
                    : "text-[color:var(--color-text-subtle)]"
                }
              >
                {item.negativePercent} {item.negativeLabel}
              </span>
            </div>
            <div className="axis-track" aria-hidden="true">
              <div
                className="axis-fill"
                style={{ width: `${item.positivePercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
