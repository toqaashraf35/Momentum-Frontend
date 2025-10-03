import api from "./api";
import type { CommentResponseDTO } from "./commentService";

// Types based on backend DTOs
export interface PostRequestDTO {
  content: string;
  communityId: number;
}

export interface ProjectPostRequestDTO extends PostRequestDTO {
  title: string;
  teamSize: number;
  requiredSkills?: string[]; // Optional skills array
}

export interface PostResponseDTO {
  id: number;
  content: string;
  authorId: number;
  authorUsername: string;
  communityId: number;
  communityName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  postType: string;
  // Optional field the backend can include to indicate current user's like status
  isLikedByCurrentUser?: boolean;
}

export interface ProjectPostResponseDTO extends PostResponseDTO {
  title: string;
  teamSize: number;
  requiredSkills: string[];
}

export interface PostLikeResponseDTO {
  userId: number;
  username: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface PaginatedPostResponse {
  content: PostResponseDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

class PostService {
  /**
   * Create a regular post
   * @param postData - Post data to create
   */
  async createRegularPost(postData: PostRequestDTO): Promise<PostResponseDTO> {
    try {
      const response = await api.post<PostResponseDTO>(`/post/regular/create/${postData.communityId}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a project post
   * @param postData - Project post data to create
   */
  async createProjectPost(postData: ProjectPostRequestDTO): Promise<PostResponseDTO> {
    try {
      // Clean the data before sending
      const cleanedData = {
        content: postData.content,
        communityId: postData.communityId,
        title: postData.title,
        teamSize: postData.teamSize,
        // Only include requiredSkills if there are actual skills
        ...(postData.requiredSkills && postData.requiredSkills.length > 0 ? { requiredSkills: postData.requiredSkills } : {})
      };
      
      const response = await api.post<PostResponseDTO>(`/post/project/create/${postData.communityId}`, cleanedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a regular post
   * @param id - Post ID
   * @param postData - Updated post data
   */
  async updateRegularPost(id: number, postData: PostRequestDTO): Promise<PostResponseDTO> {
    try {
      const response = await api.put<PostResponseDTO>(`/post/regular/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a project post
   * @param id - Post ID
   * @param postData - Updated project post data
   */
  async updateProjectPost(id: number, postData: ProjectPostRequestDTO): Promise<PostResponseDTO> {
    try {
      const response = await api.put<PostResponseDTO>(`/post/project/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a post
   * @param id - Post ID
   */
  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/post/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get posts by community with pagination
   * @param communityId - Community ID
   * @param page - Page number (default 0)
   * @param size - Page size (default 10)
   */
  async getPostsByCommunity(
    communityId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedPostResponse> {
    try {
      const response = await api.get<PaginatedPostResponse>(
        `/post/community/${communityId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's personalized feed
   * @param page - Page number (default 0)
   * @param size - Page size (default 10)
   */
  async getMyFeed(page: number = 0, size: number = 10): Promise<PaginatedPostResponse> {
    try {
      const response = await api.get<PaginatedPostResponse>(
        `/post/my/feed?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get posts created by the current user
   * @param page - Page number (default 0)
   * @param size - Page size (default 10)
   */
  async getMyPosts(page: number = 0, size: number = 10): Promise<PaginatedPostResponse> {
    try {
      const response = await api.get<PaginatedPostResponse>(
        `/post/my?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific post by ID
   * @param id - Post ID
   */
  async getPostById(id: number): Promise<PostResponseDTO> {
    try {
      const response = await api.get<PostResponseDTO>(`/post/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Like a post
   * @param id - Post ID
   */
  async likePost(id: number): Promise<void> {
    try {
      await api.post(`/post/${id}/like`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unlike a post
   * @param id - Post ID
   */
  async unlikePost(id: number): Promise<void> {
    try {
      await api.delete(`/post/${id}/like`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all likes for a post
   * @param id - Post ID
   */
  async getPostLikes(id: number): Promise<PostLikeResponseDTO[]> {
    try {
      const response = await api.get<PostLikeResponseDTO[]>(`/post/${id}/likes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all comments for a post
   * @param id - Post ID
   */
  async getPostComments(id: number): Promise<CommentResponseDTO[]> {
    try {
      const response = await api.get<CommentResponseDTO[]>(`/post/${id}/comments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const postService = new PostService();
export default postService;