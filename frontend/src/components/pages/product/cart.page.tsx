// src/pages/CartPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartContext from '@/context/cart.context';
import { Button } from '@/components/ui/button';

const CartPage: React.FC = () => {
  const { state, dispatch } = React.useContext(CartContext);
  const { t } = useTranslation();

  const handleIncreaseQuantity = (productId: number) => {
    dispatch({ type: 'INCREASE_QUANTITY', productId });
  };

  const handleDecreaseQuantity = (productId: number) => {
    dispatch({ type: 'DECREASE_QUANTITY', productId });
  };

  const handleRemoveItem = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('Your Cart')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('Your cart is empty.')}</p>
        <Link to="/">
          <Button className="mt-4">{t('Continue Shopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('Your Cart')}</h1>
      <div className="flex flex-col space-y-4">
        <AnimatePresence>
          {state.items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{item.category}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center">
                  <button
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-l"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    aria-label={t('Decrease quantity')}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 dark:bg-gray-600">
                    {item.quantity}
                  </span>
                  <button
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-r"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    aria-label={t('Increase quantity')}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={t('Remove item')}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-8 flex flex-col items-end">
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {t('Subtotal')}: ${state.totalPrice.toFixed(2)}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('Taxes and shipping calculated at checkout.')}
        </p>
        <Button className="mt-4">{t('Proceed to Checkout')}</Button>
      </div>
    </div>
  );
};

export default CartPage;
