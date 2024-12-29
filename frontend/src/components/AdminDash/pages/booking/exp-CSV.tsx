// src/utils/exportToCSV.ts
import { Booking } from '@/core/interfaces';
import { toast } from 'react-toastify';

export const exportToCSV = (data: Booking[], filename: string) => {
  if (!data || data.length === 0) {
    toast.error('No bookings selected for export.');
    return;
  }

  const csvRows = [];

  // Define headers
  const headers = [
    'Booking ID',
    'Customer Name',
    'Destination',
    'Participating',
    'Number of People',
    'Booking Date',
    'Payment Status',
    'Status',
    'Reschedule Date',
    'Created At',
    'Updated At',
  ];
  csvRows.push(headers.join(','));

  // Populate rows
  for (const booking of data) {
    const row = [
      booking._id,
      booking.user.name,
      booking.trip.name,
      booking.participing ? 'Yes' : 'No',
      booking.numberOfPeople.toString(),
      new Date(booking.bookingDate).toLocaleDateString(),
      booking.payment ? 'Paid' : 'Unpaid',
      booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      booking.rescheduleDate
        ? new Date(booking.rescheduleDate).toLocaleDateString()
        : 'N/A',
      new Date(booking.createdAt).toLocaleDateString(),
      new Date(booking.updatedAt).toLocaleDateString(),
    ];
    csvRows.push(row.map((value) => `"${value}"`).join(','));
  }

  // Create CSV string
  const csvContent = csvRows.join('\n');

  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger download
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
