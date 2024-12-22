
import PaystackPop from '@paystack/inline-js';
import { toast } from 'react-toastify';
import {
    InitializePaymentParams,
    PaymentInitializationResponse,
    PaymentOptions
} from '@/core/interfaces';
import { postRequest } from './api-Request/api-requests';
import { isApiError } from '@/core/interfaces/guards';


export const initializePayment = async ({
    formData,
    totalAmount,
    onSuccess,
    onCancel,
    onError,
    onLoad,
}: InitializePaymentParams): Promise<void> => {
    try {
        const response = await postRequest<PaymentInitializationResponse>('/api/auth/payment', {
            ...formData,
            amount: Math.round(totalAmount),
        });

        const popup = new PaystackPop();


        const paymentOptions: PaymentOptions = {
            key: 'pk_test_2a9d02701fc28f595123210b9bebc13c324b9c0d',
            email: formData.email,
            amount: response?.amount || 0,
            phone: formData.phone,
            reference: response?.reference || "",
            metadata: {
                custom_fields: [
                    {
                        display_name: "Name",
                        variable_name: "name",
                        value: formData.name,
                    },
                    {
                        display_name: "Address",
                        variable_name: "address",
                        value: formData.address,
                    },
                    {
                        display_name: "Preferences",
                        variable_name: "preferences",
                        value: formData.preferences || "N/A",
                    },
                ],
            },
            onSuccess: (tranx) => {
                // Default behavior
                toast.success('Payment Successful!');
                // Execute custom callback if provided
                if (onSuccess) onSuccess(tranx);
            },
            onCancel: () => {
                // Default behavior
                toast.error('Transaction was cancelled');
                // Execute custom callback if provided
                if (onCancel) onCancel();
            },
            onError: (error) => {
                // Default behavior
                toast.error('An error occurred during the transaction');
                // Execute custom callback if provided
                if (onError) onError(error);
            },
            onLoad: (tranx) => {
                // Optionally handle load event
                if (onLoad) onLoad(tranx);
            },
        };

        popup.newTransaction(paymentOptions);

    } catch (error) {
        if (isApiError(error)) {
            toast.info(`${error.message}`);
        } else {
            console.error( error);
            toast.error('An unexpected error occurred while creating the booking.');
        }
    }
};
