import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { JWTDecoder } from './jwt-decoder';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.JWTDecoder,
  description: ToolDescription[ToolNameLists.JWTDecoder],
  keywords: 'JWT decoder, JSON web token decoder, JWT parser, token decoder, JWT analyzer, authentication token, JWT validator, web token decoder, JWT claims, token structure',
  openGraph: {
    title: ToolNameLists.JWTDecoder,
    description: ToolDescription[ToolNameLists.JWTDecoder],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.JWTDecoder], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.JWTDecoder]),
  },
};

export default function JWTDecoderPage() {
  return <JWTDecoder />;
}