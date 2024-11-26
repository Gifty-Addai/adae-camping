// src/components/Gallery/GalleryImages.tsx

import React from 'react';
import ImageCard from './gallery_card';

const imageGallery = [
  { id: 1, src: '/images/gallery1.jpg', title: 'Mountain View', description: 'Sunset mountains.' },
  { id: 2, src: '/images/gallery2.jpg', title: 'Forest Trail', description: 'Peaceful forest trail.' },
  { id: 3, src: '/images/gallery3.jpg', title: 'Cityscape', description: 'City lights at night.' },
];

interface GalleryImagesProps {
  onItemSelect: (item: any) => void;
}

const GalleryImages: React.FC<GalleryImagesProps> = ({ onItemSelect }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {imageGallery.map((image) => (
        <ImageCard key={image.id} image={image} onClick={() => onItemSelect(image)} />
      ))}
    </div>
  );
};

export default GalleryImages;
