// TripCard.jsx
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Trip } from "@/core/interfaces";
import { Star, CalendarDays, Activity, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TripCardProps {
  trip: Trip;
  isAdmin?: boolean; // Determines the context
  onEdit?: (trip: Trip) => void;
  onDelete?: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  // Card Content
  const cardContent = (
    <Card className="w-full bg-gray-700 h-96 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
      {/* Card Header with Image and Overlay */}
      <CardHeader className="p-0 relative">
        <img
          className="w-full h-36 object-cover"
          src={trip?.images?.[0].url || "/placeholder.jpg"}
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
            {'₵'}
            <span>
              <strong>Member:</strong> GHS {trip?.cost?.basePrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {'₵'}
            <span>
              <strong>Non-Member:</strong> GHS{" "}
              {(trip?.cost?.basePrice! + (trip?.cost?.discount || 0)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Conditional Action Buttons for Admin */}
        {isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center flex-1"
              onClick={(e) => {
                e.preventDefault(); // Prevent card click when clicking the button
                onEdit && onEdit(trip);
              }}
            >
              <Edit className="mr-2 w-4 h-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center flex-1"
              onClick={(e) => {
                e.preventDefault(); // Prevent card click when clicking the button
                trip._id && onDelete && onDelete(trip._id);
              }}
            >
              <Trash className="mr-2 w-4 h-4" /> Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Conditionally wrap the card in Link if not admin
  return isAdmin ? (
    cardContent
  ) : (
    <Link to={`/ASGSDWSDZ-234ADFSDAS/trip/${trip?._id}`} className="block">
      {cardContent}
    </Link>
  );
};

export default TripCard;
