import React, { useCallback, useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { postRequest } from "@/lib/api-Request/api-requests";
import { ImageUpload, UploadImageResponse } from "@/core/interfaces";
import { ImagesInput, imagesSchema } from "@/core/interfaces/zod";
import { z } from "zod";

// Define a wrapper schema that includes the images array
const imagesSectionSchema = z.object({
  images: imagesSchema.min(1, "At least one image is required"),
});

// Infer the new type from the wrapper schema
type ImagesSectionInput = z.infer<typeof imagesSectionSchema>;

interface ImagesSectionProps {
  data: { url: string }[];
  onNext: (data: ImagesInput) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ data, onNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ImagesSectionInput>({
    resolver: zodResolver(imagesSectionSchema),
    defaultValues: {
      images: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>([]);

  const watchedImages = useWatch({ control, name: "images" });

  useEffect(() => {
    console.log("Current form images:", watchedImages);
  }, [watchedImages]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file: file || null,
      preview: URL.createObjectURL(file),
      uploading: false,
      progress: 0,
      error: null,
      url: null,
    }));

    setImageUploads((prev) => [...prev, ...newUploads]);

    // Start uploading each image
    newUploads.forEach((upload) => uploadImage(upload));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxSize: 25 * 1024 * 1024,
  });

  const uploadImage = async (upload: ImageUpload) => {
    setImageUploads((prev) =>
      prev.map((u) =>
        u.id === upload.id ? { ...u, uploading: true, error: null } : u
      )
    );

    const formData = new FormData();
    formData.append("file", upload.file!);

    try {
      const response = await postRequest<UploadImageResponse>(
        "/api/image/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setImageUploads((prev) =>
                prev.map((u) =>
                  u.id === upload.id
                    ? { ...u, progress: percentCompleted }
                    : u
                )
              );
            }
          },
        }
      );

      const imageUrl = response.url;

      if (imageUrl) {
        setImageUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, uploading: false, url: imageUrl, progress: 100 }
              : u
          )
        );

        // Append the image URL to the form's images array
        append({ url: imageUrl });
        console.log("Appended image URL to form:", imageUrl);
      } else {
        throw new Error("Invalid image URL received");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setImageUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? {
              ...u,
              uploading: false,
              error: "Upload failed. Please try again.",
            }
            : u
        )
      );
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    // Cleanup: Revoke data URIs to avoid memory leaks
    return () => {
      imageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
    };
  }, [imageUploads]);

  const onSubmit = (formData: ImagesSectionInput) => {
    console.log("ImagesSection onSubmit called with:", formData.images);
    onNext(formData.images);
  };

  const isUploading = imageUploads.some((upload) => upload.uploading);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 flex flex-col items-center"
    >
      <Label className="text-yellow-400 text-2xl font-semibold">
        Images
      </Label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${isDragActive
          ? "border-yellow-400 bg-blue-50"
          : "border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the images here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop images here, or click to select files
          </p>
        )}
        <em className="text-sm text-muted-foreground">
          (Only *.jpeg, *.jpg, *.png, *.gif images will be accepted, max size 25
          MB)
        </em>
      </div>

      {/* Image Previews */}
      {fields.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden"
            >
              <img
                src={field.url}
                alt={`Uploaded Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                aria-label={`Remove image ${index + 1}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display Form Errors */}
      {errors.images && (
        <ErrorMessage message={errors.images.message as string} />
      )}

      {/* Continue Button */}
      <div className="flex justify-end w-full">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(ImagesSection);
