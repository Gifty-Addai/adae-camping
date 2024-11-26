// src/components/Gallery/GalleryHeader.tsx

import { Label } from '@/components/ui/label';
import React from 'react';

const GalleryHeader: React.FC = () => {
    return (

        <div className="text-center">
            <Label className='font-bold text-lg'>
                Explore Our Gallery
            </Label>
            
            <p className="mt-1">
                A curated collection of stunning images and videos.
            </p>
        </div>
    );
};

export default GalleryHeader;
