import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import ResumeCoverLetterConverter from './converter';

export const metadata: Metadata = {
    title: ToolNameLists.ResumeCoverLetterConverter,
    description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
    keywords: "resume converter, cover letter generator, AI resume builder, job application helper, resume optimizer, career tools",
    openGraph: {
      title: ToolNameLists.ResumeCoverLetterConverter,
      description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.ResumeCoverLetterConverter], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.ResumeCoverLetterConverter]),
    },
};

export default function ResumeCoverLetterConverterBase() {
    return (
        <ResumeCoverLetterConverter />
    );
};