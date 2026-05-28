import React, { useEffect, useRef, useState } from "react";
import { Page } from "@/components/ui/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVideoAPI, VideoData } from "@/hooks/video.hook";
import { toast } from "react-toastify";
import {
  Video as VideoIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Film,
  AlertCircle,
  Save,
  ExternalLink,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import Textarea from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { postRequest } from "@/lib/api-Request/api-requests";

// ─── Validation Schema ──────────────────────────────────────────────────────
const videoValidationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    thumbnail: z.string().min(1, "Thumbnail is required"),
    description: z.string().min(1, "Description is required"),
    videoUrl: z.string().optional().or(z.literal("")),
    embedUrl: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.videoUrl || data.embedUrl, {
    message: "At least one of Video File or Embed URL must be provided",
    path: ["videoUrl"],
  });

type VideoFormValues = z.infer<typeof videoValidationSchema>;

// ─── Reusable file-drop zone ─────────────────────────────────────────────────
interface UploadZoneProps {
  accept: string;
  label: string;
  hint: string;
  uploading: boolean;
  onFile: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  label,
  hint,
  uploading,
  onFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      htmlFor={`upload-${label}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-[#4d4d4d] border-dashed rounded-lg bg-[#353535] transition-all select-none ${
        uploading
          ? "opacity-60 cursor-not-allowed pointer-events-none border-[#8b7355]/40"
          : "cursor-pointer hover:bg-[#3d3d3d] hover:border-[#8b7355]/60"
      }`}
    >
      {uploading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="w-8 h-8 mb-2 text-[#8b7355] animate-bounce" />
          <p className="text-sm text-[#8b7355] font-semibold animate-pulse">
            Uploading…
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Please wait</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="w-8 h-8 mb-2 text-gray-400" />
          <p className="mb-1 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag &amp;
            drop
          </p>
          <p className="text-xs text-gray-500">{hint}</p>
        </div>
      )}
      <Input
        ref={inputRef}
        id={`upload-${label}`}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
        disabled={uploading}
      />
    </label>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminVideoDash: React.FC = () => {
  const { getAllVideos, createVideo, updateVideo, deleteVideo, loading } =
    useVideoAPI();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoValidationSchema),
    defaultValues: {
      title: "",
      category: "",
      thumbnail: "",
      description: "",
      videoUrl: "",
      embedUrl: "",
    },
  });

  const loadVideos = async () => {
    const data = await getAllVideos();
    if (data) setVideos(data);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // ── Upload helpers ─────────────────────────────────────────────────────────
  const handleThumbnailUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadingThumb(true);
    try {
      const res = await postRequest<{ url: string }>(
        "/api/image/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res?.url) {
        form.setValue("thumbnail", res.url, { shouldValidate: true });
        toast.success("Thumbnail uploaded!");
      } else {
        toast.error("Failed to upload thumbnail");
      }
    } catch {
      toast.error("Error uploading thumbnail");
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadingVideo(true);
    try {
      const res = await postRequest<{ url: string }>(
        "/api/image/upload-video",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res?.url) {
        form.setValue("videoUrl", res.url, { shouldValidate: true });
        // Clear embedUrl — they are mutually exclusive
        form.setValue("embedUrl", "", { shouldValidate: true });
        toast.success("Video uploaded!");
      } else {
        toast.error("Failed to upload video");
      }
    } catch {
      toast.error("Error uploading video");
    } finally {
      setUploadingVideo(false);
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    if (videos.length >= 4) {
      toast.warning("Maximum of 4 videos limit reached. Cannot add more.");
      return;
    }
    setEditingVideo(null);
    form.reset({
      title: "",
      category: "Cooking Oils",
      thumbnail: "",
      description: "",
      videoUrl: "",
      embedUrl: "",
    });
    setIsOpen(true);
  };

  const handleOpenEditModal = (video: VideoData) => {
    setEditingVideo(video);
    form.reset({
      title: video.title,
      category: video.category,
      thumbnail: video.thumbnail,
      description: video.description,
      videoUrl: video.videoUrl || "",
      embedUrl: video.embedUrl || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (videos.length <= 2) {
      toast.error("Minimum of 2 videos required. Cannot delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this video?")) {
      const success = await deleteVideo(id);
      if (success) setVideos((prev) => prev.filter((v) => v._id !== id));
    }
  };

  const onSubmit = async (values: VideoFormValues) => {
    if (editingVideo) {
      const toastId = toast.loading("Updating video…");
      const updated = await updateVideo(editingVideo._id, values);
      if (updated) {
        toast.update(toastId, {
          render: "Video updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setVideos((prev) =>
          prev.map((v) => (v._id === editingVideo._id ? updated : v))
        );
        setIsOpen(false);
      } else {
        toast.update(toastId, {
          render: "Failed to update video.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } else {
      if (videos.length >= 4) {
        toast.error("Cannot exceed maximum of 4 videos.");
        return;
      }
      const toastId = toast.loading("Creating video…");
      const created = await createVideo(values);
      if (created) {
        toast.update(toastId, {
          render: "Video created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setVideos((prev) => [...prev, created]);
        setIsOpen(false);
      } else {
        toast.update(toastId, {
          render: "Failed to create video.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  // ── Watched values for previews ────────────────────────────────────────────
  const watchedThumb = form.watch("thumbnail");
  const watchedVideoUrl = form.watch("videoUrl");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Page
      pageTitle="Homepage Slideshow Videos"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6 max-w-6xl mx-auto text-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3d3d3d]">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">
                Slideshow Videos
              </h2>
              <p className="text-sm text-gray-400">
                Manage the videos shown in the landing page section *"Discover
                how our ancestral tallow transforms cooking…"*
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-[#353535] border border-[#4d4d4d] text-gray-300">
                  Current Count: {videos.length} / 4
                </span>
                <span className="text-gray-400">(Min: 2, Max: 4)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={loadVideos}
                disabled={loading}
                className="bg-transparent border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d] w-10 h-10"
                title="Refresh list"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                onClick={handleOpenAddModal}
                disabled={videos.length >= 4}
                className="bg-[#8b7355] hover:bg-[#6d5a44] text-white h-10 px-5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Video
              </Button>
            </div>
          </div>

          {/* Video cards */}
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#333333] border border-[#3d3d3d] rounded-2xl text-center">
              <Film className="w-16 h-16 text-gray-500 mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-300">
                Loading videos…
              </h3>
              <p className="text-sm text-gray-400 max-w-sm mt-1">
                Fetching video records from the database or seeding default
                assets.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  className="bg-[#333] border border-[#3d3d3d] text-gray-100 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[9/10] bg-[#222] overflow-hidden flex items-center justify-center">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/350x500/353535/8b7355?text=Video+Slideshow";
                          }}
                        />
                      ) : (
                        <Film className="w-12 h-12 text-gray-600" />
                      )}

                      <div className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                        {video.category}
                      </div>

                      <div className="absolute bottom-3 right-3 flex flex-col gap-1 items-end">
                        {video.videoUrl && (
                          <span className="bg-[#8b7355]/90 text-white text-[10px] px-2 py-0.5 rounded font-medium border border-amber-600/30">
                            MP4 URL
                          </span>
                        )}
                        {video.embedUrl && (
                          <span className="bg-blue-900/90 text-blue-100 text-[10px] px-2 py-0.5 rounded font-medium border border-blue-600/30">
                            Embed iframe
                          </span>
                        )}
                      </div>
                    </div>

                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-bold text-gray-100 leading-tight">
                        {video.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {video.description}
                      </p>
                      {video.embedUrl && (
                        <a
                          href={video.embedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#8b7355] hover:underline"
                        >
                          View Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0 flex gap-2 border-t border-[#3d3d3d]/50 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEditModal(video)}
                      className="flex-1 bg-[#3a3a3a] border-[#4d4d4d] text-gray-300 hover:bg-[#4d4d4d] hover:text-white h-9 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(video._id)}
                      disabled={videos.length <= 2}
                      className="flex-1 bg-red-950/80 border border-red-900 text-red-200 hover:bg-red-900 hover:text-white h-9 text-xs flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ── Add / Edit Dialog ─────────────────────────────────────────── */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 max-w-lg w-full p-6 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="mb-4 pb-2 border-b border-[#3d3d3d]">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <VideoIcon className="w-5 h-5 text-[#8b7355]" />
                  <span>
                    {editingVideo ? "Edit Video Info" : "Add Slideshow Video"}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Video Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cooking with Goat Tallow"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Category Tag
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cooking Oils, Skin Care"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Short Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly explain what this video demonstrates…"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] min-h-[70px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ── Thumbnail ─────────────────────────────────────────── */}
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Thumbnail Image
                        </FormLabel>
                        <Tabs defaultValue="url" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-[#353535] text-gray-400">
                            <TabsTrigger
                              value="url"
                              className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white flex items-center gap-1.5"
                            >
                              <LinkIcon className="w-3.5 h-3.5" /> Paste URL
                            </TabsTrigger>
                            <TabsTrigger
                              value="upload"
                              className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload File
                            </TabsTrigger>
                          </TabsList>

                          {/* URL tab */}
                          <TabsContent value="url" className="mt-3">
                            <FormControl>
                              <Input
                                placeholder="https://… or /thumbnails/cooking-1.jpg"
                                {...field}
                                className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-10"
                              />
                            </FormControl>
                          </TabsContent>

                          {/* Upload tab */}
                          <TabsContent value="upload" className="mt-3">
                            <UploadZone
                              accept="image/*"
                              label="thumbnail"
                              hint="PNG, JPG, GIF – max 25 MB"
                              uploading={uploadingThumb}
                              onFile={handleThumbnailUpload}
                            />
                          </TabsContent>
                        </Tabs>

                        {/* Thumbnail preview */}
                        {watchedThumb && (
                          <div className="mt-3 relative w-full h-40 bg-[#353535] rounded-lg overflow-hidden border border-[#4d4d4d]">
                            <img
                              src={watchedThumb}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full w-7 h-7"
                              onClick={() =>
                                form.setValue("thumbnail", "", {
                                  shouldValidate: true,
                                })
                              }
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ── Video Source ──────────────────────────────────────── */}
                  <div className="p-3 bg-[#333] border border-[#3d3d3d] rounded-lg space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Video Source (provide at least one)</span>
                    </div>

                    {/* Direct video file */}
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] text-gray-400">
                            Direct Video File (MP4 / MOV / WEBM)
                          </FormLabel>
                          <Tabs defaultValue="url" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-[#353535] text-gray-400 h-8">
                              <TabsTrigger
                                value="url"
                                className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white text-[11px] flex items-center gap-1"
                              >
                                <LinkIcon className="w-3 h-3" /> Paste URL
                              </TabsTrigger>
                              <TabsTrigger
                                value="upload"
                                className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white text-[11px] flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" /> Upload File
                              </TabsTrigger>
                            </TabsList>

                            {/* URL tab */}
                            <TabsContent value="url" className="mt-2">
                              <FormControl>
                                <Input
                                  placeholder="https://… or /videos/cooking.mp4"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Clear embedUrl when pasting a direct video URL
                                    if (e.target.value) {
                                      form.setValue("embedUrl", "", { shouldValidate: true });
                                    }
                                  }}
                                  className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-9 text-xs"
                                />
                              </FormControl>
                            </TabsContent>

                            {/* Upload tab */}
                            <TabsContent value="upload" className="mt-2">
                              <UploadZone
                                accept="video/*"
                                label="video"
                                hint="MP4, MOV, WEBM – max 50 MB"
                                uploading={uploadingVideo}
                                onFile={handleVideoUpload}
                              />
                            </TabsContent>
                          </Tabs>

                          {/* Video preview */}
                          {watchedVideoUrl && (
                            <div className="mt-2 relative w-full bg-black rounded-lg overflow-hidden border border-[#4d4d4d]">
                              <video
                                src={watchedVideoUrl}
                                controls
                                className="w-full max-h-40"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full w-7 h-7"
                                onClick={() =>
                                  form.setValue("videoUrl", "", {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Embed / iframe URL */}
                    <FormField
                      control={form.control}
                      name="embedUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] text-gray-400">
                            Iframe Embed URL (Cloudinary, YouTube, Vimeo…)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="https://player.cloudinary.com/embed/…"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Clear videoUrl when an embed URL is typed
                                  if (e.target.value) {
                                    form.setValue("videoUrl", "", { shouldValidate: true });
                                  }
                                }}
                                className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-9 text-xs pr-8"
                              />
                              {field.value && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    form.setValue("embedUrl", "", { shouldValidate: true })
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                                  title="Clear embed URL"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </FormControl>
                          {field.value && (
                            <p className="text-[10px] text-blue-400 mt-1 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Embed URL set — direct video file will be ignored
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#3d3d3d] mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="bg-transparent border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d] h-10 px-5"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploadingThumb || uploadingVideo}
                      className="bg-[#8b7355] hover:bg-[#6d5a44] text-white h-10 px-6 flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      {editingVideo ? "Update Video" : "Save Video"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    />
  );
};

export default AdminVideoDash;
