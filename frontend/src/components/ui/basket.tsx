// src/components/Basket.tsx

import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartContext from '@/context/cart.context';

const Basket: React.FC = () => {
  const { state } = React.useContext(CartContext);

  return (
    <Link to="/cart" className="relative">
      <ShoppingCartIcon className="h-4 w-4 text-gray-800 dark:text-gray-100" />
      {state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {state.totalItems}
        </span>
      )}
    </Link>
  );
};

export default Basket;
