import { useState, useCallback } from 'react';
import commentService from '../services/commentService';
import postService from '../services/postService';
import type {
  CommentRequestDTO,
  CommentResponseDTO
} from '../services/commentService';

// Hook for comment actions (add, update, delete, like)
export const useCommentActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (postId: number, commentData: CommentRequestDTO): Promise<CommentResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.addComment(postId, commentData);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (id: number, commentData: CommentRequestDTO): Promise<CommentResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.updateComment(id, commentData);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await commentService.deleteComment(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (id: number): Promise<CommentResponseDTO | null> => {
    setError(null);
    try {
      return await commentService.likeComment(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to like comment');
      return null;
    }
  }, []);

  const unlikeComment = useCallback(async (id: number): Promise<CommentResponseDTO | null> => {
    setError(null);
    try {
      return await commentService.unlikeComment(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unlike comment');
      return null;
    }
  }, []);

  return {
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
  };
};

// Hook for managing post comments
export const usePostComments = (postId: number) => {
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Use the proper post endpoint for getting comments
      const data = await postService.getPostComments(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addNewComment = useCallback(async (commentData: CommentRequestDTO): Promise<CommentResponseDTO | null> => {
    setError(null);
    try {
      const newComment = await commentService.addComment(postId, commentData);
      if (newComment) {
        setComments(prev => [...prev, newComment]);
      }
      return newComment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
      return null;
    }
  }, [postId]);

  const updateComment = useCallback(async (id: number, commentData: CommentRequestDTO): Promise<CommentResponseDTO | null> => {
    setError(null);
    try {
      const updatedComment = await commentService.updateComment(id, commentData);
      if (updatedComment) {
        setComments(prev => prev.map(comment => 
          comment.id === id ? updatedComment : comment
        ));
      }
      return updatedComment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update comment');
      return null;
    }
  }, []);

  const deleteComment = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      await commentService.deleteComment(id);
      setComments(prev => prev.filter(comment => comment.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      return false;
    }
  }, []);

  const likeComment = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      const updatedComment = await commentService.likeComment(id);
      // Update the comment with the exact like count from backend
      setComments(prev => prev.map(comment => 
        comment.id === id ? { ...comment, likeCount: updatedComment.likeCount } : comment
      ));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to like comment');
      return false;
    }
  }, []);

  const unlikeComment = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      const updatedComment = await commentService.unlikeComment(id);
      // Update the comment with the exact like count from backend
      setComments(prev => prev.map(comment => 
        comment.id === id ? { ...comment, likeCount: updatedComment.likeCount } : comment
      ));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unlike comment');
      return false;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment: addNewComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
  };
};

// Hook for managing comment likes
export const useCommentLikes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCommentLikes = useCallback(async (commentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getCommentLikes(commentId);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch comment likes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCommentLikes, loading, error };
};