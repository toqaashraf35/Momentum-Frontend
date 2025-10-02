import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, User, Calendar } from 'lucide-react';
import type { PostResponseDTO, ProjectPostResponseDTO } from '../services/postService';
import { usePostActions } from '../hooks/usePost';
import { useUser } from '../hooks/useUser';
import postService from '../services/postService';

interface PostCardProps {
  post: PostResponseDTO | ProjectPostResponseDTO;
  onCommentClick?: (post: PostResponseDTO | ProjectPostResponseDTO) => void;
  showCommunityName?: boolean;
  className?: string;
  /**
   * (Optional) initial liked status for the current user, passed from parent to avoid N+1 like status fetches.
   * If undefined, the component will fall back to fetching the like status itself.
   */
  initialIsLiked?: boolean;
  /**
   * Callback to notify parent when like state changes (postId, isLiked, newLikeCount)
   */
  onLikeStateChange?: (postId: number, liked: boolean, likeCount: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onCommentClick,
  showCommunityName = true,
  className = '',
  initialIsLiked,
  onLikeStateChange
}) => {
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const { likePost, unlikePost } = usePostActions();
  const { userProfile } = useUser();
  const initializedFromProp = React.useRef(false);

  const isProjectPost = post.postType === 'PROJECT';
  const projectPost = isProjectPost ? post as ProjectPostResponseDTO : null;


  useEffect(() => {
    if (!initializedFromProp.current && initialIsLiked !== undefined) {
      setIsLiked(initialIsLiked);
      initializedFromProp.current = true;
    }
  }, [initialIsLiked]);


  useEffect(() => {
    if (initialIsLiked !== undefined) return; 
    let cancelled = false;
    const fetchStatus = async () => {
      if (!userProfile?.id) return;
      try {
        const likes = await postService.getPostLikes(post.id);
        if (!cancelled) {
          setIsLiked(likes.some(like => like.userId === userProfile.id));
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch like status', e);
          setIsLiked(false);
        }
      }
    };
    fetchStatus();
    return () => { cancelled = true; };
  }, [post.id, userProfile?.id, initialIsLiked]);

  const handleLikeToggle = async () => {
    if (isLiking || isLiked === undefined) return; 
    const nextLiked = !isLiked;
    const optimisticCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    
    // Optimistic update
    setIsLiked(nextLiked);
    setLikeCount(optimisticCount);
    onLikeStateChange?.(post.id, nextLiked, optimisticCount);
    
    setIsLiking(true);
    try {
      const success = nextLiked ? await likePost(post.id) : await unlikePost(post.id);
      if (success) {
        // Get the actual like count from backend
        try {
          const likes = await postService.getPostLikes(post.id);
          const actualCount = likes.length;
          setLikeCount(actualCount);
          onLikeStateChange?.(post.id, nextLiked, actualCount);
        } catch {
          // If we can't get the exact count, keep the optimistic count
          console.warn('Could not fetch updated like count for post', post.id);
        }
      } else {
        // Revert on failure
        setIsLiked(!nextLiked);
        setLikeCount(likeCount);
        onLikeStateChange?.(post.id, !nextLiked, likeCount);
      }
    } catch (e) {
      console.error('Error toggling like', e);
      // Revert
      setIsLiked(!nextLiked);
      setLikeCount(likeCount);
      onLikeStateChange?.(post.id, !nextLiked, likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    onCommentClick?.(post);
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${post.id}`;
      await navigator.clipboard.writeText(postUrl);
      
      setShowCopyNotification(true);
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy post link:', error);
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/post/${post.id}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopyNotification(true);
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 3000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
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
    <div className={`relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${className}`}>
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">@{post.authorUsername}</h4>
                {isProjectPost && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    Project
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
                {showCommunityName && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-blue-600">{post.communityName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Project posts have title, regular posts just show content */}
        {isProjectPost && projectPost?.title && (
          <h3 className="font-bold text-lg text-gray-900 mb-2">{projectPost.title}</h3>
        )}
        <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

        {/* Project-specific content */}
        {isProjectPost && projectPost && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Team Size:</h5>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {projectPost.teamSize} members
                </span>
              </div>
              
              {projectPost.requiredSkills && projectPost.requiredSkills.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Required Skills:</h5>
                  <div className="flex flex-wrap gap-2">
                    {projectPost.requiredSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              disabled={isLiking || isLiked === undefined}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                isLiked === undefined
                  ? 'text-gray-400 bg-gray-50 cursor-wait'
                  : isLiked
                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              } ${(isLiking || isLiked === undefined) ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label={isLiked === undefined ? 'Loading like status' : isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likeCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.commentsCount}</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Copy Notification */}
        {showCopyNotification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Post link copied! Ready to share anywhere.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};