import { ToolDescription, ToolNameLists } from '@/constants/tools';
import ResumeCoverLetterConverter from './converter';

export const metadata = {
    title: ToolNameLists.ResumeCoverLetterConverter,
    description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
};

export default function ResumeCoverLetterConverterBase() {
    return (
        <ResumeCoverLetterConverter />
    );
};