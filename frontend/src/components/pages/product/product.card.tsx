import React, { useState } from 'react';
import { ShoppingCartIcon, StarIcon, MinusIcon, PlusIcon, HeartIcon } from 'lucide-react';
import { Product } from '@/core/interfaces';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import CartContext from '@/context/cart.context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Images } from '@/assets/assets';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', product, quantity });
    toast.success(`${product.name} ${t('added to cart!')}`);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Card
    className="w-full h-[380px] rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col border border-gray-200 bg-white"
    >
      {/* Favorite Icon */}
      <HeartIcon className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer" />

      {/* Product Image */}
      <div className="relative h-28 pt-4" onClick={() => onOpenModal(product)}>
        <img
          src={Images.Tent}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <CardContent className="flex-grow flex flex-col justify-between px-4">
        {/* Title and Description */}
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{product.name}</CardTitle>
          <CardDescription className="text-xs">
            {product.description}
          </CardDescription>
        </CardHeader>

        {/* Price and Ratings */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bol">
            GHS {product.price.toLocaleString()}
          </p>
          {/* <div className="flex items-center text-yellow-500">
            <StarIcon className="h-4 w-4" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div> */}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              className="h-6 w-6 p-0 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <p className="mx-3 text-sm font-medium">{quantity}</p>
            <Button
              variant="outline"
              className="h-6 w-6 p-0 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                incrementQuantity();
              }}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter className="p-4">
        <Button
        variant="default"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="w-full text-sm"
        >
          {t('Add to Cart')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
