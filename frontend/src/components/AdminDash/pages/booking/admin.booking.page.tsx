import React from 'react';
import { Page } from '@/components/ui/page';
import BookingsTable from './booking-table';
import Statistics from './booking-statistics';
import RecentActivities from './recent-activity';
import { useBookingAPI } from '@/hooks/booking.hook';
// import RevenueChart from '../components/RevenueChart'; // Optional: If implemented

const AdminBookingPage: React.FC = () => {
    const {
        bookings,
        loading,
        currentPage,
        totalPages,
        goToPage,
        getBookings,
    } = useBookingAPI();


    console.log("Booking fetched", bookings[0])
    return (

        <Page
            renderBody={() => (
                <div className=''>
                    {/* Statistics */}
                    <Statistics
                        bookings={bookings}
                    />

                    {/* Revenue Chart */}
                    {/* Uncomment if RevenueChart is implemented */}
                    {/* <div className="mt-6">
            <RevenueChart />
          </div> */}

                    {/* Bookings Table */}
                    <BookingsTable
                        loading={loading}
                        bookings={bookings}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={goToPage}
                        getBookings={getBookings}

                    />

                    {/* Recent Activities */}
                    <RecentActivities
                        bookings={bookings}
                    />
                </div>
            )}
        />
    );
};

export default AdminBookingPage;
