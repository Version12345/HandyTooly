import { canonicalUrl } from "@/utils/canonicalUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Support Us',
  description: "Our platform helps job seekers create better resumes and cover letters and many other useful tools. Your support helps us keep this service free and continuously improve our AI-powered tools.",
  alternates: {
    canonical: canonicalUrl('/support-us'),
  },
};

export default function SupportUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}