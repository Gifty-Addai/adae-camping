// src/components/AdminDash/pages/trip/AdminTripPage.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Trip } from "@/core/interfaces";
import { useTripAPI } from "@/hooks/api.hook";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import TripCard from "@/components/pages/Trips/trip-card";
import Pagination from "@/components/pages/product/pagination";

const AdminTripPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    trips,
    loading,
    removeTrip,
    currentPage,
    totalPages,
    goToPage,
  } = useTripAPI();

  const handleEdit = (trip: Trip) => {
    navigate(`/admin/trips/edit/${trip._id}`);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await removeTrip(id);
      toast.success("Trip deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trip.");
    }
  };

  const handleAddTrip = () => {
    navigate("/admin/trips/add");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl text-card-foreground mb-5 font-bold">Manage Trips</h1>
        <Button
          className="flex items-center space-x-2"
          onClick={handleAddTrip}
        >
          <Plus size={20} />
          <span>Add Trip</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-700 h-80 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Trips Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                isAdmin={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (

            <div className="mt-8 flex justify-center items-center gap-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTripPage;
