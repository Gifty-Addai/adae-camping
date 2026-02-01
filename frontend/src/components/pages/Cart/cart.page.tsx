// src/pages/CartPage.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './cart_item';
import { RootState } from '@/core/store/store';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartSchema } from '@/core/interfaces/zod';
import { CartFormValues } from '@/core/interfaces';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import InvoiceModal from './payment_instruction_modal';
import TransactionModal from './transaction.modal';
import { initializePayment } from '@/lib/payment-handler';
import { Page } from '@/components/ui/page';

const CartPage: React.FC = () => {
    const form = useForm<CartFormValues>({
        resolver: zodResolver(CartSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "GH-",
            preferences: "",
        },
    });

    const cart = useSelector((state: RootState) => state.cart);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerify, setIsVerifyModal] = useState(false);
    const [isSucces, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<CartFormValues | null>(null);
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

    const onSubmit = (data: CartFormValues) => {
        console.log("Invoice (direct from onSubmit)", data);
        setFormData(data);
        setIsModalOpen(true);
    };


    // const verifyPayment = async (reference: string) => {
    //     try {
    //         const response = await getRequest<PaymentVerifyResponse>(`/api/auth/verifypayment/${reference}`);

    //         if (response.status) {
    //             return { success: true };
    //         } else {
    //             return { success: false };
    //         }
    //     } catch (error) {
    //         console.error('Error verifying payment:', error);
    //         return { success: false };
    //     }
    // };

    const handleCheckout = async (formData: CartFormValues) => {

        await initializePayment({
            formData: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                preferences: formData.preferences
            },
            totalAmount: cart.totalPrice,
            onSuccess: (tranx) => {
                console.info("tranx data", tranx);
                setIsVerifyModal(true);
                setIsSuccess(true);
            },
            onCancel: () => {
                toast.error("Transaction was cancelled");
                setIsVerifyModal(true);
                setIsSuccess(false);
            },
            onError: () => {
                setIsVerifyModal(true);
                setIsSuccess(false);
            },
        });
    };



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

                        {/* Booking Form */}
                        <div className="col-span-1 bg-[#2a2a2a] rounded-2xl shadow-lg p-6 border border-[#3d3d3d]">
                            <h3 className="text-xl text-center text-gray-100 font-bold mb-4">One step away to have your product(s)</h3>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Full Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Address(GH-Region-City/Town) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter specific address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Phone *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your phone number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Email *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="preferences"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-gray-300'>Note(s)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter preferences (optional)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full">
                                        View Invoice
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Invoice Modal */}
                    {formData && (
                        <InvoiceModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            totalPrice={cart.totalPrice}
                            formData={formData}
                            handleCheckout={handleCheckout}
                        />
                    )}
                    <TransactionModal
                        isOpen={isVerify}
                        onClose={() => setIsVerifyModal(false)}
                        isSuccess={isSucces}

                    />
                </div>
            )}
        />
    );

};

export default CartPage;
