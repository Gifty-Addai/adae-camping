import { CartItem, Product, ProviderType } from '@/core/interfaces';
import React, { createContext, useReducer } from 'react';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number } // Modified to include `quantity`
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'INCREASE_QUANTITY'; productId: number }
  | { type: 'DECREASE_QUANTITY'; productId: number }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const cartReducer = (state: CartState, action: Action): CartState => {
  let updatedItems = [...state.items];
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = updatedItems.find((item) => item.id === action.product.id);
      if (existingItem) {
        existingItem.quantity += action.quantity; // Increment quantity
      } else {
        updatedItems.push({ ...action.product, quantity: action.quantity }); // Add new item with specified quantity
      }
      break;

    case 'REMOVE_FROM_CART':
      updatedItems = updatedItems.filter((item) => item.id !== action.productId);
      break;

    case 'INCREASE_QUANTITY':
      updatedItems = updatedItems.map((item) =>
        item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      break;

    case 'DECREASE_QUANTITY':
      updatedItems = updatedItems.map((item) =>
        item.id === action.productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      break;

    case 'CLEAR_CART':
      updatedItems = [];
      break;

    default:
      return state;
  }

  const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items: updatedItems,
    totalItems,
    totalPrice,
  };
};

export const CartProvider: React.FC<ProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export default CartContext;
