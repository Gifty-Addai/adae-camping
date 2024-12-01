import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalPrice }) => {
  const [referenceNumber] = useState(generateReferenceNumber());

  // Function to generate a random reference number
  function generateReferenceNumber() {
    return Math.floor(Math.random() * 1000000).toString();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className="hidden">Open Modal</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Payment Instructions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Please use the following details to complete your payment through MoMo (Mobile Money).
          </p>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold text-lg text-gray-900">Payment Reference: </p>
            <p className="text-xl text-gray-700">{referenceNumber}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg text-gray-800">Payment Steps:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open your MoMo app on your mobile phone.</li>
              <li>Select "Pay Bill" or "Pay Merchant."</li>
              <li>Enter the following details:</li>
              <ul className="list-disc pl-5">
                <li><strong>Merchant Code:</strong> 123456789</li>
                <li><strong>Amount:</strong> GHS {totalPrice.toFixed(2)}</li>
                <li><strong>Reference Number:</strong> {referenceNumber}</li>
              </ul>
              <li>Confirm the transaction and complete the payment.</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <Button onClick={onClose} className="bg-green-500 text-white hover:bg-green-600">
              I Have Completed Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
