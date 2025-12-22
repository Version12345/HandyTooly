import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { CSVColumnExtractor } from './csv-column-extractor';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.CSVColumnExtractor,
  description: ToolDescription[ToolNameLists.CSVColumnExtractor],
  keywords: 'csv column extractor, csv parser, extract csv column, csv data processing, csv column by name, csv column by number, csv manipulation, data extraction',
  openGraph: {
    title: ToolNameLists.CSVColumnExtractor,
    description: ToolDescription[ToolNameLists.CSVColumnExtractor],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.CSVColumnExtractor], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.CSVColumnExtractor]),
  },
};

export default function CSVColumnExtractorPage() {
  return <CSVColumnExtractor />;
}