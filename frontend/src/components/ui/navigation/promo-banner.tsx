import { X } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-[#1d1d1d] text-gray-300 py-2 px-4 text-center text-sm font-medium border-b border-[#2d2d2d]">
            <p className="flex items-center justify-center gap-2">
                <span>🫖</span>
                <span>VALENTINE'S DAY OFFER 💝 - FLAT 25% OFF - USE CODE "SELFLOVE25"</span>
                <span>🫖</span>
            </p>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                aria-label="Close banner"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default PromoBanner;
