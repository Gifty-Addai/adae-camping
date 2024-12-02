import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
    return (
        <textarea
            className={`block w-full rounded-md bg-card text-card-foreground border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${className}`}
            {...props}
        />
    );
};

export default Textarea;
