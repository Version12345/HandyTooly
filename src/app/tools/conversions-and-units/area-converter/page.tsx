import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { AreaConverter } from "./area-converter";

export const metadata: Metadata = {
  title: ToolNameLists.AreaConverter,
  description: ToolDescription[ToolNameLists.AreaConverter],
  keywords: "area converter, square meters to square feet, acres to hectares, square kilometers, area conversion, land measurement, real estate calculator",
  openGraph: {
    title: ToolNameLists.AreaConverter,
    description: ToolDescription[ToolNameLists.AreaConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.AreaConverter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.AreaConverter]),
  },
};

export default function AreaConverterPage() {
  return <AreaConverter />;
}