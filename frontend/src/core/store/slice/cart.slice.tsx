// src/redux/cartSlice.ts
import { Product } from '@/core/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem extends Product {
  quantity: number;
}

// Define the CartState type for the cart's state
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Initial state for the cart
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create the cart slice with the necessary reducers
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a product to the cart with the specified quantity
    addToCart: (state: CartState, action: PayloadAction<{ product: Product; quantity: number }>) => {
      console.info("product adding in slice", action.payload);
    
      const { product, quantity } = action.payload;
    
      console.log("state id ", state.items)
      // Find the index of the existing product
      const existingItemIndex = state.items.findIndex(item => item._id === product._id);
      console.info("existingItemIndex", existingItemIndex);
    
      // If the product is already in the cart, increase its quantity
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        console.info("pushing", action.payload);
        // If the product is not in the cart, add it
        state.items.push({ ...product, quantity });
      }
    
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    
    // Remove an item from the cart by its ID
    removeItem: (state: CartState, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    // Update the quantity of a specific item in the cart
    updateItemQuantity: (state: CartState, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      
      if (item) {
        item.quantity = quantity;
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    // Clear the cart
    clearCart: (state: CartState) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

// Export the actions and the reducer
export const { addToCart, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
