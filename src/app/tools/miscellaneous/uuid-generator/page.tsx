import UUIDGenerator from './uuid-generator';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.UUIDGenerator,
  description: ToolDescription[ToolNameLists.UUIDGenerator],
  keywords: 'uuid generator, uuid v1, uuid v4, generate uuid, unique identifier, uuid tool, uuid generator online, uuid generator app',
  openGraph: {
    title: ToolNameLists.UUIDGenerator,
    description: ToolDescription[ToolNameLists.UUIDGenerator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.UUIDGenerator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.UUIDGenerator])
  }
};

export default function Page() {
  return <UUIDGenerator />;
}