// src/pages/CartPage.tsx
import React from 'react';
import {  useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './cart_item';
import { RootState } from '@/core/store/store';
import { Button } from '@/components/ui/button';

const CartPage: React.FC = () => {
    // const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
    };

    if (cart.totalItems === 0) {
        return (
            <div className="flex justify-center items-center flex-col text-center p-8 mt-24">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Your Cart is Empty! 🛒
                </h3>
                <p className="text-gray-500 mb-4">
                    You have no items in your cart. Start shopping now and add products to your cart!
                </p>

                <Link to="/products">
                    <Button >
                        Continue Shopping
                    </Button>
                </Link>

            </div>
        );
    }

    return (
        <div className="mt-24 p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

            {/* Cart Items */}
            <div className="space-y-4">
                {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            {/* Cart Summary */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="font-semibold text-lg">Total: </div>
                <div className="text-xl font-semibold text-gray-700">
                    ${cart.totalPrice.toFixed(2)}
                </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
                <Button onClick={handleCheckout} >
                    Proceed to Checkout
                </Button>

            </div>
        </div>
    );
};

export default CartPage;
