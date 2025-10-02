import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { CommentList } from '../components/CommentList';
import { AddCommentForm } from '../components/AddCommentForm';
import { usePost } from '../hooks/usePost';
import Header from '../layouts/Header';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { post, loading, error, refetch } = usePost(Number(postId));

  const [commentRefreshTrigger, setCommentRefreshTrigger] = useState(0);

  const handleCommentAdded = () => {
    setCommentRefreshTrigger(prev => prev + 1);
    refetch(); // Refresh post to update comment count
  };

  const handleCommentDeleted = () => {
    setCommentRefreshTrigger(prev => prev + 1);
    refetch(); // Refresh post to update comment count
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
            <button
              onClick={() => navigate('/communities')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
            >
              Back to Communities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/community/${post.communityId}/posts`)}
          className="flex items-center space-x-2 text-[var(--dim)] hover:text-[var(--main)] mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to {post.communityName}</span>
        </button>

        {/* Post Card */}
        <div className="mb-8">
          <PostCard
            post={post}
            showCommunityName={true}
          />
        </div>

        {/* Add Comment Form */}
        <div className="mb-8">
          <AddCommentForm
            postId={post.id}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {/* Comments List */}
        <CommentList
          key={commentRefreshTrigger} // Force re-render when comments change
          postId={post.id}
          onDeleteComment={handleCommentDeleted}
        />
      </div>
    </div>
  );
};