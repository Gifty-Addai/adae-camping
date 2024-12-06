// src/pages/CartPage.tsx

import React, { useState } from 'react';
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
import { bookingSchema } from '@/core/interfaces/zod';
import { BookingFormValues, PaymentInitializationResponse } from '@/core/interfaces';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import PaystackPop from '@paystack/inline-js';
import { postRequest } from '@/lib/utils';
import InvoiceModal from './payment_instruction_modal';
import TransactionModal from './transaction.modal';

const CartPage: React.FC = () => {
    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            preferences: "",
        },
    });

    const cart = useSelector((state: RootState) => state.cart);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerify, setIsVerifyModal] = useState(false);
    const [isSucces, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<BookingFormValues | null>(null);

    const onSubmit = (data: BookingFormValues) => {
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

    const handleCheckout = async (formData: BookingFormValues) => {
        try {
            const response = await postRequest<PaymentInitializationResponse>('/api/auth/payment', {
                ...formData,
                amount: Math.round(cart.totalPrice),
            });

            if (response.success) {
                const popup = new PaystackPop();

                const transactionOptions = {
                    key: 'pk_live_c8527e2f21c94ad8cbb07b2e10a881f556fc025c',
                    email: formData.email,
                    amount: response.amount,
                    phone :formData.phone,
                    reference: response.reference,
                    onSuccess: () => {
                        // await handleTransactionSuccess(tranx, response.reference);

                        setIsVerifyModal(true);
                        setIsSuccess(true);

                    },
                    onCancel: () => {
                        toast.error("Transaction was cancelled");
                        setIsVerifyModal(true);
                        setIsSuccess(false);
                    },
                    onError:() => {
                        // await handleTransactionSuccess(error, response.reference);
                        setIsVerifyModal(true);
                        setIsSuccess(false);
                    },
                };
                popup.newTransaction(transactionOptions);
            } else {
                toast.error('Payment initialization failed!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Payment initialization failed! Check Internet and Retry');
        }
    };


    // const handleTransactionSuccess = async (tranx: any, reference: string) => {
    //     try {
    //         console.log("Transaction Successful:", tranx);

    //         const verifyResponse = await getRequest<VerifyPaymentResponse>(`/api/auth/verifypayment/${reference}`);

    //         if (verifyResponse.success) {
    //             setIsVerifyModal(true);
    //             setIsSuccess(true);
    //         } else {
    //             setIsVerifyModal(true);
    //             setIsSuccess(false);
    //         }
    //     } catch (error) {
    //         console.error("Verification failed:", error);
    //         setIsVerifyModal(true);
    //         setIsSuccess(false);
    //     }
    // };

    if (cart.totalItems === 0) {
        return (
            <div className="flex justify-center items-center flex-col text-center p-8 mt-24 h-screen">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Your Cart is Empty! 🛒
                </h3>
                <p className="text-gray-500 mb-4">
                    You have no items in your cart. Start shopping now and add products to your cart!
                </p>

                <Link to="/products">
                    <Button>
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 mt-16">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">Your Cart</h2>
            {/* Cart Items and Invoice Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Package Details */}
                <div className="col-span-2 rounded-lg shadow-lg p-6">
                    {cart.items.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
                        <div className="font-semibold text-lg">Total: </div>
                        <div className="text-xl font-semibold text-gray-700">
                            GHS {cart.totalPrice.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="col-span-1 bg-card rounded-lg shadow-lg p-6">
                    <h3 className="text-xl text-white font-bold mb-4">One step away to have your gears</h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-card-foreground'>Full Name</FormLabel>
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
                                        <FormLabel className='text-card-foreground'>Address</FormLabel>
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
                                        <FormLabel className='text-card-foreground'>Phone</FormLabel>
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
                                        <FormLabel className='text-card-foreground'>Email</FormLabel>
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
                                        <FormLabel className='text-card-foreground'>Note(s)</FormLabel>
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
    );

};

export default CartPage;
