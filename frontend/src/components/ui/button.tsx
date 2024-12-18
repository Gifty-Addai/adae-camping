import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { DotLoader } from "./loader/_dot_loader"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive",
        "destructive-outline":
          "border border-destructive bg-background hover:bg-accent text-destructive hover:text-destructive-foreground hover:bg-destructive",
        outline:
          "border border-input bg-gray-300 hover:bg-accent-foreground hover:text-card",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-9 w-9",
      },
      state:{
        disabled: "disabled:pointer-events-none bg-gray-300  text-secondary-foreground/50 hover:bg-gray-300",
        loading: "disabled:pointer-events-none bg-gray-300  text-secondary-foreground hover:bg-gray-300",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: null
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean,
  loading?: boolean,
  state?: "disabled" | "loading" | null  | undefined ,
  icon?: React.ElementType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, state, asChild = false, icon: Icon, loading = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    const content = loading ? (
      <DotLoader className="text-secondary-foreground/60" />
    ) : (
      <>
        {Icon && <Icon className="mr-2 ml-0 w-7 h-10  transition-colors duration-200" />}
        {props.children}
      </>
    );

    return (
      <Comp
        disabled={props.disabled || loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            state: state || (props.disabled ? "disabled" : null) || (loading ? "loading" : null),
          })
        )}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";


export { Button, buttonVariants }
