import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { WeightConverter } from './weight-converter';

export const metadata: Metadata = {
  title: ToolNameLists.WeightConverter,
  description: ToolDescription[ToolNameLists.WeightConverter],
  keywords: "weight converter, pounds to kg, kilograms to pounds, ounces to grams, stones converter, unit converter, weight conversion",
  openGraph: {
    title: ToolNameLists.WeightConverter,
    description: ToolDescription[ToolNameLists.WeightConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.WeightConverter], true),
  },
  alternates: {
      canonical: canonicalUrl(ToolUrls[ToolNameLists.WeightConverter]),
  },
};

export default function WeightConverterPage() {
  return <WeightConverter />;
}