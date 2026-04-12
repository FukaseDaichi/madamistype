import type { Metadata } from "next";

import { TrendsPage } from "@/components/trends/trends-page";
import { getAllTypes } from "@/lib/data";
import { SITE_KEYWORDS } from "@/lib/site";

export const metadata: Metadata = {
  title: "アンケート傾向",
  description:
    "206件のアンケート回答から見えたタイプ分布と、おすすめマダミスの傾向をまとめた公開ページです。",
  keywords: [...SITE_KEYWORDS, "アンケート結果", "タイプ別おすすめ"],
  alternates: {
    canonical: "/trends",
  },
  openGraph: {
    title: "アンケート傾向 | マダミスタイプ診断",
    description:
      "206件のアンケート回答から見えたタイプ分布と、おすすめマダミスの傾向をまとめました。",
    url: "/trends",
    images: ["/main-ogp.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "アンケート傾向 | マダミスタイプ診断",
    description:
      "タイプ分布とおすすめマダミスの傾向をまとめた静的記事ページです。",
    images: ["/main-ogp.png"],
  },
};

export default async function TrendsArticlePage() {
  const allTypes = await getAllTypes();

  return <TrendsPage allTypes={allTypes} />;
}
