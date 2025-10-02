import React, { useState, useEffect } from 'react';
import { Heart, Trash2, User, Calendar } from 'lucide-react';
import type { CommentResponseDTO } from '../services/commentService';
import { useCommentActions } from '../hooks/useComment';
import { useUser } from '../hooks/useUser';
import commentService from '../services/commentService';

interface CommentCardProps {
  comment: CommentResponseDTO;
  onDelete?: (commentId: number) => void;
  className?: string;
  initialIsLiked?: boolean;
  onLikeStateChange?: (commentId: number, liked: boolean, likeCount: number) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onDelete,
  className = '',
  initialIsLiked,
  onLikeStateChange
}) => {
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [isLiked, setIsLiked] = useState<boolean | undefined>(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);
  const { likeComment, unlikeComment } = useCommentActions();
  const { userProfile } = useUser();
  const initializedFromProp = React.useRef(false);

  const isOwner = userProfile?.id === comment.authorId;

  // Consume initial value only once
  useEffect(() => {
    if (!initializedFromProp.current && initialIsLiked !== undefined) {
      setIsLiked(initialIsLiked);
      initializedFromProp.current = true;
    }
  }, [initialIsLiked]);

  // Fallback fetch when not provided by parent
  useEffect(() => {
    if (initialIsLiked !== undefined) return;
    let cancelled = false;
    const fetchStatus = async () => {
      if (!userProfile?.id) return;
      try {
        const likes = await commentService.getCommentLikes(comment.id);
        if (!cancelled) {
          setIsLiked(likes.some(like => like.userId === userProfile.id));
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch comment like status', e);
          setIsLiked(false);
        }
      }
    };
    fetchStatus();
    return () => { cancelled = true; };
  }, [comment.id, userProfile?.id, initialIsLiked]);

  const handleLikeToggle = async () => {
    if (isLiking || isLiked === undefined) return;
    const nextLiked = !isLiked;
    
    // Optimistic update
    setIsLiked(nextLiked);
    const optimisticCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLikeCount(optimisticCount);
    onLikeStateChange?.(comment.id, nextLiked, optimisticCount);
    
    setIsLiking(true);
    try {
      const updatedComment = nextLiked 
        ? await likeComment(comment.id) 
        : await unlikeComment(comment.id);
      
      if (updatedComment) {
        // Use the exact count from backend response
        setLikeCount(updatedComment.likeCount);
        onLikeStateChange?.(comment.id, nextLiked, updatedComment.likeCount);
      } else {
        // Revert on failure
        setIsLiked(!nextLiked);
        setLikeCount(likeCount);
        onLikeStateChange?.(comment.id, !nextLiked, likeCount);
      }
    } catch (e) {
      console.error('Error toggling like', e);
      // Revert
      setIsLiked(!nextLiked);
      setLikeCount(likeCount);
      onLikeStateChange?.(comment.id, !nextLiked, likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    onDelete?.(comment.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors ${className}`}>
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            {comment.authorAvatarUrl ? (
              <img
                src={comment.authorAvatarUrl}
                alt={comment.authorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h5 className="font-semibold text-gray-900 text-sm">{comment.authorName}</h5>
              <span className="text-gray-500 text-xs">@{comment.authorUsername}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Action Menu */}
        {isOwner && (
          <div className="flex space-x-1">
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete comment"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.content}</p>

      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            disabled={isLiking || isLiked === undefined}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
              isLiked === undefined
                ? 'text-gray-400 bg-gray-100 cursor-wait'
                : isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            } ${(isLiking || isLiked === undefined) ? 'opacity-60 cursor-not-allowed' : ''}`}
            aria-label={isLiked === undefined ? 'Loading like status' : isLiked ? 'Unlike comment' : 'Like comment'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};