import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './modal';
import { Product } from '@/core/interfaces';
import { Button } from './button';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-lg bg-card rounded-lg shadow-lg p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex justify-center items-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-64 h-64 object-center rounded-lg"
          />
        </div>
        <DialogDescription className="mt-4 text-card-foreground">
          {product.description}
        </DialogDescription>
        <p className="text-xl mt-1 font-bold text-green-500">
          GHS {product.price.toFixed(2)}
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose} className="px-4 py-2">
            Okay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
