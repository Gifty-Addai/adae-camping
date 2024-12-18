// src/components/booking/AccommodationPreferences.tsx
import React from "react";

interface AccommodationPreferencesProps {
  data: {
    roomType: string;
    specialRequests: string;
  };
  updateData: (data: any) => void;
}

const AccommodationPreferences: React.FC<AccommodationPreferencesProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Accommodation Preferences</h2>
      <form className="space-y-4">
        <label className="block">
          Room Type:
          <select
            name="roomType"
            value={data.roomType}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Select Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </label>
        <label className="block">
          Special Requests:
          <textarea
            name="specialRequests"
            value={data.specialRequests}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            placeholder="Any special requests?"
          ></textarea>
        </label>
      </form>
    </div>
  );
};

export default AccommodationPreferences;
