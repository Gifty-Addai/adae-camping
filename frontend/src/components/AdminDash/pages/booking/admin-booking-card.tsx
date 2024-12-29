import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Booking } from '@/core/interfaces';

interface BookingCardProps extends Booking {
    onCancel: () => void;
    onConfirm: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
    _id,
    user,
    trip,
    numberOfPeople,
    bookingDate,
    payment,
    status,
    onCancel,
    onConfirm,
}) => {
    const statusStyles: Record<typeof status, "secondary" | "default" | "destructive" | "outline"> = {
        pending: 'secondary',
        confirmed: 'default',
        cancelled: 'destructive',
        reschedule: 'outline',
    };

    return (
        <Link to={`/admin/bookings/bookingsDetail/${_id}`}>
            <Card className="w-[300px] rounded-lg shadow-md border border-blue-400 bg-card dark:bg-gray-800 flex flex-col">
                {/* Header */}
                <CardHeader className="flex items-start justify-between p-4">
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-white">
                            {trip.name}
                        </h3>
                        <p className="text-sm text-card-foreground font-medium truncate">
                            {_id}
                        </p>
                        <Badge variant={`${statusStyles[status]}`} className={`py-1 rounded-full text-sm mt-2`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                            Booking Date
                        </Label>
                        <p className="text-sm text-card-foreground font-medium">
                            {new Date(bookingDate).toLocaleDateString()}
                        </p>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="px-4 py-2 flex-grow grid grid-cols-2 gap-y-2">
                    <div>
                        <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                            Customer
                        </Label>
                        <p className="text-base text-card-foreground font-medium">
                            {user.name}
                        </p>
                        
                    </div>
                    <div>
                        <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                            Guests
                        </Label>
                        <p className="text-base text-card-foreground font-medium">
                            {numberOfPeople}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Payment Status
                        </Label>
                        <p className={`text-base font-semibold ${payment ? 'text-green-600' : 'text-red-600'}`}>
                            {payment ? 'Paid' : 'Unpaid'}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Amount
                        </Label>
                        <p className="text-base text-card-foreground font-medium">
                            GHS {trip.cost.basePrice.toFixed(2)}
                        </p>
                    </div>
                    
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent link navigation on button click
                            onConfirm();
                        }}
                        disabled={status === "confirmed"}
                        >
                        Confirm
                    </Button>
                    <Button
                        disabled={status === "cancelled"}
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default BookingCard;
