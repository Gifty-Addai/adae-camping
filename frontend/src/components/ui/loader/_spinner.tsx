// src/ui/loader/_spinner.tsx

import { cn } from "../../../lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animation/loading.json";

const spinnerVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-2 w-2",
        md: "h-4 w-4",
        lg: "h-10 w-10",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinnerVariants> {
  animationData?: object;
  loop?: boolean;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, animationData, loop = true, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {/* CSS Spinner */}
        <span
          className={cn(
            "absolute inset-0 border-t-transparent border-black rounded-full animate-spin",
            size === "sm" && "border-2",
            size === "default" && "border-2",
            size === "md" && "border-2",
            size === "lg" && "border-2",
            size === "xl" && "border-2"
          )}
        ></span>

        {/* Lottie Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lottie
            animationData={animationData || loadingAnimation}
            loop={loop}
            className={cn(
              size === "sm" && "w-2 h-2",
              size === "default" && "w-5 h-5",
              size === "md" && "w-4 h-4",
              size === "lg" && "w-10 h-10",
              size === "xl" && "w-16 h-16"
            )}
          />
        </div>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
