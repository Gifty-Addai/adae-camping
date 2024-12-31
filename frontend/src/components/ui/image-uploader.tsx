import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { ImageUpload, UploadImageResponse } from "@/core/interfaces";
import { postRequest } from "@/lib/api-Request/api-requests";

interface ImageUploaderProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFormats?: Record<string, string[]>;
  initialImages?: string[];
  onImagesChange?: (images: string[]) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  acceptedFormats = { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
  initialImages = [],
  onImagesChange,
  label = "Upload Images",
}) => {
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>(
    initialImages.map((url) => ({
      id: uuidv4(),
      file: null,
      preview: url,
      uploading: false,
      progress: 100,
      error: null,
      url,
    }))
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (imageUploads.length + acceptedFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      const newUploads = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        progress: 0,
        error: null,
        url: null,
      }));

      setImageUploads((prev) => [...prev, ...newUploads]);
      newUploads.forEach((upload) => handleUpload(upload));
    },
    [imageUploads, maxFiles]
  );

  const handleUpload = async (upload: ImageUpload) => {
    setImageUploads((prev) =>
      prev.map((u) => (u.id === upload.id ? { ...u, uploading: true } : u))
    );

    if (!upload.file) return;

    const formData = new FormData();
    formData.append("file", upload.file);



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
              ? { ...u, uploading: false, progress: 100, imageUrl }
              : u
          )
        );
        notifyImagesChange(upload.id, imageUrl);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
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

  const notifyImagesChange = (id: string, url: string) => {
    onImagesChange?.(
      imageUploads.map((u) => (u.id === id ? url : u.url)).filter(Boolean) as string[]
    );
  };

  const handleRemove = (id: string) => {
    setImageUploads((prev) => prev.filter((upload) => upload.id !== id));
    onImagesChange?.(imageUploads.filter((u) => u.id !== id).map((u) => u.url!));
  };

  useEffect(() => {
    return () => {
      imageUploads.forEach((upload) => {
        if (upload.preview && !upload.url) {
          URL.revokeObjectURL(upload.preview);
        }
      });
    };
  }, [imageUploads]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize,
  });

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-gray-700">{label}</label>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop your files here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop your images, or click to select files
          </p>
        )}
        <em className="text-sm text-muted">
          (Only {Object.keys(acceptedFormats).join(", ")}. Max size:{" "}
          {maxSize / 1024 / 1024} MB)
        </em>
      </div>

      {imageUploads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {imageUploads.map((upload) => (
            <div
              key={upload.id}
              className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden"
            >
              <img
                src={upload.preview || ""}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              {upload.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                  Uploading... {upload.progress}%
                </div>
              )}
              {upload.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center text-white">
                  {upload.error}
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(upload.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                aria-label="Remove image"
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
    </div>
  );
};

export default React.memo(ImageUploader);
