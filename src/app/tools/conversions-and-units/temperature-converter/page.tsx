import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { TemperatureConverter } from "./temperature-converter";

export const metadata: Metadata = {
  title: ToolNameLists.TemperatureConverter,
  description: ToolDescription[ToolNameLists.TemperatureConverter],
  keywords: "temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, rankine converter, temperature conversion, weather temperature, cooking temperature, science temperature",
  openGraph: {
    title: ToolNameLists.TemperatureConverter,
    description: ToolDescription[ToolNameLists.TemperatureConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.TemperatureConverter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.TemperatureConverter]),
  },
};

export default function TemperatureConverterPage() {
  return <TemperatureConverter />;
}