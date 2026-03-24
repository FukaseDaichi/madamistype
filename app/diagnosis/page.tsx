import type { Metadata } from "next";

import { DiagnosisFlow } from "@/components/diagnosis-flow";
import { getQuestionMaster } from "@/lib/data";

export const metadata: Metadata = {
  title: "診断フロー",
  description: "32問に答えて、マーダーミステリーでの立ち回りタイプを診断します。",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DiagnosisPage() {
  const questionMaster = await getQuestionMaster();

  return (
    <main id="main-content" className="page-shell py-8">
      <DiagnosisFlow questionMaster={questionMaster} />
    </main>
  );
}
