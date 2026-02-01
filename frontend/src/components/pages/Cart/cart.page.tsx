// src/pages/CartPage.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './cart_item';
import { RootState } from '@/core/store/store';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';

const CartPage: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (isFirstLoad) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            setIsFirstLoad(false);
        }
    }, [isFirstLoad]);

    if (cart.totalItems === 0) {
        return (
            <Page
                pageTitle='cart'
                renderBody={() => (
                    <div className='flex justify-center flex-col text-center mt-3'>
                        <h3 className="text-xl font-semibold text-gray-100 mb-2">
                            Your Cart is Empty! 🛒
                        </h3>
                        <p className="text-gray-400 mb-4">
                            You have no items in your cart. Start shopping now and add products to your cart!
                        </p>

                        <Link to="/products">
                            <Button>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            />

        );
    }

    return (
        <Page
            pageTitle='cart'
            renderBody={() => (
                <div className='container mx-auto mt-3'>
                    <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Your Cart</h2>
                    {/* Cart Items and Invoice Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        {/* Package Details */}
                        <div className="col-span-2 bg-[#2a2a2a] rounded-2xl shadow-lg p-6 border border-[#3d3d3d]">
                            {cart.items.map((item) => (
                                <CartItem key={item._id} item={item} />
                            ))}
                            <div className="flex justify-between items-center mt-6 p-4 bg-[#1d1d1d] rounded-lg border border-[#3d3d3d]">
                                <div className="font-semibold text-lg text-gray-100">Total: </div>
                                <div className="text-xl font-semibold text-[#d4c5a9]">
                                    GHS {cart.totalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="col-span-1 bg-[#2a2a2a] rounded-2xl shadow-lg p-6 border border-[#3d3d3d] h-fit sticky top-24">
                            <h3 className="text-xl text-gray-100 font-bold mb-6">Order Summary</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span>GHS {cart.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-[#3d3d3d] pt-4">
                                    <div className="flex justify-between items-center text-xl font-bold text-white mb-2">
                                        <span>Total</span>
                                        <span>GHS {cart.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-6">Tax included. Shipping calculated at checkout.</p>
                                </div>

                                <Link to="/checkout" className="w-full block">
                                    <Button className="w-full bg-[#4A6741] hover:bg-[#3a5232] text-white h-12 text-lg font-medium shadow-lg hover:shadow-[#4A6741]/20 transition-all">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <div className="text-center">
                                    <Link to="/products" className="text-sm text-gray-400 hover:text-[#4A6741] underline transition-colors">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default CartPage;
