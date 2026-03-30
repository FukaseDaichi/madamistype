import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page/home-page";
import { getAllTypes, getQuestionMaster } from "@/lib/data";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

export default async function MarketingHomePage() {
  const [allTypes, questionMaster] = await Promise.all([
    getAllTypes(),
    getQuestionMaster(),
  ]);

  return <HomePage allTypes={allTypes} questionMaster={questionMaster} />;
}
