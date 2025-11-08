import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { LengthConverter } from "./length-converter";

export const metadata: Metadata = {
  title: ToolNameLists.LengthConverter,
  description: ToolDescription[ToolNameLists.LengthConverter],
  keywords: "length converter, distance converter, meters to feet, inches to cm, kilometers to miles, unit converter, measurement converter",
  openGraph: {
    title: ToolNameLists.LengthConverter,
    description: ToolDescription[ToolNameLists.LengthConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.LengthConverter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.LengthConverter]),
  },
};

export default function LengthConverterPage() {
  return <LengthConverter />;
}