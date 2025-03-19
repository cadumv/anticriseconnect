
import React from "react";

export const DiscoverySkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-gray-200 animate-pulse rounded-full w-24"></div>
        ))}
      </div>
      <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2 mt-4"></div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-2 items-center">
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/4 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
