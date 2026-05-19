import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`block w-full rounded-md bg-[#353535] text-gray-200 border-[#4d4d4d] shadow-sm focus:border-[#8b7355] focus:ring-[#8b7355] placeholder:text-gray-500 ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export default Textarea;
