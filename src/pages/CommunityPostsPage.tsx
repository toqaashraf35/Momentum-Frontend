import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Loader, MessageSquare, Users, UserPlus, ArrowRight } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { useCommunityPosts } from '../hooks/usePost';
import { useCommunity, useJoinedCommunities, useCommunityActions, useCommunities } from '../hooks/useCommunity';
import { useUser } from '../hooks/useUser';
import Header from '../components/Header';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Alert from '../components/Alert';
import authService from '../services/authService';
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
  const { communities } = useCommunities();

  // Check if user is a member of this community
  const isMember = joinedCommunities.some((c: any) => c.id === numericCommunityId);
  const isOwner = community?.ownerName === userProfile?.username;

  // Filter out the current community from the suggestions
  const otherCommunities = communities.filter(c => c.id !== numericCommunityId).slice(0, 5);

  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

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

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
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
        <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Loader className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      </div>
    );
  }

  if (communityError || !community) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex flex-col">
        <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{communityError || 'Community not found'}</p>
            <Button
              onClick={() => navigate('/communities')}
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
      <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
      
      <div className="flex-1 flex pt-20 gap-4 px-4">
        {/* Main Content - Community Info + Posts */}
        <div className="flex-1">
          {/* Community Profile Card */}
          <div className="w-full">
            <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0">
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

                    <div className="flex items-center gap-1 mt-3">
                      <Users size={16} className="text-[var(--primary)]" />
                      <span className="text-lg font-semibold text-[var(--main)]">
                        {community.memberCount || 0}
                      </span>
                      <span className="text-sm text-[var(--dim)] ml-1">Members</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0">
                  {!isOwner && (
                    <button
                      onClick={handleJoinLeave}
                      disabled={actionLoading}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium justify-center shadow-md hover:shadow-lg ${
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
                    </button>
                  )}
                  
                  <button
                    onClick={handleCreatePost}
                    className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors text-sm font-medium justify-center shadow-md hover:shadow-lg"
                  >
                    <Plus size={16} />
                    <span>Create Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full mt-4">
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
                    <button
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
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Other Communities */}
        <div className="w-80 hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--main)] mb-4 flex items-center gap-2">
                <Users size={18} className="text-[var(--primary)]" />
                Explore Communities
              </h3>
              
              {otherCommunities.length === 0 ? (
                <p className="text-[var(--dim)] text-sm text-center py-4">
                  No other communities available
                </p>
              ) : (
                <div className="space-y-3">
                  {otherCommunities.map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => navigate(`/community/${comm.id}/posts`)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <Avatar
                        src={comm.imageUrl}
                        name={comm.name}
                        size="sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--main)] text-sm truncate group-hover:text-[var(--primary)] transition-colors">
                          {comm.name}
                        </p>
                        <p className="text-xs text-[var(--dim)] truncate">
                          {comm.memberCount || 0} members
                        </p>
                      </div>
                      
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/communities')}
                  className="w-full text-center text-sm text-[var(--primary)] hover:text-[var(--secondary)] font-medium transition-colors"
                >
                  View All Communities
                </button>
              </div>
            </div>
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

      {/* Logout Alert */}
      {isLogoutAlertOpen && (
        <Alert
          title="Confirm Logout"
          description="Are you sure you want to log out of your account?"
          confirmText="Logout"
          cancelText="Cancel"
          onCancel={() => setIsLogoutAlertOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};