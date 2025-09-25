import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "spinner" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-1/2 rounded"></div>
        <div className="skeleton h-4 w-5/6 rounded"></div>
        <div className="skeleton h-4 w-2/3 rounded"></div>
      </div>
    );
  }
  
  if (type === "cards") {
    return (
      <div className={cn("grid gap-4", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="skeleton h-10 w-10 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3 rounded"></div>
                <div className="skeleton h-3 w-1/4 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded"></div>
              <div className="skeleton h-3 w-3/4 rounded"></div>
              <div className="skeleton h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="relative">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-secondary-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
};

export default Loading;