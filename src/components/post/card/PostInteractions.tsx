
import React from "react";
import { useNavigate } from "react-router-dom";

interface PostInteractionsProps {
  likedByUsers: Array<{id: string, name: string}>;
  commentCount: number;
  onUserClick: (userId: string) => void;
  onCommentCountClick: () => void;
}

export function PostInteractions({ 
  likedByUsers, 
  commentCount, 
  onUserClick, 
  onCommentCountClick 
}: PostInteractionsProps) {
  if (likedByUsers.length === 0 && commentCount === 0) {
    return null;
  }

  return (
    <div className="px-4 py-1 text-xs text-gray-500 flex items-center border-t">
      {likedByUsers.length > 0 && (
        <>
          <div className="flex -space-x-1 mr-2">
            {likedByUsers.slice(0, 3).map((user, index) => (
              <div 
                key={index} 
                className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => onUserClick(user.id)}
              >
                <span className="text-[9px] font-bold">{user.name[0].toUpperCase()}</span>
              </div>
            ))}
          </div>
          <span>
            {likedByUsers.length === 1 
              ? <span className="cursor-pointer hover:underline" onClick={() => onUserClick(likedByUsers[0].id)}>{likedByUsers[0].name}</span>
              : <><span className="cursor-pointer hover:underline" onClick={() => onUserClick(likedByUsers[0].id)}>{likedByUsers[0].name}</span> e mais {likedByUsers.length - 1} {likedByUsers.length - 1 > 1 ? 'pessoas' : 'pessoa'}</>}
          </span>
        </>
      )}
      
      {commentCount > 0 && (
        <>
          {likedByUsers.length > 0 && <span className="mx-1">•</span>}
          <span 
            className="cursor-pointer hover:underline"
            onClick={onCommentCountClick}
          >
            {commentCount} {commentCount === 1 ? 'comentário' : 'comentários'}
          </span>
        </>
      )}
    </div>
  );
}
