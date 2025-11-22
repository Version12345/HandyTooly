import React from 'react';
import { Metadata } from 'next';
import IPChecker from './ip-checker';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.IPChecker,
  description: ToolDescription[ToolNameLists.IPChecker],
  keywords: ['ip address', 'what is my ip', 'ip checker', 'public ip', 'internet connection', 'network information', 'ISP details', 'location lookup'],
  openGraph: {
    title: ToolNameLists.IPChecker,
    description: ToolDescription[ToolNameLists.IPChecker],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.IPChecker], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.IPChecker]),
  },
};

const IPCheckerPage: React.FC = () => {
  return (
    <IPChecker />
  );
};

export default IPCheckerPage;