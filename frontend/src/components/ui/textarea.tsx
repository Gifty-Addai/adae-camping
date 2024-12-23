import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`block w-full rounded-md bg-card text-card-foreground border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${className}`}
                {...props}
            />
        );
    }
);

// Optional: Set a display name for better debugging and React DevTools integration
Textarea.displayName = "Textarea";

export default Textarea;
