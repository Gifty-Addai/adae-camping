// src/components/Gallery/GalleryTabs.tsx

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import GalleryImages from './gallery_images';
import GalleryVideos from './gallery_video';

interface GalleryTabsProps {
  onItemSelect: (item: any) => void;
}

const GalleryTabs: React.FC<GalleryTabsProps> = ({ onItemSelect }) => {
  // const [selectedTab, setSelectedTab] = useState('images');

  return (
    <Tabs defaultValue="images" className="mt-8">
      <div className="flex justify-center mb-6">
        <TabsList className="flex justify-center gap-6">
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
          
        </TabsList>
      </div>

      <TabsContent value="images">
        <GalleryImages onItemSelect={onItemSelect} />
      </TabsContent>

      <TabsContent value="videos">
        <GalleryVideos onItemSelect={onItemSelect} />
      </TabsContent>
    </Tabs>
  );
};

export default GalleryTabs;
