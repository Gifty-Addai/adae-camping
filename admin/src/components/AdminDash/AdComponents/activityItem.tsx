import React from 'react';
import { CheckCircle, XCircle, Bell, Calendar, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ActivityItemProps {
  type: 'new_booking' | 'update' | 'cancellation' | 'notification';
  bookingId: string;
  userName: string;
  date: Date;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, bookingId, userName, date }) => {
  const getIcon = () => {
    switch (type) {
      case 'new_booking':
        return <UserPlus className="w-5 h-5 text-indigo-600" />;
      case 'update':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancellation':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'notification':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'new_booking':
        return `New booking created by ${userName}`;
      case 'update':
        return `Booking ${bookingId} was updated by ${userName}`;
      case 'cancellation':
        return `Booking ${bookingId} was cancelled by ${userName}`;
      case 'notification':
        return `Notification sent for booking ${bookingId}`;
      default:
        return `Activity on booking ${bookingId}`;
    }
  };

  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="mr-4">
        {getIcon()}
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getDescription()}
        </Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {date.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
