// import React, { useContext } from 'react';
// import { ShoppingCartIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import CartContext from '@/context/cart.context';

// const Basket: React.FC = () => {
//   const { state } = useContext(CartContext);

//   return (
//     <Link to="/cart" className="relative flex items-center">
//       <ShoppingCartIcon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
      
//       {/* Display total items in cart */}
//       {state.totalItems > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
//           {state.totalItems}
//         </span>
//       )}

//       {/* Display total price of the cart */}
//       {state.totalItems > 0 && (
//         <span className="ml-2 text-gray-800 dark:text-gray-100 text-sm font-semibold">
//           ${state.totalPrice.toFixed(2)}
//         </span>
//       )}
//     </Link>
//   );
// };

// export default Basket;
