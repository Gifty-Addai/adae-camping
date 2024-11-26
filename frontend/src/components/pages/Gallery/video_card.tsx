import { ProcessedVideo } from '@/core/interfaces';
import React from 'react';

interface VideoCardProps {
  video: ProcessedVideo,
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg bg-card cursor-pointer max-w-xs"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-40  object-cover"
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
          ▶
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white  line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-card-foreground mt-1">{video.views} Views</p>
        <p className="text-xs text-card-foreground mt-2 line-clamp-3">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
