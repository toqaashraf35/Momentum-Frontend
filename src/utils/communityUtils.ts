import type { CommunityResponse } from '../services/communityService';

// Format community member count for display
export const formatMemberCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}k`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
};

// Get community display info
export const getCommunityDisplayInfo = (community: CommunityResponse) => ({
  memberCountFormatted: formatMemberCount(community.memberCount),
  hasImage: !!community.imageUrl,
  tagCount: community.tags ? community.tags.length : 0
});

// Filter communities by search term
export const filterCommunitiesBySearch = (
  communities: CommunityResponse[],
  searchTerm: string
): CommunityResponse[] => {
  if (!searchTerm.trim()) {
    return communities;
  }

  const term = searchTerm.toLowerCase();
  return communities.filter(
    (community) =>
      community.name.toLowerCase().includes(term) ||
      community.description.toLowerCase().includes(term) ||
      community.ownerName.toLowerCase().includes(term) ||
      (community.tags && community.tags.some(tag => tag.toLowerCase().includes(term)))
  );
};

// Filter communities by tags
export const filterCommunitiesByTags = (
  communities: CommunityResponse[],
  selectedTags: string[]
): CommunityResponse[] => {
  if (!selectedTags.length) {
    return communities;
  }

  return communities.filter(community =>
    community.tags && selectedTags.some(tag =>
      community.tags.some(communityTag =>
        communityTag.toLowerCase() === tag.toLowerCase()
      )
    )
  );
};

// Sort communities
export const sortCommunities = (
  communities: CommunityResponse[],
  sortBy: 'name' | 'memberCount' | 'postCount',
  sortDirection: 'asc' | 'desc' = 'asc'
): CommunityResponse[] => {
  return [...communities].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'memberCount':
        aValue = a.memberCount;
        bValue = b.memberCount;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Get unique tags from communities
export const getUniqueTagsFromCommunities = (communities: CommunityResponse[]): string[] => {
  const tagSet = new Set<string>();
  communities.forEach(community => {
    if (community.tags) {
      community.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
};

// Check if user owns community (based on current user data)
export const isUserCommunityOwner = (_community: CommunityResponse, _userEmail?: string): boolean => {
  // This would need to be implemented based on how you store user data
  // For now, just returning false as placeholder
  // TODO: Implement actual ownership check when user context is available
  return false;
};

// Get community stats
export const getCommunityStats = (community: CommunityResponse) => ({
  id: community.id,
  name: community.name,
  memberCount: community.memberCount,
  tagCount: community.tags ? community.tags.length : 0,
  hasDescription: !!community.description,
  hasImage: !!community.imageUrl
});

// Prepare community data for forms
export const prepareCommunityForEdit = (community: CommunityResponse) => ({
  name: community.name,
  description: community.description || '',
  tags: community.tags || []
});

// Check if community has specific tag
export const communityHasTag = (community: CommunityResponse, tag: string): boolean => {
  return community.tags ? community.tags.some(t => t.toLowerCase() === tag.toLowerCase()) : false;
};