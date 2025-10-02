// Re-export types from services for convenience
export type {
  PostRequestDTO,
  ProjectPostRequestDTO,
  PostResponseDTO,
  ProjectPostResponseDTO,
  PostLikeResponseDTO,
  PaginatedPostResponse
} from '../services/postService';

export type {
  CommentRequestDTO,
  CommentResponseDTO,
  CommentLikeResponseDTO
} from '../services/commentService';

// Import types for use within this file
import type {
  PostResponseDTO
} from '../services/postService';

import type {
  CommentResponseDTO
} from '../services/commentService';

// Extended types for UI state management
export interface PostState {
  posts: PostResponseDTO[];
  myPosts: PostResponseDTO[];
  feedPosts: PostResponseDTO[];
  communityPosts: PostResponseDTO[];
  currentPost: PostResponseDTO | null;
  loading: boolean;
  error: string | null;
}

export interface CommentState {
  comments: CommentResponseDTO[];
  loading: boolean;
  error: string | null;
}

// Form state types for posts
export interface PostFormData {
  content: string;
  communityId: number;
  // For project posts
  title?: string;
  teamSize?: number;
  requiredSkills?: string[];
}

export interface PostFormErrors {
  content?: string;
  communityId?: string;
  title?: string;
  teamSize?: string;
  requiredSkills?: string;
}

export interface PostFormState {
  data: PostFormData;
  errors: PostFormErrors;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Form state types for comments
export interface CommentFormData {
  content: string;
}

export interface CommentFormErrors {
  content?: string;
}

export interface CommentFormState {
  data: CommentFormData;
  errors: CommentFormErrors;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// UI-specific types
export interface PostCardProps {
  post: PostResponseDTO;
  onLike?: (postId: number) => void;
  onUnlike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onEdit?: (post: PostResponseDTO) => void;
  onDelete?: (postId: number) => void;
  showActions?: boolean;
  isLiked?: boolean;
  loading?: boolean;
}

export interface CommentCardProps {
  comment: CommentResponseDTO;
  onLike?: (commentId: number) => void;
  onUnlike?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  showActions?: boolean;
  isLiked?: boolean;
  loading?: boolean;
}

// Pagination helpers
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Post types
export const PostType = {
  REGULAR: 'REGULAR',
  PROJECT: 'PROJECT'
} as const;

export type PostType = typeof PostType[keyof typeof PostType];

// Action types for post management
export interface PostActionParams {
  postId: number;
  action: 'like' | 'unlike' | 'delete';
}

export interface CommentActionParams {
  commentId: number;
  action: 'like' | 'unlike' | 'delete';
}

// Feed types
export const FeedType = {
  MY_FEED: 'MY_FEED',
  MY_POSTS: 'MY_POSTS',
  COMMUNITY_POSTS: 'COMMUNITY_POSTS'
} as const;

export type FeedType = typeof FeedType[keyof typeof FeedType];

// Post visibility and permissions
export interface PostPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canComment: boolean;
  canLike: boolean;
}

export interface CommentPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canLike: boolean;
}

// Search and filter types for posts
export interface PostSearchParams {
  query?: string;
  communityId?: number;
  authorId?: number;
  postType?: PostType;
  sortBy?: 'createdAt' | 'likesCount' | 'commentsCount';
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

// Project post specific types
export interface ProjectRequirement {
  skill: string;
  required: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface EnhancedProjectPostData extends PostFormData {
  requirements: ProjectRequirement[];
  deadline?: string;
  remote?: boolean;
  paid?: boolean;
}

// Interaction statistics
export interface PostStatistics {
  totalLikes: number;
  totalComments: number;
  totalViews?: number;
  engagementRate?: number;
}

export interface UserInteractionHistory {
  likedPosts: number[];
  likedComments: number[];
  commentedPosts: number[];
}

// Notification types related to posts
export interface PostNotification {
  id: number;
  type: 'like' | 'comment' | 'mention';
  postId: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}