// src/components/Gallery/Tooltip.tsx

import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1 shadow-lg">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
