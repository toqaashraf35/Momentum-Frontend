import React, { useEffect, useState } from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import { CommentCard } from './CommentCard';
import { usePostComments } from '../hooks/useComment';
import commentService from '../services/commentService';
import { useUser } from '../hooks/useUser';

interface CommentListProps {
  postId: number;
  onDeleteComment?: (commentId: number) => void;
  className?: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  onDeleteComment,
  className = ''
}) => {
  const {
    comments,
    loading,
    error,
    fetchComments,
    deleteComment: deleteCommentFromHook
  } = usePostComments(postId);
  const { userProfile } = useUser();
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  // After comments are loaded (or changed), compute which comments are liked
  useEffect(() => {
    let cancelled = false;
    const computeLikes = async () => {
      if (!userProfile?.id || comments.length === 0) return;
      if (comments.every(c => likedMap[c.id] !== undefined)) return; // already known
      try {
        const results = await Promise.all(
          comments.map(async (c) => {
            try {
              const likes = await commentService.getCommentLikes(c.id);
              return [c.id, likes.some(like => like.userId === userProfile.id)] as [number, boolean];
            } catch {
              return [c.id, false] as [number, boolean];
            }
          })
        );
        if (!cancelled) {
          const map: Record<number, boolean> = {};
            results.forEach(([id, liked]) => { map[id] = liked; });
          setLikedMap(map);
        }
      } catch {
        // ignore batch failure
      }
    };
    // Seed from backend if flag present
    const seed: Record<number, boolean> = {};
    let seeded = false;
    comments.forEach(c => {
      if (c.isLikedByCurrentUser !== undefined) {
        seed[c.id] = !!c.isLikedByCurrentUser;
        seeded = true;
      }
    });
    if (seeded) {
      setLikedMap(prev => ({ ...seed, ...prev }));
    }
    computeLikes();
    return () => { cancelled = true; };
  }, [comments, userProfile?.id]);

  const handleChildLikeState = (commentId: number, liked: boolean) => {
    setLikedMap(prev => ({ ...prev, [commentId]: liked }));
  };

  const handleDeleteComment = async (commentId: number) => {
    const success = await deleteCommentFromHook(commentId);
    if (success && onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchComments}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium mb-2">No comments yet</p>
        <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
      </div>
      
      {comments.map((comment) => {
        const initialIsLiked = likedMap[comment.id];
        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            initialIsLiked={initialIsLiked}
            onLikeStateChange={(id, liked) => handleChildLikeState(id, liked)}
          />
        );
      })}
    </div>
  );
};