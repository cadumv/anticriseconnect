
import React from "react";

interface PostUserInfoProps {
  displayName: string;
  formattedDate: string;
  engineeringType?: string;
  visibility?: 'public' | 'private';
  onClick: () => void;
}

export function PostUserInfo({ 
  displayName, 
  formattedDate, 
  engineeringType = "", 
  visibility,
  onClick 
}: PostUserInfoProps) {
  return (
    <div>
      <div 
        className="font-semibold text-sm line-clamp-1 cursor-pointer hover:underline" 
        onClick={onClick}
      >
        {displayName}
      </div>
      
      <div className="text-xs text-gray-500 flex items-center">
        <span>{formattedDate}</span>
        
        {engineeringType && (
          <>
            <span className="mx-1">•</span>
            <span>Engenharia {engineeringType}</span>
          </>
        )}
        
        {visibility && (
          <>
            <span className="mx-1">•</span>
            <span>
              {visibility === 'public' ? (
                <svg 
                  className="h-3 w-3 inline"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              ) : (
                <svg 
                  className="h-3 w-3 inline"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M17 9V7a5 5 0 0 0-10 0v2"></path>
                  <rect x="7" y="9" width="10" height="12" rx="1"></rect>
                </svg>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
