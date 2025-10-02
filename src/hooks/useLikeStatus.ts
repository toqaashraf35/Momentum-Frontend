import { useState, useCallback } from 'react';
import { useUser } from './useUser';
import postService from '../services/postService';
import commentService from '../services/commentService';

// Global like status manager
export const useLikeStatus = () => {
  const [userLikedPosts, setUserLikedPosts] = useState<Set<number>>(new Set());
  const [userLikedComments, setUserLikedComments] = useState<Set<number>>(new Set());
  const { userProfile } = useUser();

  // Check if user has liked a specific post
  const isPostLiked = useCallback((postId: number): boolean => {
    return userLikedPosts.has(postId);
  }, [userLikedPosts]);

  // Check if user has liked a specific comment
  const isCommentLiked = useCallback((commentId: number): boolean => {
    return userLikedComments.has(commentId);
  }, [userLikedComments]);

  // Add post like to local state
  const addPostLike = useCallback((postId: number) => {
    setUserLikedPosts(prev => new Set(prev).add(postId));
  }, []);

  // Remove post like from local state
  const removePostLike = useCallback((postId: number) => {
    setUserLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  }, []);

  // Add comment like to local state
  const addCommentLike = useCallback((commentId: number) => {
    setUserLikedComments(prev => new Set(prev).add(commentId));
  }, []);

  // Remove comment like from local state
  const removeCommentLike = useCallback((commentId: number) => {
    setUserLikedComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
  }, []);

  // Check like status for a specific post
  const checkPostLikeStatus = useCallback(async (postId: number): Promise<boolean> => {
    if (!userProfile?.id) return false;
    
    try {
      const likes = await postService.getPostLikes(postId);
      const isLiked = likes.some(like => like.userId === userProfile.id);
      
      if (isLiked) {
        addPostLike(postId);
      } else {
        removePostLike(postId);
      }
      
      return isLiked;
    } catch (error) {
      console.error('Failed to check post like status:', error);
      return false;
    }
  }, [userProfile?.id, addPostLike, removePostLike]);

  // Check like status for a specific comment
  const checkCommentLikeStatus = useCallback(async (commentId: number): Promise<boolean> => {
    if (!userProfile?.id) return false;
    
    try {
      const likes = await commentService.getCommentLikes(commentId);
      const isLiked = likes.some(like => like.userId === userProfile.id);
      
      if (isLiked) {
        addCommentLike(commentId);
      } else {
        removeCommentLike(commentId);
      }
      
      return isLiked;
    } catch (error) {
      console.error('Failed to check comment like status:', error);
      return false;
    }
  }, [userProfile?.id, addCommentLike, removeCommentLike]);

  return {
    isPostLiked,
    isCommentLiked,
    addPostLike,
    removePostLike,
    addCommentLike,
    removeCommentLike,
    checkPostLikeStatus,
    checkCommentLikeStatus
  };
};