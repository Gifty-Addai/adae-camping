interface Window {
  PaystackPop: any;
}

interface FacebookPixel {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, parameters?: Record<string, unknown>): void;
  (
    command: "trackCustom",
    event: string,
    parameters?: Record<string, unknown>,
  ): void;
  push: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq?: FacebookPixel;
  }
}
export {};

declare module "swiper/css";
declare module "swiper/react";
declare module "swiper/modules";
declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
