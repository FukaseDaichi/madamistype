import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllTypeCodes,
  getTypeByCode,
  getTypesByCodes,
  hasChibiImage,
} from "@/lib/data";
import { getAbsoluteUrl } from "@/lib/site";
import { TypeDetailPageContent } from "@/components/type/type-detail-page-content/type-detail-page-content";

type PageProps = {
  params: Promise<{ typeCode: string }>;
};

export async function generateStaticParams() {
  const typeCodes = await getAllTypeCodes();
  return typeCodes.map((typeCode) => ({ typeCode }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { typeCode } = await params;
  const typeData = await getTypeByCode(typeCode);

  if (!typeData) {
    notFound();
  }

  return {
    title: `${typeData.typeName} (${typeData.typeCode})`,
    description: typeData.summary,
    alternates: {
      canonical: `/types/${typeData.typeCode}`,
    },
    openGraph: {
      title: `${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      url: `/types/${typeData.typeCode}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${typeData.typeName} (${typeData.typeCode})`,
      description: typeData.tagline,
      images: [`/types/${typeData.typeCode}/opengraph-image`],
    },
  };
}

export default async function TypeDetailPage({ params }: PageProps) {
  const { typeCode } = await params;
  const typeData = await getTypeByCode(typeCode);

  if (!typeData) {
    notFound();
  }

  const publicUrl = `/types/${typeData.typeCode}`;
  const hasChibi = await hasChibiImage(typeData.typeCode);
  const compatibleTypes = await getTypesByCodes(
    typeData.compatibility.goodWithTypeCodes ?? [],
  );

  return (
    <TypeDetailPageContent
      mode="public"
      typeData={typeData}
      shareUrl={getAbsoluteUrl(publicUrl)}
      publicUrl={publicUrl}
      hasChibi={hasChibi}
      compatibleTypes={compatibleTypes.map(({ typeCode, typeName }) => ({
        typeCode,
        typeName,
      }))}
    />
  );
}
