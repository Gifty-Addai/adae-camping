// src/components/Gallery/FeaturedContent.tsx

import React from 'react';

const featuredItems = [
  { id: 1, src: '/images/featured1.jpg', title: 'Epic Sunrise', description: 'A breathtaking sunrise over the mountains.' },
  { id: 2, youtubeId: '3JZ_D3ELwOQ', title: 'Tech Innovations', description: 'Exploring the latest gadgets.' },
];

interface FeaturedContentProps {
  onItemSelect: (item: any) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ onItemSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {featuredItems.map((item) => (
        <div
          key={item.id}
          className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
          onClick={() => onItemSelect(item)}
        >
          {item.src ? (
            <img src={item.src} alt={item.title} className="w-full h-64 object-cover" />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}`}
              className="w-full h-64"
              allowFullScreen
            ></iframe>
          )}
          <div className="absolute bottom-0 bg-primary bg-opacity-50 p-4 text-white">
            <h3 className="text-md font-bold text-white">{item.title}</h3>
            <p className="text-xs text-white">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedContent;
