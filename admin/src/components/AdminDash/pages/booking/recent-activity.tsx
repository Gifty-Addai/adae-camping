import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import ActivityItem from '../../AdComponents/activityItem';
import { Booking } from '@/core/interfaces';

interface Activity {
  type: 'new_booking' | 'update' | 'cancellation' | 'notification';
  bookingId: string;
  userName: string;
  date: Date;
}

const RecentActivities: React.FC<{bookings: Booking[]}> = ({bookings}) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Generate mock activities based on bookings
    const generatedActivities: Activity[] = bookings
      .slice(-5) // Get the last 5 bookings
      .map((booking) => {
        const types: Activity['type'][] = ['new_booking', 'update', 'cancellation', 'notification'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return {
          type: randomType,
          bookingId: booking._id,
          userName: booking.user.name,
          date: new Date(booking.bookingDate),
        };
      });

    setActivities(generatedActivities.reverse()); // Reverse to show latest first
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Activities
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={index}
              type={activity.type}
              bookingId={activity.bookingId}
              userName={activity.userName}
              date={activity.date}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No recent activities.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
