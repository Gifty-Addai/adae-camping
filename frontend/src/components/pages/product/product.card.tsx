import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Product } from '@/core/interfaces';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from '@/core/store/slice/cart.slice';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.info("product adding", product)
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Card className="w-full h-[380px] rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col border border-gray-200 bg-card relative">

      {/* Product Image */}
      <div className="relative h-40 pt-4 px-4" onClick={() => onOpenModal(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <CardContent className="px-4 flex flex-col justify-between flex-grow">
        {/* Title and Description */}
        <CardHeader className="px-0 py-1">
          <CardTitle className="text-sm font-semibold text-card-foreground">{product.name}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>
        </CardHeader>
      </CardContent>

      {/* Price and Quantity Selector fixed position */}
      <div className="absolute bottom-[80px] left-4 w-full flex justify-start items-center px-4 space-x-2">
        {/* Price */}
        <p className="text-sm font-bold text-card-foreground">
          GHS {product.price.toLocaleString()}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center">
          <Button
            variant="secondary"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              decrementQuantity();
            }}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <p className="mx-3 text-sm font-medium text-card-foreground">{quantity}</p>
          <Button
            className="h-6 w-6 bg-yellow-400 p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              incrementQuantity();
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <CardFooter className="absolute bottom-0 left-0 w-full p-4">
        <Button
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="w-full text-sm"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
