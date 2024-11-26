// src/pages/GalleryPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryHeader from './gallery_header';
import GalleryTabs from './gallery_tabs';
import SearchFilter from './search_filter';
import FeaturedContent from './features_content';
import GalleryLightbox from './light_box';
import { Page } from '@/components/ui/page';
import { ProcessedVideo } from '@/core/interfaces';

const GalleryPage: React.FC = () => {
  const [lightboxItem, setLightboxItem] = useState<ProcessedVideo>();

  const openLightbox = (item: ProcessedVideo) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(undefined);

  return (

    <Page
      renderBody={() => (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-7xl mx-auto px-4 py-8 mt-16"
          >
            <GalleryHeader />
            <SearchFilter />
            <FeaturedContent onItemSelect={openLightbox} />
            <GalleryTabs onItemSelect={openLightbox} />
            {lightboxItem && (
              <GalleryLightbox item={lightboxItem} isOpen={!!lightboxItem} onClose={closeLightbox} />
            )}
          </motion.div>
        </div>

      )}
    />
  );
};

export default GalleryPage;
