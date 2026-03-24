import type { TypeData } from "@/lib/types";
import { SITE_DESCRIPTION, SITE_NAME, getAbsoluteUrl } from "@/lib/site";

export function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</gu, "\\u003c");
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    inLanguage: "ja-JP",
  };
}

export function getTypePageJsonLd(typeData: TypeData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${typeData.typeName} (${typeData.typeCode})`,
    description: typeData.summary,
    url: getAbsoluteUrl(`/types/${typeData.typeCode}`),
    inLanguage: "ja-JP",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getAbsoluteUrl("/"),
    },
  };
}
