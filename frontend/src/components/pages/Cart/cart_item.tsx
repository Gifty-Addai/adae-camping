// src/components/CartItem.tsx
import { removeItem, updateItemQuantity } from '@/core/store/slice/cart.slice';
import React from 'react';
import { useDispatch } from 'react-redux';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(removeItem(item.id));
  };

  const handleUpdateQuantity = (quantity: number) => {
    dispatch(updateItemQuantity({ id: item.id, quantity }));
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={item.image} alt={item.name} className="h-16 w-16 object-cover" />
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-sm text-gray-500">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="bg-gray-200 px-2 py-1 rounded"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleUpdateQuantity(item.quantity + 1)} className="bg-gray-200 px-2 py-1 rounded">
          +
        </button>
        <button onClick={handleRemoveItem} className="text-red-500">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
