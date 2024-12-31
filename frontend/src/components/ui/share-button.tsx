import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from 'react-share';
import { Button } from '@/components/ui/button';
import { Share2Icon } from 'lucide-react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    const [showOptions, setShowOptions] = useState(false);

    const handleNativeShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: `Check out this product: ${title}`,
                    url: url,
                });
            } else {
                // If the native API is not available, fallback to showing the share icons
                setShowOptions(!showOptions);
            }
        } catch (err) {
            console.error('Error using native share:', err);
            toast.error('Unable to share using native share.');
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy link:', err);
            toast.error('Failed to copy link.');
        }
    };

    return (
        <div className="relative">
            {/* Primary share button (either tries native share or toggles fallback icons) */}
            <Button variant="secondary" onClick={handleNativeShare}>
                <Share2Icon className="h-4 w-4 mr-2" />
                Share
            </Button>

            {/* If native share is not available, or user wants to see more options */}
            {showOptions && (
                <div className="absolute mt-2 p-2 bg-white border rounded-md shadow-lg flex flex-col space-y-2 z-50">
                    <div className="flex space-x-2">
                        <FacebookShareButton url={url}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <TwitterShareButton url={url} title={title}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                        <WhatsappShareButton url={url} title={title}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>

                        <LinkedinShareButton url={url}>
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    </div>

                    <Button onClick={handleCopyLink} variant="ghost" className="text-sm p-0">
                        Copy Link
                    </Button>
                </div>
            )}
        </div>
    );
};
