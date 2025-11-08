import { Metadata } from "next";
import { LengthConverter } from "./length-converter";

export const metadata: Metadata = {
  title: "Length Converter - Convert Between Meters, Feet, Inches & More | HandyTooly",
  description: "Convert between different length units including metric, imperial, and specialized units. Features real-world comparisons and measurement facts.",
  keywords: "length converter, distance converter, meters to feet, inches to cm, kilometers to miles, unit converter, measurement converter",
  openGraph: {
    title: "Length Converter - Meters, Feet, Inches & More",
    description: "Convert between different length units with real-world comparisons and measurement facts.",
    type: "website",
    url: "https://handytooly.com/tools/conversions-and-units/length-converter",
  },
  alternates: {
    canonical: "https://handytooly.com/tools/conversions-and-units/length-converter",
  },
};

export default function LengthConverterPage() {
  return <LengthConverter />;
}