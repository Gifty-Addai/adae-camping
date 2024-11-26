import React, { useEffect, useState } from 'react';
import VideoCard from './video_card';
import { fetchAllChannelVideos } from '@/lib/utils';
import { ProcessedVideo } from '@/core/interfaces';
import { Spinner } from '@/components/ui/loader/_spinner';

interface GalleryVideosProps {
  onItemSelect: (item: any) => void;
}

const GalleryVideos: React.FC<GalleryVideosProps> = ({ onItemSelect }) => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllChannelVideos();
      setVideos(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex items-start justify-center h-screen mt-20">
          <Spinner size={"lg"} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onItemSelect(video)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GalleryVideos;
