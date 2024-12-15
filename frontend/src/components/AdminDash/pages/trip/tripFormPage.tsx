
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Trip, TripFormData } from "@/core/interfaces";
import { useTripAPI } from "@/hooks/api.hook";
import TripForm from "./tripForm";

const AdminTripFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { addTrip, editTrip, getTripById } = useTripAPI();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrip = async () => {
      if (id) {
        try {
          const fetchedTrip = await getTripById(id);
          setTrip(fetchedTrip);
        } catch (error: any) {
          toast.error("Failed to fetch trip data.");
          navigate("/admin/trips"); // Redirect back to trips list on error
        }
      }
      setLoading(false);
    };
    fetchTrip();
  }, [id, getTripById, navigate]);

  const handleFormSubmit = async (tripData: TripFormData, isEdit: boolean) => {
    try {
      if (isEdit && id) {
        await editTrip(id, tripData);
        toast.success("Trip updated successfully!");
      } else {
        await addTrip(tripData);
        toast.success("Trip added successfully!");
      }
      navigate("/admin/trips"); // Navigate back to the trips list after submission
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting the form.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or skeleton loader
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Trip" : "Add New Trip"}</h1>
        <Button variant="outline" onClick={() => navigate("/admin/trips")}>
          Back to Trips
        </Button>
      </div>

      <TripForm
        defaultTrip={trip}
        onSubmit={handleFormSubmit}
        isEdit={Boolean(id)}
      />
    </div>
  );
};

export default AdminTripFormPage;
