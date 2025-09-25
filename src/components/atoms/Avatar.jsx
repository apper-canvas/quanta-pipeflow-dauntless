import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  className, 
  name,
  size = "md",
  src,
  ...props 
}) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const baseClasses = "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 font-semibold text-white";
  
  if (src) {
    return (
      <img
        className={cn(baseClasses, sizes[size], className)}
        src={src}
        alt={name}
        {...props}
      />
    );
  }
  
  return (
    <div
      className={cn(baseClasses, sizes[size], className)}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;