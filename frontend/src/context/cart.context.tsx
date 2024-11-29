import React, { createContext, useReducer, ReactNode } from 'react';

// Define initial state for the cart
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Define action types
type CartAction =
  | { type: 'ADD_TO_CART'; product: CartItem; quantity: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_ITEM_QUANTITY'; id: string; quantity: number };

// Reducer to handle cart actions
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return calculateCartTotals(updatedItems);
      } else {
        const updatedItems = [...state.items, { ...product, quantity }];
        return calculateCartTotals(updatedItems);
      }
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.id);
      return calculateCartTotals(updatedItems);
    }
    case 'UPDATE_ITEM_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
      return calculateCartTotals(updatedItems);
    }
    default:
      return state;
  }
};

// Helper function to calculate totals
const calculateCartTotals = (items: CartItem[]): CartState => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { items, totalItems, totalPrice };
};

// Create CartContext with proper types
interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined); // Using undefined to avoid accessing context outside provider

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Export CartContext and CartContextType
export { CartContext, CartProvider };
export type { CartContextType };
