// src/contexts/CartContext.tsx

import { CartItem, Product, ProviderType } from '@/core/interfaces';
import React, { createContext, useReducer } from 'react';

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find((item) => item.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.productId),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<ProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export default CartContext;
