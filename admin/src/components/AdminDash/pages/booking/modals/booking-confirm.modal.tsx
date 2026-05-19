// src/components/ConfirmModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <Card className="w-96">
        <CardHeader className="flex justify-between items-center">
          <h2
            className="text-lg font-semibold text-gray-800 dark:text-gray-200"
            id="confirm-modal-title"
          >
            {title}
          </h2>
          <Button
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="py-4">
          <p
            className="text-gray-700 dark:text-gray-300"
            id="confirm-modal-description"
          >
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmModal;
