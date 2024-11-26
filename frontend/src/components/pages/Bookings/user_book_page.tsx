import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Clock, DollarSign, Calendar } from "lucide-react";
import axios from "axios";
import { DotLoader } from "@/components/ui/loader/_dot_loader";
import { Booking } from "@/core/interfaces";
import { Page } from "@/components/ui/page";


const UserBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       const userId = "123"; // Replace with dynamic user ID
  //       const response = await axios.get(`/api/bookings/user/${userId}`);
  //       setBookings(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch bookings:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBookings();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <DotLoader />
  //     </div>
  //   );
  // }

  return (
    <Page
      isLoading={true}
      renderBody={() => (
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-6">My Bookings</h1>

          {bookings.length === 0 ? (
            <p className="text-center text-gray-600">You have no bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <Card key={booking._id} className="p-4 bg-white shadow-md rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{booking.campsite}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <Separator className="mb-4" />
                  <div className="text-gray-700">
                    <p>
                      <Calendar name="calendar" className="inline mr-2" />
                      Camping Date:{" "}
                      <span className="font-medium">
                        {new Date(booking.campingDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <User name="user" className="inline mr-2" />
                      Number of People:{" "}
                      <span className="font-medium">{booking.numberOfPeople}</span>
                    </p>
                    <p>
                      <Clock name="clock" className="inline mr-2" />
                      Booking Date:{" "}
                      <span className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <DollarSign name="dollar" className="inline mr-2" />
                      Total Cost:{" "}
                      <span className="font-medium text-green-600">
                        ${booking.totalCost}
                      </span>
                    </p>
                  </div>
                  {booking.specialRequests && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Special Requests:</h4>
                      <p className="text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={booking.status === "cancelled"}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    />

  );
};

export default UserBookingsPage;
