import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './modal';
import { Product } from '@/core/interfaces';
import { Button } from './button';
import { addToCart } from '@/core/store/slice/cart.slice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product !== null) {
      console.info("product adding", product);
      dispatch(addToCart({ product, quantity }));
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Product is unavailable.");
    }
  };
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
          <Button variant={"secondary"} onClick={onClose} className="px-4 py-2">
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full ml-10 text-sm"
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
