import React from 'react';
import { Product } from '@/core/interfaces';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import 'react-toastify/dist/ReactToastify.css';
import { Eye } from 'lucide-react';

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
    <Card className="w-full h-[380px] rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col bg-[#2a2a2a] border border-[#3d3d3d] hover:border-[#8b7355] relative">

      {/* Product Image */}
      <div className="relative h-40 pt-4 px-4 bg-[#353535] rounded-t-2xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <CardContent className="px-4 flex flex-col justify-between flex-grow">
        {/* Title and Description */}
        <CardHeader className="px-0 py-2">
          <CardTitle className="text-base font-semibold text-gray-100">{product.name}</CardTitle>
          <CardDescription className="text-sm line-clamp-2 text-gray-400">{product.description}</CardDescription>
        </CardHeader>
      </CardContent>

      {/* Price */}
      <div className="absolute bottom-[80px] left-4 w-full flex justify-start items-center px-4">
        <p className="text-lg font-bold text-[#d4c5a9]">
          GHS {product.price.toLocaleString()}
        </p>
      </div>

      {/* Admin Actions */}
      <CardFooter className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center border-t border-[#3d3d3d]">
        <div className="flex items-center gap-2 text-gray-400 bg-[#353535] px-3 py-1.5 rounded-full text-xs font-medium">
          <Eye size={14} className="text-[#8b7355]" />
          <span>{product.clickCount || 0} Views</span>
        </div>
        <Button
          className="bg-[#8b7355] hover:bg-[#6d5a44] text-white"
          onClick={handleEditProduct}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminProductCard;
