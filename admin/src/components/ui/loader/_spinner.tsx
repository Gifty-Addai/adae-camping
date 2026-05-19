import { cn } from "../../../lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const spinnerVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16",
        xl: "h-20 w-20",
      },
      color: {
        primary: "border-primary",
        secondary: "border-secondary",
        accent: "border-accent",
        white: "border-white",
      },
      glow: {
        true: "shadow-lg glow",
        false: "shadow-none",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
      glow: true,
    },
  }
);

export interface SpinnerProps
  extends VariantProps<typeof spinnerVariants> {
  animationData?: object;
  loop?: boolean;
  className?: string;
  glow?: boolean;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, glow, animationData, loop = true, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ size, color, glow, className }))}
        ref={ref}
        {...props}
      >
        {/* CSS Spinner with improved design */}
        <span
          className={cn(
            "absolute inset-0 border-t-transparent rounded-full animate-spin",
            "border-6",
            "border-t-transparent",
            "border-solid",
            glow && "glow-effect", 
            size === "sm" && "border-4",
            size === "md" && "border-6",
            size === "lg" && "border-8",
            size === "xl" && "border-10"
          )}
        ></span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
