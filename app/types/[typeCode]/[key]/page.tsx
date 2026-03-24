import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { calculateDiagnosisResult } from "@/lib/diagnosis";
import { getQuestionMaster, getTypeByCode } from "@/lib/data";
import { decodeShareKey } from "@/lib/share-key";
import { getAbsoluteUrl } from "@/lib/site";

import { TypeDetailPageContent } from "../type-detail-page-content";

type PageProps = {
  params: Promise<{ typeCode: string; key: string }>;
};

async function getSharedPageData(typeCode: string, key: string) {
  const typeData = await getTypeByCode(typeCode);
  const payload = decodeShareKey(key);

  if (!typeData || !payload) {
    notFound();
  }

  if (payload.v === 2) {
    const questionMaster = await getQuestionMaster();
    const result = calculateDiagnosisResult(questionMaster, payload.a);

    if (result.typeCode !== typeCode) {
      notFound();
    }
  }

  return {
    typeData,
    publicUrl: `/types/${typeData.typeCode}`,
    shareUrl: getAbsoluteUrl(`/types/${typeData.typeCode}/${key}`),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { typeCode, key } = await params;
  const { typeData } = await getSharedPageData(typeCode, key);

  return {
    title: `共有された結果: ${typeData.typeName} (${typeData.typeCode})`,
    description: `${typeData.typeName}（${typeData.typeCode}）の共有タイプページです。`,
    alternates: {
      canonical: `/types/${typeData.typeCode}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `共有結果: ${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      url: `/types/${typeData.typeCode}/${key}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `共有結果: ${typeData.typeName}`,
      description: typeData.tagline,
      images: [`/types/${typeData.typeCode}/opengraph-image`],
    },
  };
}

export default async function SharedResultPage({ params }: PageProps) {
  const { typeCode, key } = await params;
  const { typeData, shareUrl, publicUrl } = await getSharedPageData(
    typeCode,
    key,
  );

  return (
    <TypeDetailPageContent
      mode="shared"
      typeData={typeData}
      shareUrl={shareUrl}
      publicUrl={publicUrl}
    />
  );
}
