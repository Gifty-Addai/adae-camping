// src/components/CartItem.tsx
import { Button } from '@/components/ui/button';
import { removeItem, updateItemQuantity } from '@/core/store/slice/cart.slice';
import React from 'react';
import { useDispatch } from 'react-redux';

interface CartItemProps {
  item: {
    _id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(removeItem(item._id));
  };

  console.info("cartitem", item.imageUrl)

  const handleUpdateQuantity = (quantity: number) => {
    dispatch(updateItemQuantity({ id: item._id, quantity }));
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={item.imageUrl} alt={item.name} className="text-card-foreground h-16 w-16 object-fill" />

        <div>
          <h4 className="font-semibold text-card-foreground">{item.name}</h4>
          <p className="text-sm text-card-foreground">GHS {item.price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={"destructive"}
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          size={"icon"}
        >
          -
        </Button>
        <span className='text-white'>{item.quantity}</span>
        <Button onClick={() => handleUpdateQuantity(item.quantity + 1)} size={"icon"} >
          +
        </Button>
        <Button size={"sm"} variant={"destructive-outline"} onClick={handleRemoveItem} className="text-red-500">
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
