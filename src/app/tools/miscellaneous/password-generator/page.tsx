import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { PasswordGenerator } from './password-generator';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.PasswordGenerator,
  description: ToolDescription[ToolNameLists.PasswordGenerator],
  keywords: 'password generator, secure password, random password, strong password, password creator, password maker, secure passwords, random password generator, password security, online password generator',
  openGraph: {
    title: ToolNameLists.PasswordGenerator,
    description: ToolDescription[ToolNameLists.PasswordGenerator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.PasswordGenerator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.PasswordGenerator]),
  },
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}