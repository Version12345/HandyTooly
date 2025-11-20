import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { PasswordGenerator } from './password-generator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: ToolNameLists.PasswordGenerator,
  description: ToolDescription[ToolNameLists.PasswordGenerator],
  keywords: 'password generator, secure password, random password, strong password, password creator, password maker, secure passwords, random password generator, password security, online password generator',
  openGraph: {
    title: ToolNameLists.PasswordGenerator,
    description: ToolDescription[ToolNameLists.PasswordGenerator],
    type: 'website',
  },
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}