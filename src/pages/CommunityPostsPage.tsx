import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Loader, MessageSquare, Users, UserPlus } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { useCommunityPosts } from '../hooks/usePost';
import { useCommunity, useJoinedCommunities, useCommunityActions } from '../hooks/useCommunity';
import { useUser } from '../hooks/useUser';
import Header from '../layouts/Header';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import type { PostResponseDTO, ProjectPostResponseDTO } from '../services/postService';

export const CommunityPostsPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const numericCommunityId = Number(communityId);
  
  const { community, loading: communityLoading, error: communityError } = useCommunity(numericCommunityId);
  const { posts, loading: postsLoading, refetch, loadMore, hasMore } = useCommunityPosts(numericCommunityId);
  const { joinedCommunities } = useJoinedCommunities();
  const { joinCommunity, leaveCommunity, loading: actionLoading } = useCommunityActions();
  const { userProfile } = useUser();

  // Check if user is a member of this community
  const isMember = joinedCommunities.some((c: any) => c.id === numericCommunityId);
  const isOwner = community?.ownerName === userProfile?.username;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleCreatePost = () => {
    setIsCreateModalOpen(true);
  };

  const handleCommentClick = (post: PostResponseDTO | ProjectPostResponseDTO) => {
    navigate(`/post/${post.id}`);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  const handleJoinLeave = async () => {
    if (!community) return;
    
    try {
      if (isMember) {
        await leaveCommunity(community.id);
      } else {
        await joinCommunity(community.id);
      }
      // Refresh data after join/leave
      window.location.reload();
    } catch (error) {
      console.error('Failed to join/leave community:', error);
    }
  };

  if (communityLoading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Loader className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      </div>
    );
  }

  if (communityError || !community) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{communityError || 'Community not found'}</p>
            <Button
              onClick={() => navigate('/communities')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
            >
              Back to Communities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col pt-20">
        {/* Community Profile Card */}
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center w-full">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-6">
                <Avatar
                  src={community.imageUrl}
                  name={community.name}
                  size="xl"
                />

                <div className="text-center sm:text-left">
                  <h2 className="text-lg md:text-xl font-semibold text-[var(--main)] flex items-center gap-2">
                    <Users size={18} className="text-[var(--primary)]" />
                    {community.name}
                  </h2>

                  <p className="text-[var(--dim)] text-sm mt-1">
                    Created by {community.ownerName}
                  </p>

                  {community.description && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {community.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center sm:justify-start space-x-6 md:space-x-8 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Users size={16} className="text-[var(--primary)]" />
                    <span className="block text-lg font-semibold text-[var(--main)]">
                      {community.memberCount || 0}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    Members
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2 justify-center md:justify-end">
              {!isOwner && (
                <Button
                  onClick={handleJoinLeave}
                  disabled={actionLoading}
                  className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm font-medium w-full md:w-auto justify-center shadow-md hover:shadow-lg ${
                    isMember
                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                      : 'bg-[var(--primary)] text-white hover:bg-[var(--secondary)]'
                  }`}
                >
                  {actionLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>{isMember ? 'Leave Community' : 'Join Community'}</span>
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleCreatePost}
                className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors text-sm font-medium w-full md:w-auto justify-center shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                <span>Create Post</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

        {/* Posts Section */}
        <div className="w-full flex justify-center mt-4 px-4">
          <div className="w-full max-w-4xl">
            {postsLoading && posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Loader className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-4" />
                <p className="text-[var(--dim)]">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--main)] mb-2">No posts yet</h3>
                <p className="text-[var(--dim)] mb-6">
                  Be the first to start a conversation in this community!
                </p>
                <button
                  onClick={handleCreatePost}
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                >
                  <Plus size={16} className="mr-2" />
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={handleCommentClick}
                  />
                ))}

                {hasMore && (
                  <div className="text-center py-6">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        'Load More Posts'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={refetch}
          communityId={numericCommunityId}
        />
      )}
    </div>
  );
};