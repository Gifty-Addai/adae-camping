// src/components/TripForm/sections/reviewAndSubmit-section.tsx
import React from "react";
import { TripFormInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";

interface ReviewAndSubmitSectionProps {
  data: TripFormInput;
  onSubmit: () => void;
}

const ReviewAndSubmitSection: React.FC<ReviewAndSubmitSectionProps> = ({
  data,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Your Trip Details</h3>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <Button onClick={onSubmit}>Submit Trip</Button>
    </div>
  );
};

export default ReviewAndSubmitSection;
