import { Metadata } from 'next'
import DecimalFractionConverter from './decimal-fraction-converter'
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools'
import { SITE_NAME } from '@/constants/site-info'
import { canonicalUrl } from '@/utils/canonicalUrl'

export const metadata: Metadata = {
  title: ToolNameLists.DecimalFractionConverter,
  description: ToolDescription[ToolNameLists.DecimalFractionConverter],
  keywords: [
    'decimal to fraction converter',
    'fraction to decimal converter',
    'decimal fraction calculator',
    'convert decimal to fraction',
    'convert fraction to decimal',
    'repeating decimal converter',
    'mixed number calculator',
    'improper fraction converter',
    'simplified fraction calculator',
    'fraction simplification tool',
    'mathematics calculator',
    'fraction calculator',
    'decimal calculator',
    'math conversion tool',
    'educational math tool',
    'fraction reduction calculator',
    'terminating decimal',
    'repeating decimal',
    'greatest common divisor',
    'GCD calculator',
    'mathematical conversion',
    'fraction simplifier'
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: canonicalUrl(ToolUrls[ToolNameLists.DecimalFractionConverter]),
    siteName: SITE_NAME,
    title: ToolNameLists.DecimalFractionConverter,
    description: ToolDescription[ToolNameLists.DecimalFractionConverter]
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.DecimalFractionConverter]),
  },
}

export default function DecimalFractionConverterPage() {
  return <DecimalFractionConverter />
}