import { RandomTextGenerator } from './random-text-generator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Random Text Generator - Lorem Ipsum, Passwords, Sample Data | HandyTooly',
  description: 'Generate various types of random text instantly with this free online tool. Create lorem ipsum, passwords, usernames, email addresses, and sample data. No sign-up required.',
  keywords: 'random text generator, lorem ipsum generator, password generator, username generator, sample data, placeholder text, fake data generator, text tools',
  openGraph: {
    title: 'Free Random Text Generator - Lorem Ipsum, Passwords, Sample Data',
    description: 'Generate various types of random text instantly. Create lorem ipsum, passwords, usernames, and sample data with this free online tool.',
    type: 'website',
  },
};

export default function RandomTextGeneratorPage() {
  return <RandomTextGenerator />;
}