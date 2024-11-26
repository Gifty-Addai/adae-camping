// src/components/ProductModal.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './modal';
import { useTranslation } from 'react-i18next';
import { XIcon } from 'lucide-react';
import { Product } from '@/core/interfaces';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {product.name}
            </DialogTitle>
            <button
              className="absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              onClick={onClose}
              aria-label={t('Close')}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md"
            />
            <DialogDescription className="mt-4 text-gray-600 dark:text-gray-300">
              {product.description}
            </DialogDescription>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('Close')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
