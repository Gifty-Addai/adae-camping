
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from '@/core/store/slice/cart.slice';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const dispatch = useDispatch();
  // quantity state preserved for future use if needed, defaulting to 1 for quick add
  const [quantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.info("product adding", product);
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group w-full cursor-pointer flex flex-col gap-3">
      {/* Image Container with Hover Effect */}
      <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-xl" onClick={() => onOpenModal(product)}>
        <Link to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`} className="block w-full h-full">
          <div className="w-full h-full p-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
        </Link>

        {/* Quick Actions (Appear on Hover) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button size="icon" className="rounded-full bg-white text-foreground hover:bg-primary hover:text-white shadow-md w-10 h-10" onClick={handleAddToCart}>
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2">
        <Link to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`}>
          <h3 className="text-lg font-serif text-foreground hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-medium text-primary">GHS {product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
