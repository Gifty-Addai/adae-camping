// ContentSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Item {
  title: string;
  description: string;
}

interface ContentSectionProps {
  title: string;
  description?: string;
  items?: Item[];
  images?: string[];
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  items,
  images,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className="container mx-auto px-4 text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold mb-6">{title}</h2>
      {description && (
        <p className="text-lg text-gray-300 mb-8">{description}</p>
      )}
      {items && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-card p-6 rounded-md shadow-lg"
            >
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      )}
      {images && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.img
              key={index}
              whileHover={{ scale: 1.05 }}
              src={`/images/${image}`}
              alt={`Image ${index + 1}`}
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ContentSection;
