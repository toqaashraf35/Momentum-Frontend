import { useState, useEffect, useCallback } from 'react';
import postService from '../services/postService';
import type {
  PostRequestDTO,
  ProjectPostRequestDTO,
  PostResponseDTO,
  PaginatedPostResponse
} from '../services/postService';

// Hook for managing posts in a community
export const useCommunityPosts = (communityId: number, initialPage: number = 0, initialSize: number = 10) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [pagination, setPagination] = useState<PaginatedPostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (page: number = initialPage, size: number = initialSize) => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPostsByCommunity(communityId, page, size);
      console.log(`GET /api/post/community/${communityId} - Response:`, data);
      setPosts(data.content);
      setPagination(data);
    } catch (err: any) {
      console.log(`GET /api/post/community/${communityId} - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch community posts');
    } finally {
      setLoading(false);
    }
  }, [communityId, initialPage, initialSize]);

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId, fetchPosts]);

  const loadMore = useCallback(async () => {
    if (pagination && !pagination.last) {
      const nextPage = pagination.number + 1;
      setLoading(true);
      try {
        const data = await postService.getPostsByCommunity(communityId, nextPage, pagination.size);
        console.log(`GET /api/post/community/${communityId} (page ${nextPage}) - Response:`, data);
        setPosts(prev => [...prev, ...data.content]);
        setPagination(data);
      } catch (err: any) {
        console.log(`GET /api/post/community/${communityId} (page ${nextPage}) - Error Response:`, err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to load more posts');
      } finally {
        setLoading(false);
      }
    }
  }, [communityId, pagination]);

  return { 
    posts, 
    pagination, 
    loading, 
    error, 
    refetch: () => fetchPosts(),
    loadMore,
    hasMore: pagination ? !pagination.last : false
  };
};

// Hook for managing user's feed
export const useMyFeed = (initialPage: number = 0, initialSize: number = 10) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [pagination, setPagination] = useState<PaginatedPostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async (page: number = initialPage, size: number = initialSize) => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getMyFeed(page, size);
      console.log('GET /api/post/my/feed - Response:', data);
      setPosts(data.content);
      setPagination(data);
    } catch (err: any) {
      console.log('GET /api/post/my/feed - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch feed');
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialSize]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const loadMore = useCallback(async () => {
    if (pagination && !pagination.last) {
      const nextPage = pagination.number + 1;
      setLoading(true);
      try {
        const data = await postService.getMyFeed(nextPage, pagination.size);
        console.log(`GET /api/post/my/feed (page ${nextPage}) - Response:`, data);
        setPosts(prev => [...prev, ...data.content]);
        setPagination(data);
      } catch (err: any) {
        console.log(`GET /api/post/my/feed (page ${nextPage}) - Error Response:`, err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to load more posts');
      } finally {
        setLoading(false);
      }
    }
  }, [pagination]);

  return { 
    posts, 
    pagination, 
    loading, 
    error, 
    refetch: () => fetchFeed(),
    loadMore,
    hasMore: pagination ? !pagination.last : false
  };
};

// Hook for managing user's own posts
export const useMyPosts = (initialPage: number = 0, initialSize: number = 10) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [pagination, setPagination] = useState<PaginatedPostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPosts = useCallback(async (page: number = initialPage, size: number = initialSize) => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getMyPosts(page, size);
      console.log('GET /api/post/my - Response:', data);
      setPosts(data.content);
      setPagination(data);
    } catch (err: any) {
      console.log('GET /api/post/my - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch my posts');
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialSize]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  return { 
    posts, 
    pagination, 
    loading, 
    error, 
    refetch: () => fetchMyPosts()
  };
};

// Hook for managing a single post
export const usePost = (postId: number) => {
  const [post, setPost] = useState<PostResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPostById(postId);
      console.log(`GET /api/post/${postId} - Response:`, data);
      setPost(data);
    } catch (err: any) {
      console.log(`GET /api/post/${postId} - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
};

// Hook for post actions (create, update, delete, like)
export const usePostActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRegularPost = useCallback(async (postData: PostRequestDTO): Promise<PostResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.createRegularPost(postData);
      console.log('POST /api/post/regular/create - Response:', data);
      return data;
    } catch (err: any) {
      console.log('POST /api/post/regular/create - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectPost = useCallback(async (postData: ProjectPostRequestDTO): Promise<PostResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.createProjectPost(postData);
      console.log('POST /api/post/project/create - Response:', data);
      return data;
    } catch (err: any) {
      console.log('POST /api/post/project/create - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to create project post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRegularPost = useCallback(async (id: number, postData: PostRequestDTO): Promise<PostResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.updateRegularPost(id, postData);
      console.log(`PUT /api/post/regular/${id} - Response:`, data);
      return data;
    } catch (err: any) {
      console.log(`PUT /api/post/regular/${id} - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectPost = useCallback(async (id: number, postData: ProjectPostRequestDTO): Promise<PostResponseDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.updateProjectPost(id, postData);
      console.log(`PUT /api/post/project/${id} - Response:`, data);
      return data;
    } catch (err: any) {
      console.log(`PUT /api/post/project/${id} - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update project post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await postService.deletePost(id);
      console.log(`DELETE /api/post/${id} - Response: Success`);
      return true;
    } catch (err: any) {
      console.log(`DELETE /api/post/${id} - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      await postService.likePost(id);
      console.log(`POST /api/post/${id}/like - Response: Success`);
      return true;
    } catch (err: any) {
      console.log(`POST /api/post/${id}/like - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to like post');
      return false;
    }
  }, []);

  const unlikePost = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      await postService.unlikePost(id);
      console.log(`DELETE /api/post/${id}/like - Response: Success`);
      return true;
    } catch (err: any) {
      console.log(`DELETE /api/post/${id}/like - Error Response:`, err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to unlike post');
      return false;
    }
  }, []);

  return {
    loading,
    error,
    createRegularPost,
    createProjectPost,
    updateRegularPost,
    updateProjectPost,
    deletePost,
    likePost,
    unlikePost
  };
};