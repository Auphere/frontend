import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoGalleryProps {
  images: string[];
  placeName: string;
}

export const PhotoGallery = ({ images, placeName }: PhotoGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.slice(0, 4);
  const hasMoreImages = images.length > 4;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85%] snap-start"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image}
                alt={`${placeName} - Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-3">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-lg group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`${placeName} - Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            {hasMoreImages && index === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  +{images.length - 4} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <img
              src={images[currentIndex]}
              alt={`${placeName} - Photo ${currentIndex + 1}`}
              className="w-full h-[70vh] object-contain"
            />

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
