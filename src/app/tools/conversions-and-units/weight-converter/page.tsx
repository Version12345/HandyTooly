import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { WeightConverter } from './weight-converter';

export const metadata = {
    title: ToolNameLists.WeightConverter,
    description: ToolDescription[ToolNameLists.WeightConverter],
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.WeightConverter]),
    },
};

export default function WeightConverterPage() {
  return <WeightConverter />;
}