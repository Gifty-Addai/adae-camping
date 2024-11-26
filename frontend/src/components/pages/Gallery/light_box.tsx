import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ProcessedVideo } from "@/core/interfaces";

interface LightboxProps {
  item: ProcessedVideo;
  isOpen: boolean;
  onClose: () => void;
}

const GalleryLightbox: React.FC<LightboxProps> = ({ item, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        {/* Close Button */}
        {/* <DialogClose asChild>
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </DialogClose> */}

        {/* Embedded Video */}
        <div className="aspect-w-16 aspect-h-10 w-full h-80 rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${item.id}`}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Information */}
        <div className="mt-4">
          <p className="text-sm text-card-foreground">{item.views} Views</p>
          <h3 className="text-1xl font-semibold text-white">{item.title}</h3>
          <p className="text-card-foreground mt-2 line-clamp-1">{item.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryLightbox;
