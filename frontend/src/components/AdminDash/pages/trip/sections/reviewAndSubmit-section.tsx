import React, { useState } from "react";
import { TripFormInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, CalendarDays, Users, Info, Image, Clock } from "lucide-react";

interface ReviewAndSubmitSectionProps {
  data: TripFormInput;
  onSubmit: () => void;
}

const ReviewAndSubmitSection: React.FC<ReviewAndSubmitSectionProps> = ({
  data,
  onSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 space-y-8 bg-card shadow-lg rounded-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-center text-yellow-400">Review Trip Details</h3>
      
      <div className="space-y-6">
        {/* Main Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 bg-muted p-4 rounded-md">
            <MapPin color="yellow" className="text-blue-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-gray-500">Location</span>
              <span className="text-lg font-semibold text-white">{data.location.mainLocation}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-muted p-4 rounded-md">
            <CalendarDays color="yellow" className="text-green-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-gray-500">Dates</span>
              <span className="text-lg font-semibold text-white">
                {new Date(data.schedule.dates[0].startDate).toLocaleDateString()} - {" "}
                {new Date(data.schedule.dates[0].endDate).toLocaleDateString()}
              </span>
              <span className="block text-sm font-medium text-gray-500 mt-3">Days</span>
              <span className="text-lg font-semibold text-white">
              {data.duration.days} days / {data.duration.nights} nights
              </span>
            </div>

            
          </div>
          <div className="flex items-center space-x-4 bg-muted p-4 rounded-md">
            <Users color="yellow" className="text-purple-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-gray-500">Group Size</span>
              <span className="text-lg font-semibold text-white">
                {data.groupSize.min} - {data.groupSize.max}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-muted p-4 rounded-md">
            <span className="text-yellow-400">GHS </span>
            <div>
              <span className="block text-sm font-medium text-white">Cost</span>
              <span className="text-lg font-semibold text-white">{data.cost.basePrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-muted p-4 rounded-md">
            <Clock color="yellow" className="text-orange-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-white">Duration</span>
              <span className="text-lg font-semibold text-white">
                {data.duration.days} days / {data.duration.nights} nights
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Highlights */}
        <div className="space-y-6 border-t pt-6">
          <div className="flex items-center space-x-4">
            <Info color="yellow" className="text-cyan-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-white">Description</span>
              <p className="text-base text-white">{data.basicInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Image color="yellow" className="text-pink-500 w-6 h-6" />
            <div>
              <span className="block text-sm font-medium text-white">Images</span>
              <div className="flex space-x-4 overflow-x-auto mt-2">
                {data.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Trip image ${index + 1}`}
                    className="w-20 h-20 rounded-md object-cover border border-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="text-blue-600 underline"
            >
              {isExpanded ? "Hide Details" : "View All Details"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all duration-300 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-muted p-4 rounded-md">
                <span className="block text-sm font-medium text-white">Transportation</span>
                <p className="text-base text-white">{data.logistics.transportation}</p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <span className="block text-sm font-medium text-white">Accommodation</span>
                <p className="text-base text-white">{data.logistics.accommodation}</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-4 left-0 w-full px-6">
        <Button
          onClick={onSubmit}
          className="w-full"
        >
          Submit Trip
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndSubmitSection;
