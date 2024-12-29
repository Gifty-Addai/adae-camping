// src/components/Statistics.tsx
import React from 'react';
import {
  Book,
  CheckCircle,
  Clock,
  Trash2,
  DollarSign,
} from 'lucide-react';
import StatisticsCard from '../../AdComponents/booking-statistics-card';
import { Booking } from '@/core/interfaces';

const Statistics: React.FC<{bookings: Booking[]}> = ({bookings}) => {
  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.trip.cost?.basePrice || 0) * b.numberOfPeople, 0); // Assuming trip.cost has an amount field

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatisticsCard
        title="Total Bookings"
        value={totalBookings}
        icon={<Book className="w-3 h-3 text-indigo-600" />}
        color="bg-indigo-600"
      />
      <StatisticsCard
        title="Confirmed"
        value={confirmedBookings}
        icon={<CheckCircle className="w-3 h-3 text-green-500" />}
        color="bg-green-500"
      />
      <StatisticsCard
        title="Pending"
        value={pendingBookings}
        icon={<Clock className="w-3 h-3 text-yellow-500" />}
        color="bg-yellow-500"
      />
      <StatisticsCard
        title="Cancelled"
        value={cancelledBookings}
        icon={<Trash2 className="w-3 h-3 text-red-500" />}
        color="bg-red-500"
      />
      <StatisticsCard
        title="Total Revenue"
        value={`GHS ${totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="w-3 h-3 text-blue-500" />}
        color="bg-blue-500"
      />
    </div>
  );
};

export default Statistics;
