// src/components/booking/PaymentInfo.tsx
import React from "react";

interface PaymentInfoProps {
  data: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  updateData: (data: any) => void;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
      <form className="space-y-4">
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={data.cardNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={data.expiryDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="cvv"
          placeholder="CVV"
          value={data.cvv}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
};

export default PaymentInfo;
