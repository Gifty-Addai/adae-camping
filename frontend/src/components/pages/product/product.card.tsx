
import React, { useState } from 'react';
import { PlusIcon, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/core/store/slice/cart.slice';
import { Link, useNavigate } from 'react-router-dom';



interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.info("product adding", product);
    dispatch(addToCart({ product, quantity }));


    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product.name,
        content_category: product.name,
        content_ids: [product._id],
        content_type: "product",
        value: product.price,
        currency: "GHS",
        quantity: quantity,
      })
    }


  };

  const handleOpenDetails = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product._id],
        content_type: "product",
        value: product.price,
        currency: "GHS",
      })
    }

    navigate(`/product/${encodeURIComponent(product.name.substring(0, 30))}/${productId}`);
  };
  return (
    <div className="group w-full cursor-pointer">
      {/* Modern Tallow Card Container */}
      <div className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1d1d1d] rounded-2xl overflow-hidden border border-[#3d3d3d] transition-all duration-500 hover:border-[#8b7355] hover:shadow-2xl hover:shadow-amber-950/30">

        {/* Image Container */}
        <div onClick={(e) => handleOpenDetails(e, product._id)} className="block cursor-pointer">
          <div className="relative aspect-square w-full overflow-hidden">
            {/* Product Image */}
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 pointer-events-none">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gradient Overlay on Hover — pointer-events-none so it never intercepts taps */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Quick View Button - Appears on hover */}
            <div className="absolute top-3 right-3 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="icon"
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black shadow-lg w-9 h-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenModal(product);
                }}
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 space-y-2">
          <Link to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`}>
            <h3 className="text-base font-serif text-white group-hover:text-[#d4c5a9] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem]">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-[#d4c5a9]">
              GHS {product.price.toLocaleString()}
            </span>

            <Button
              size="icon"
              className="rounded-full bg-[#8b7355] hover:bg-[#6d5a44] text-white shadow-lg w-9 h-9 transform transition-all duration-300 hover:scale-110 hover:rotate-12"
              onClick={handleAddToCart}
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Subtle shine effect — pointer-events-none so it never intercepts taps */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </div>
  );
};

export default ProductCard;
