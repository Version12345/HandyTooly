import { canonicalUrl } from "@/utils/canonicalUrl";
import { Metadata } from "next";
import SupportUs from "./support-us";

export const metadata: Metadata = {
  title: 'Support Us - Help Keep HandyTooly Free',
  description: 'Support HandyTooly\'s mission to provide free, useful tools for everyone. Your donations help us maintain and improve our services.',
  keywords: 'support handytooly, donate, help, free tools, paypal donation, cryptocurrency donation, bitcoin, solana, contribute',
  openGraph: {
    title: 'Support Us - Help Keep Us Free',
    description: 'Support our mission to provide free, useful tools for everyone. Your donations help us maintain and improve our services.',
    type: 'website',
    url: canonicalUrl('/support-us', true),
  },
  alternates: {
    canonical: canonicalUrl('/support-us'),
  },
};

export default function SupportUsLayout({
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: Promise<{ isreturning: string; }>;
}) {
  return <SupportUs searchParams={searchParams} />;
}