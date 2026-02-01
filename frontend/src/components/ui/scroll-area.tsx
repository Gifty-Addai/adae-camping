import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
    >
        <div className="h-full w-full rounded-[inherit] overflow-y-auto pr-2 custom-scrollbar">
            {children}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
        </div>
    </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
