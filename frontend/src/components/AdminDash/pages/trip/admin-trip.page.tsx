// src/components/AdminDash/pages/trip/AdminTripPage.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Trip } from "@/core/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTripAPI } from "@/hooks/api.hook";
import { useNavigate } from "react-router-dom";

interface TripTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripTable: React.FC<TripTableProps> = ({ trips, onEdit, onDelete }) => {
  if (!trips || trips.length === 0) {
    return <p>No trips found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip._id || trip.name}>
            <TableCell>{trip.name}</TableCell>
            <TableCell>{trip.type}</TableCell>
            <TableCell>{trip.difficulty}</TableCell>
            <TableCell>
              {trip.duration?.days} days / {trip.duration?.nights} nights
            </TableCell>
            <TableCell className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(trip)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => trip._id && onDelete(trip._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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

  const handleEditClick = (trip: Trip) => {
    navigate(`/admin/trips/edit/${trip._id}`);
  };

  const handleDeleteClick = async (id: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await removeTrip(id);
      toast.success("Trip deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trip.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Trips</h1>
        <Button onClick={() => navigate("/admin/trips/add")}>Add Trip</Button>
      </div>

      {/* TABLE OF TRIPS */}
      {loading ? (
        <p>Loading Trips...</p>
      ) : (
        <TripTable trips={trips} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminTripPage;
