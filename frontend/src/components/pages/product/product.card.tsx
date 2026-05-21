
import React, { useState } from 'react';
import { PlusIcon, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/core/store/slice/cart.slice';
import { Link } from 'react-router-dom';



interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const dispatch = useDispatch();
  const [quantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.info("product adding", product);
    dispatch(addToCart({ product, quantity }));
  };

  return (
    <div className="group w-full cursor-pointer">
      {/* Modern Tallow Card Container */}
      <div className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1d1d1d] rounded-3xl overflow-hidden border border-[#3d3d3d] transition-all duration-500 hover:border-[#8b7355] hover:shadow-2xl hover:shadow-amber-950/30">

        {/* Image Container */}
        <Link to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`} className="block">
          <div className="relative aspect-square w-full bg-[#353535] overflow-hidden">
            {/* Product Image */}
            <div className="absolute inset-0 p-8 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Quick View Button - Appears on hover */}
            <div className="absolute top-4 right-4 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="icon"
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black shadow-lg w-10 h-10"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenModal(product);
                }}
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Link>

        {/* Product Details Section */}
        <div className="p-6 space-y-3">
          <Link to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`}>
            <h3 className="text-xl font-serif text-white group-hover:text-[#d4c5a9] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-[#d4c5a9]">
              GHS {product.price.toLocaleString()}
            </span>

            <Button
              size="icon"
              className="rounded-full bg-[#8b7355] hover:bg-[#6d5a44] text-white shadow-lg w-12 h-12 transform transition-all duration-300 hover:scale-110 hover:rotate-12"
              onClick={handleAddToCart}
            >
              <PlusIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </div>
  );
};

export default ProductCard;
