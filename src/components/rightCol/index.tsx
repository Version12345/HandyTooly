"use client";
import { usePathname } from 'next/navigation';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from "react-share";

interface RightColProps {
    title: string;
}

export const RightCol = ({ title }: RightColProps) => {
  const pathname = usePathname();
    const shareUrl = `${process.env.BASE_URL}${pathname}`;
    
    return (
        <div className="min-h-auto">
            <div className="bg-gray-50 shadow-md rounded-lg p-4 mb-4">
                <h4>Share</h4>
                <div className="flex">
                    <FacebookShareButton url={shareUrl} className="mr-2">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={title} className="mr-2">
                        <XIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl} title={title} className="mr-2">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <RedditShareButton url={shareUrl} title={title} className="mr-2">
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                    <EmailShareButton url={shareUrl} title={title} className="mr-2">
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </div>
            </div>
        </div>
    )
};