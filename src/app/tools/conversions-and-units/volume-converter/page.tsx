import { Metadata } from "next";
import { VolumeConverter } from "./volume-converter";
import { canonicalUrl } from "@/utils/canonicalUrl";
import { ToolDescription, ToolNameLists, ToolUrls } from "@/constants/tools";

export const metadata: Metadata = {
  title: ToolNameLists.VolumeConverter,
  description: ToolDescription[ToolNameLists.VolumeConverter],
  keywords: "volume converter, liters to gallons, milliliters to cups, fluid ounces conversion, unit converter, measurement converter",
  openGraph: {
    title: ToolNameLists.VolumeConverter,
    description: ToolDescription[ToolNameLists.VolumeConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.VolumeConverter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.VolumeConverter]),
  },
};

export default function VolumeConverterPage() {
  return <VolumeConverter />;
}