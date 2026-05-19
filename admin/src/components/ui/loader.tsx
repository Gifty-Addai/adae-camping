import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", color = "text-blue-600" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color} ${sizes[size]}`}
        style={{ borderColor: `${color}` }}
      ></motion.div>
    </div>
  );
};
