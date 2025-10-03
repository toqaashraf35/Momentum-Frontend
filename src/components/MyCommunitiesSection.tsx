import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import CommunityCard from './CommunityCard';
import { useMyCommunities, useJoinedCommunities, useCommunityActions } from '../hooks/useCommunity';
import type { CommunityResponse } from '../types/community';

interface MyCommunitiesSectionProps {
  limit?: number;
}

const MyCommunitiesSection: React.FC<MyCommunitiesSectionProps> = ({ limit = 3 }) => {
  const navigate = useNavigate();
  const { myCommunities, loading: myLoading, error: myError, refetch: refetchMy } = useMyCommunities();
  const { joinedCommunities, loading: joinedLoading, error: joinedError, refetch: refetchJoined } = useJoinedCommunities();
  const { leaveCommunity } = useCommunityActions();

  // Combine owned and joined communities, prioritizing owned communities
  const allMyCommunities: CommunityResponse[] = React.useMemo(() => {
    const owned = myCommunities || [];
    const joined = joinedCommunities || [];
    
    // Filter out duplicates (in case user owns and is also listed as member)
    const ownedIds = new Set(owned.map(c => c.id));
    const uniqueJoined = joined.filter(c => !ownedIds.has(c.id));
    
    return [...owned, ...uniqueJoined];
  }, [myCommunities, joinedCommunities]);

  // Apply limit
  const displayCommunities = limit ? allMyCommunities.slice(0, limit) : allMyCommunities;

  const loading = myLoading || joinedLoading;
  const error = myError || joinedError;

  const handleView = (id: number) => {
    navigate(`/community/${id}/posts`);
  };

  const handleLeave = async (id: number) => {
    try {
      await leaveCommunity(id);
      // Refresh both lists
      await Promise.all([refetchMy(), refetchJoined()]);
    } catch (error) {
      console.error('Failed to leave community:', error);
    }
  };

  const getUserRelationship = (communityId: number) => {
    const isOwner = myCommunities?.some(c => c.id === communityId) || false;
    const isMember = joinedCommunities?.some(c => c.id === communityId) || false;
    
    return { isOwner, isMember };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit || 3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-500 text-sm">Failed to load communities</p>
        <button 
          onClick={() => {
            refetchMy();
            refetchJoined();
          }}
          className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (displayCommunities.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-500 text-sm mb-2">You haven't joined any communities yet</p>
        <button 
          onClick={() => navigate('/communities')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Explore Communities
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayCommunities.map((community) => {
        const { isOwner, isMember } = getUserRelationship(community.id);
        
        return (
          <CommunityCard
            key={community.id}
            community={community}
            onView={handleView}
            onLeave={isOwner ? undefined : handleLeave} // Don't allow owners to leave their own communities
            showActions={true}
            isOwner={isOwner}
            isMember={isMember}
            loading={false}
          />
        );
      })}
    </div>
  );
};

export default MyCommunitiesSection;