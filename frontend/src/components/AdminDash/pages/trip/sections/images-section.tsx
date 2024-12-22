// src/components/TripForm/sections/images-section.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const ImagesSection: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  const imagesValue = watch("images") as string;

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="images">Images (comma-separated URLs)</Label>
      <Input
        id="images"
        {...register("images")}
        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
      />
      {errors.images && typeof errors.images.message === "string" && (
        <ErrorMessage message={errors.images.message} />
      )}
      {/* Image Previews */}
      {imagesValue && imagesValue.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {imagesValue
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
            .map((url, index) => (
              <div
                key={index}
                className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Trip Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
