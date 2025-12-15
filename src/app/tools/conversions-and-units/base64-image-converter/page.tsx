import { Metadata } from 'next';
import { Base64ImageConverter } from './base64-image-converter';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: 'Base64 Image Converter - Convert Images to Base64 & Vice Versa | HandyTooly',
  description: 'Convert images to Base64 format or decode Base64 strings back to downloadable images. Perfect for data URIs, CSS embedding, and web development.',
  keywords: 'base64 image converter, image to base64, base64 to image, data uri, css image embedding, image encoding, web development tools',
  openGraph: {
    title: 'Base64 Image Converter - Convert Images to Base64 & Vice Versa',
    description: 'Convert images to Base64 format or decode Base64 strings back to downloadable images. Perfect for data URIs, CSS embedding, and web development.',
    type: 'website',
    url: canonicalUrl('/tools/conversions-and-units/base64-image-converter', true),
  },
  alternates: {
    canonical: canonicalUrl('/tools/conversions-and-units/base64-image-converter'),
  },
};

export default function Base64ImageConverterPage() {
  return <Base64ImageConverter />;
}