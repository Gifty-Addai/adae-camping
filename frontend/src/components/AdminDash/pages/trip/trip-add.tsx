// src/components/AdminDash/pages/trip/AddTripPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import ErrorMessage from "@/components/ui/error-message";
import TripForm from "./tripForm";
import { TripFormInput } from "@/core/interfaces/zod";

const AddTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handler for form submission
  const handleAddTrip = async (tripData: TripFormInput) => {
    setIsLoading(true);
    setSubmissionError(null); // Reset previous errors

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        // Extract error message from response
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create trip.");
      }

      // Optionally, handle the response data
    //   const createdTrip = await response.json();

      // Show success toast
      toast.success("Trip created successfully!");

      // Redirect to the Admin Trip Page
      navigate("/admin/trips");
    } catch (error: any) {
      console.error("Error creating trip:", error);
      setSubmissionError(error.message || "An unexpected error occurred.");
      toast.error(error.message || "Failed to create trip.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Trip</h1>
        <Button
          className="flex items-center space-x-2"
          onClick={() => navigate("/admin/trips")}
        >
          {/* Optional: You can use an icon here */}
          Back to Trips
        </Button>
      </div>

      {/* Error Message */}
      {submissionError && (
        <div className="mb-4">
          <ErrorMessage message={submissionError} />
        </div>
      )}

      {/* Trip Form */}
      <TripForm onSubmit={handleAddTrip} isEdit={false} />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-4">
          <span className="text-blue-400">Submitting trip...</span>
        </div>
      )}
    </div>
  );
};

export default AddTripPage;
