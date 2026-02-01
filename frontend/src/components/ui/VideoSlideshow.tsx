import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    videoUrl?: string;
    embedUrl?: string;
}

const videos: Video[] = [
    { id: 1, title: "Cooking with Goat Tallow", category: "Cooking Oils", thumbnail: "/thumbnails/cooking-1.jpg" },
    { id: 2, title: "Beef Tallow Recipes", category: "Cooking Oils", thumbnail: "/thumbnails/cooking-2.jpg" },
    {
        id: 3,
        title: "Tallow Skin Care Routine",
        category: "Skin Care",
        thumbnail: "/thumbnails/skincare-1.jpg",
        embedUrl: "https://player.cloudinary.com/embed/?cloud_name=dyua9sfez&public_id=Snapchat-926365825_skyuqb&player[muted]=true&player[autoplay]=true&player[loop]=true"
    },
    { id: 4, title: "Hair Treatment", category: "Hair Care", thumbnail: "/thumbnails/hair-1.jpg" },
    { id: 5, title: "Traditional Methods", category: "Cooking Oils", thumbnail: "/thumbnails/cooking-3.jpg" },
];

export const VideoSlideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const nextSlide = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev + 1) % videos.length);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    const prevSlide = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isHovered]);

    // Play video when it's the center card
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === currentIndex && videos[index].videoUrl) {
                    video.play().catch(err => console.log('Video play failed:', err));
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }, [currentIndex]);

    const getSlidePosition = (index: number) => {
        const diff = index - currentIndex;
        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(videos.length - 1)) return 'right';
        if (diff === -1 || diff === videos.length - 1) return 'left';
        return 'hidden';
    };

    return (
        <div
            className="relative w-full h-[600px] overflow-hidden"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Video cards */}
            <div className="relative w-full h-full flex items-center justify-center">
                {videos.map((video, index) => {
                    const position = getSlidePosition(index);

                    return (
                        <div
                            key={video.id}
                            className={`absolute transition-all duration-700 ease-out ${position === 'center'
                                ? 'z-30 scale-100 opacity-100'
                                : position === 'left'
                                    ? 'z-20 -translate-x-80 scale-75 opacity-60 blur-sm'
                                    : position === 'right'
                                        ? 'z-20 translate-x-80 scale-75 opacity-60 blur-sm'
                                        : 'z-10 scale-50 opacity-0'
                                }`}
                            style={{
                                transform: position === 'center'
                                    ? 'translateZ(0px) rotateY(0deg)'
                                    : position === 'left'
                                        ? 'translateZ(-200px) translateX(-350px) rotateY(25deg)'
                                        : position === 'right'
                                            ? 'translateZ(-200px) translateX(350px) rotateY(-25deg)'
                                            : 'translateZ(-400px)',
                            }}
                        >
                            <div className="w-[350px] h-[500px] bg-gradient-to-br from-[#2a2a2a] to-[#1d1d1d] rounded-3xl overflow-hidden shadow-2xl border border-[#3d3d3d] group cursor-pointer">
                                {/* Thumbnail/Video Container - Portrait Aspect Ratio */}
                                <div className="relative w-full h-[400px] bg-[#353535] overflow-hidden">
                                    {/* Video, Embed, or Placeholder */}
                                    {video.embedUrl ? (
                                        <iframe
                                            src={video.embedUrl}
                                            className="absolute inset-0 w-full h-full"
                                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                            frameBorder="0"
                                        />
                                    ) : video.videoUrl ? (
                                        <video
                                            ref={(el) => videoRefs.current[index] = el}
                                            src={video.videoUrl}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loop
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-amber-600/10 flex items-center justify-center">
                                            <div className="text-6xl opacity-20">▶</div>
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300">
                                            <div className="text-2xl text-black">▶</div>
                                        </div>
                                    </div>

                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20">
                                        {video.category}
                                    </div>
                                </div>

                                {/* Info section */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-100 mb-1">{video.title}</h3>
                                    <p className="text-sm text-gray-400">Watch now to learn more</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-gray-900 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-gray-900 transition-all duration-300 group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-gray-900 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-gray-900 transition-all duration-300 group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsAnimating(false), 600);
                            }
                        }}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex
                            ? 'w-12 h-3 bg-white'
                            : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
