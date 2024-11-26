// ParallaxStars.tsx
import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const ParallaxStars: React.FC = () => {
  const { scrollY } = useViewportScroll();
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <motion.div
      style={{ y: y2 }}
      className="absolute inset-0 bg-black"
    >
      {/* Star Field */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Use CSS or SVG to render stars */}
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
    </motion.div>
  );
};

export default ParallaxStars;
