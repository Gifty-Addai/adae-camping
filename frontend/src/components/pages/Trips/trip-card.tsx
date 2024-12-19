import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Trip } from "@/core/interfaces";
import React from "react";
import { Star, CalendarDays, Activity, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface TripCardProp {
  trip: Trip;
}

const TripCard: React.FC<TripCardProp> = ({ trip }) => {
  return (
    <Link to={`/ASGSDWSDZ-234ADFSDAS/trip/${trip?._id}`} className="block">
      <Card className="w-full bg-gray-700 h-96 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
        {/* Card Header with Overlay */}
        <CardHeader className="p-0 relative">
          <img
            className="w-full h-36 object-cover"
            src={trip?.images?.[0] || "/placeholder.jpg"}
            alt={trip?.name || "Trip Image"}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-90"></div>

          {/* Category Badge */}
          <span className="absolute top-2 left-2 bg-green-500 text-xs text-white font-semibold px-2 py-1 rounded-full">
            {trip?.type || "Hiking"}
          </span>
        </CardHeader>

        {/* Card Content */}  
        <CardContent className="py-4 px-2 flex flex-col justify-between h-[calc(100%-9rem)]">
          {/* Trip Title */}
          <h5 className="text-lg font-semibold text-white  line-clamp-2">
            {trip?.name}
          </h5>

          {/* Ratings */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-xs text-gray-300 ml-2">(121 Reviews)</span>
          </div>

          {/* Trip Details */}
          <div className="space-y-2 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-green-400" />
              <span>
                <strong>Days:</strong> {trip?.duration?.days || 3}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>
                <strong>Activity Level:</strong> {trip?.activityLevel || 2}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span>
                <strong>Member:</strong> GHS {trip?.cost?.basePrice}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span>
                <strong>Non-Member:</strong> GHS{" "}
                {trip?.cost?.basePrice! + (trip?.cost?.discount || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TripCard;
