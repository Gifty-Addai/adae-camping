// InvoiceModal.tsx

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'; 
import { Button } from '@/components/ui/button';
import { BookingFormValues } from '@/core/interfaces';
import { toast } from 'react-toastify'; 

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    formData: BookingFormValues;
    handleCheckout: (data: BookingFormValues) => Promise<void>;
}

const DELIVERY_FEE = 35;

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, totalPrice, formData, handleCheckout }) => {
    const [isProcessing, setIsProcessing] = React.useState(false);

    const onProceedToCheckout = async () => {
        setIsProcessing(true);
        try {
            await handleCheckout(formData); 

            onClose();
        } catch (error) {
            console.error('Checkout failed:', error);
            toast.error('Checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-w-full p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-card-foreground mb-2">Invoice Details</DialogTitle>
                    <DialogDescription className="text-card-foreground">
                        Review your order and proceed to payment.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-2 ">
                    <div className="flex justify-between">
                        <span className="font-medium text-yellow-300">Cart Total:</span>
                        <span className='text-card-foreground'>GHS {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-yellow-300 ">Delivery Fee:</span>
                        <span className='text-card-foreground'>GHS {DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span className='text-yellow-300'>Final Amount:</span>
                        <span className='text-card-foreground'>GHS {(totalPrice + DELIVERY_FEE).toFixed(2)}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={onProceedToCheckout}
                        disabled={isProcessing}
                        className="w-full flex justify-center items-center"
                    >
                        {isProcessing ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"
                                    viewBox="0 0 24 24"
                                />
                                Processing...
                            </>
                        ) : (
                            `Proceed to Checkout (GHS ${(totalPrice + DELIVERY_FEE).toFixed(2)})`
                        )}
                    </Button>
                </DialogFooter>

                {/* Close Button */}
                <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceModal;
