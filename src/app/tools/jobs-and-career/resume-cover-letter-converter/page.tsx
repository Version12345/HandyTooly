import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import ResumeCoverLetterConverter from './converter';

export const metadata = {
    title: ToolNameLists.ResumeCoverLetterConverter,
    description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
    alternates: {
        canonical: ToolUrls[ToolNameLists.ResumeCoverLetterConverter],
    },
};

export default function ResumeCoverLetterConverterBase() {
    return (
        <ResumeCoverLetterConverter />
    );
};