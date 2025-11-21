import React from 'react';
import { Metadata } from 'next';
import JsonFormatterCompare from './json-formatter-compare';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.JsonFormatterCompare,
  description: ToolDescription[ToolNameLists.JsonFormatterCompare],
  keywords: ['json formatter', 'json compare', 'json diff', 'json validator', 'json beautifier', 'api testing', 'data comparison'],
  openGraph: {
    title: ToolNameLists.JsonFormatterCompare,
    description: ToolDescription[ToolNameLists.JsonFormatterCompare],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.JsonFormatterCompare], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.JsonFormatterCompare]),
  },
};

const JsonFormatterComparePage: React.FC = () => {
  return (
    <JsonFormatterCompare />
  );
};

export default JsonFormatterComparePage;