import { Metadata } from 'next'
import { MeanMedianModeCalculator } from './mean-median-mode-calculator'
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools'
import { SITE_NAME } from '@/constants/site-info'
import { canonicalUrl } from '@/utils/canonicalUrl'

export const metadata: Metadata = {
  title: ToolNameLists.MeanMedianModeCalculator,
  description: ToolDescription[ToolNameLists.MeanMedianModeCalculator],
  keywords: [
    'mean median mode calculator',
    'statistics calculator',
    'statistical analysis tool',
    'data analysis calculator',
    'central tendency calculator',
    'quartiles calculator',
    'statistical measures',
    'math calculator',
    'data set analysis',
    'descriptive statistics',
    'statistical formulas',
    'mean calculator',
    'median calculator',
    'mode calculator',
    'range calculator',
    'variance calculator',
    'standard deviation',
    'interquartile range',
    'outliers detection',
    'mathematics tool',
    'statistical computing'
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: canonicalUrl(ToolUrls[ToolNameLists.MeanMedianModeCalculator]),
    siteName: SITE_NAME,
    title: ToolNameLists.MeanMedianModeCalculator,
    description: ToolDescription[ToolNameLists.MeanMedianModeCalculator]
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.MeanMedianModeCalculator]),
  },
}

export default function MeanMedianModeCalculatorPage() {
  return <MeanMedianModeCalculator />
}