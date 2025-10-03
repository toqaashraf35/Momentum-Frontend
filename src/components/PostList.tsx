import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, MessageSquare } from 'lucide-react';
import { PostCard } from './PostCard';
import Button from './Button';
import type { PostResponseDTO, ProjectPostResponseDTO } from '../services/postService';
import postService from '../services/postService';
import { useUser } from '../hooks/useUser';

interface PostListProps {
  posts: (PostResponseDTO | ProjectPostResponseDTO)[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  showCommunityName?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  onRefresh,
  showCommunityName = true,
  emptyMessage = "No posts yet",
  emptyDescription = "Be the first to start a conversation!",
  className = ''
}) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();

  const [loadingMore, setLoadingMore] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  // Pre-compute which posts are liked by current user (avoids N re-renders in each PostCard later)
  useEffect(() => {
    let cancelled = false;
    const computeLikes = async () => {
      if (!userProfile?.id) return;
      // Seed from backend-provided flags if present
      const seed: Record<number, boolean> = {};
      let seeded = false;
      posts.forEach(p => {
        if (p.isLikedByCurrentUser !== undefined) {
          seed[p.id] = !!p.isLikedByCurrentUser;
          seeded = true;
        }
      });
      if (seeded) {
        setLikedMap(prev => ({ ...seed, ...prev }));
      }
      // If we already have liked states for all posts currently rendered, skip fetch.
      if (posts.length > 0 && posts.every(p => likedMap[p.id] !== undefined)) return;
      // Fire requests in parallel for better performance
      try {
        const results = await Promise.all(
          posts.map(async (p) => {
            try {
              const likes = await postService.getPostLikes(p.id);
              return [p.id, likes.some(like => like.userId === userProfile.id)] as [number, boolean];
            } catch {
              return [p.id, false] as [number, boolean];
            }
          })
        );
        if (!cancelled) {
          const entries: Record<number, boolean> = {};
          results.forEach(([id, liked]) => { entries[id] = liked; });
          setLikedMap(entries);
        }
      } catch (e) {
        // swallow – individual errors handled above
      }
    };
    computeLikes();
    return () => { cancelled = true; };
  }, [posts, userProfile?.id]);

  const handleChildLikeState = (postId: number, liked: boolean) => {
    setLikedMap(prev => ({ ...prev, [postId]: liked }));
  };

  const handleCommentClick = (post: PostResponseDTO | ProjectPostResponseDTO) => {
    navigate(`/post/${post.id}`);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !onLoadMore) return;
    
    setLoadingMore(true);
    await onLoadMore();
    setLoadingMore(false);
  };

  if (loading && posts.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 bg-white rounded-lg shadow-md ${className}`}>
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => {
          const initialIsLiked = likedMap[post.id];
          return (
            <PostCard
              key={post.id}
              post={post}
              onCommentClick={handleCommentClick}
              showCommunityName={showCommunityName}
              initialIsLiked={initialIsLiked}
              onLikeStateChange={(id, liked) => handleChildLikeState(id, liked)}
            />
          );
        })}

        {/* Load More Button */}
        {hasMore && onLoadMore && (
          <div className="text-center py-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {loadingMore ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};