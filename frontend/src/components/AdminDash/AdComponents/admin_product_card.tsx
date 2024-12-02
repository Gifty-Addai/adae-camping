import React from 'react';
import { Product } from '@/core/interfaces';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import 'react-toastify/dist/ReactToastify.css';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({ product, onEdit }) => {

  const handleEditProduct = () => {
    onEdit(product);
  };

  return (
    <Card className="w-full h-[380px] rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col border border-gray-200 bg-card relative">
      
      {/* Product Image */}
      <div className="relative h-40 pt-4 px-4">
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

      {/* Price */}
      <div className="absolute bottom-[80px] left-4 w-full flex justify-start items-center px-4">
        <p className="text-sm font-bold text-card-foreground">
          GHS {product.price.toLocaleString()}
        </p>
      </div>

      {/* Admin Actions */}
      <CardFooter className="absolute bottom-0 left-0 w-full p-4 space-x-2 flex justify-between">
        <Button
          variant="default"
          onClick={handleEditProduct}
          
        >
          Edit
        </Button>
      
      </CardFooter>
    </Card>
  );
};

export default AdminProductCard;
