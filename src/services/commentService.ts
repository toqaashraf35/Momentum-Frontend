import api from "./api";

// Types based on backend DTOs
export interface CommentRequestDTO {
  content: string;
}

export interface CommentResponseDTO {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  postId: number;
  likeCount: number;
  createdAt: string;
  // Optional backend-provided flag indicating if current user liked this comment
  isLikedByCurrentUser?: boolean;
}

export interface CommentLikeResponseDTO {
  commentId: number;
  userId: number;
  username: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

class CommentService {
  /**
   * Add a comment to a post
   * @param postId - Post ID
   * @param comment - Comment data
   */
  async addComment(postId: number, comment: CommentRequestDTO): Promise<CommentResponseDTO> {
    try {
      const response = await api.post<CommentResponseDTO>(`/comments/post/${postId}`, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a comment
   * @param commentId - Comment ID
   * @param comment - Updated comment data
   */
  async updateComment(commentId: number, comment: CommentRequestDTO): Promise<CommentResponseDTO> {
    try {
      const response = await api.put<CommentResponseDTO>(`/comments/${commentId}`, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a comment
   * @param commentId - Comment ID
   */
  async deleteComment(commentId: number): Promise<void> {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Like a comment
   * @param commentId - Comment ID
   */
  async likeComment(commentId: number): Promise<CommentResponseDTO> {
    try {
      const response = await api.post<CommentResponseDTO>(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unlike a comment
   * @param commentId - Comment ID
   */
  async unlikeComment(commentId: number): Promise<CommentResponseDTO> {
    try {
      const response = await api.delete<CommentResponseDTO>(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all likes for a comment
   * @param commentId - Comment ID
   */
  async getCommentLikes(commentId: number): Promise<CommentLikeResponseDTO[]> {
    try {
      const response = await api.get<CommentLikeResponseDTO[]>(`/comments/${commentId}/likes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const commentService = new CommentService();
export default commentService;