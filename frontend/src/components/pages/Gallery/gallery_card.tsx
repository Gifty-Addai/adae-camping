// src/components/Gallery/ImageCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Images } from '@/assets/assets';

interface ImageProps {
  image: { id: number; src: string; title: string; description: string };
}

const ImageCard: React.FC<ImageProps> = ({ image }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
    >
      <img
        src={Images.Tent}
        alt={image.title}
        className="w-full h-48 object-fill"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {image.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
          {image.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ImageCard;
