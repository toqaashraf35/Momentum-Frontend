import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import CommunityCard from '../components/CommunityCard';
import CreateCommunityModal from '../components/CreateCommunityModal';
import EditCommunityModal from '../components/EditCommunityModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SearchBar from '../components/SearchBar';
import { useCommunities, useCommunityActions, useMyCommunities, useJoinedCommunities } from '../hooks/useCommunity';
import { useCommunitySearch } from '../hooks/useCommunitySearch';
import type { CommunityResponse, CommunityCreateData, CommunityUpdateData } from '../types/community';
import communityService from '../services/communityService';

const CommunitiesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [memberCountUpdates, setMemberCountUpdates] = useState<{ [key: number]: number }>({});
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'posts'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    community: CommunityResponse | null;
  }>({
    isOpen: false,
    community: null
  });
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    community: CommunityResponse | null;
    loading: boolean;
  }>({
    isOpen: false,
    community: null,
    loading: false
  });
  const { communities, loading, error, refetch } = useCommunities();
  const { myCommunities, refetch: refetchMyCommunities } = useMyCommunities();
  const { joinedCommunities, refetch: refetchJoinedCommunities } = useJoinedCommunities();
  const { joinCommunity, leaveCommunity, createCommunity, updateCommunity, loading: actionLoading, error: actionError } = useCommunityActions();
  
  // Search functionality
  const { 
    searchResults, 
    loading: searchLoading, 
    error: searchError, 
    updateSearchParams,
    clearSearch 
  } = useCommunitySearch();

  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener("openSidebar", handleOpenSidebar);

    return () => {
      window.removeEventListener("openSidebar", handleOpenSidebar);
    };
  }, []);

  const handleJoin = async (id: number) => {
    // Set loading state for this specific community
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const result = await joinCommunity(id);
      if (result) {
        // Only refresh the joined communities list to update button states
        await refetchJoinedCommunities();
        
        // Update member count locally from server response
        if (result.memberCount !== undefined) {
          setMemberCountUpdates(prev => ({
            ...prev,
            [id]: result.memberCount
          }));
        }
      } else {
        alert('Failed to join community. Please try again.');
      }
    } catch (error) {
      alert('Error joining community: ' + (error as any)?.message || 'Unknown error');
    } finally {
      // Remove loading state for this community
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleLeave = async (id: number) => {
    // Set loading state for this specific community
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const result = await leaveCommunity(id);
      if (result) {
        // Only refresh the joined communities list to update button states
        await refetchJoinedCommunities();
        
        // Update member count locally from server response
        if (result.memberCount !== undefined) {
          setMemberCountUpdates(prev => ({
            ...prev,
            [id]: result.memberCount
          }));
        }
      } else {
        alert('Failed to leave community. Please try again.');
      }
    } catch (error) {
      alert('Error leaving community: ' + (error as any)?.message || 'Unknown error');
    } finally {
      // Remove loading state for this community
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (community: CommunityResponse) => {
    setEditModalState({
      isOpen: true,
      community
    });
  };

  const handleEditSubmit = async (id: number, data: CommunityUpdateData, imageFile?: File) => {
    try {
      const result = await updateCommunity(id, data, imageFile);
      if (result) {
        // Refresh all community lists to show the updated community
        await Promise.all([
          refetch(),
          refetchMyCommunities()
        ]);
        
        setEditModalState({
          isOpen: false,
          community: null
        });
      }
    } catch (error) {
      console.error('Failed to update community:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleEditClose = () => {
    setEditModalState({
      isOpen: false,
      community: null
    });
  };

  const handleDeleteRequest = (community: CommunityResponse) => {
    setDeleteModalState({
      isOpen: true,
      community,
      loading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalState.community) return;

    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await communityService.deleteCommunity(deleteModalState.community.id);
      setDeleteModalState({
        isOpen: false,
        community: null,
        loading: false
      });
      // Refresh communities after successful deletion
      refetch();
      refetchMyCommunities();
    } catch (error) {
      console.error('Failed to delete community:', error);
      setDeleteModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalState({
      isOpen: false,
      community: null,
      loading: false
    });
  };

  const handleView = (_id: number) => {
    // Navigate to community detail page
    // You can implement navigation here, e.g., using React Router
  };

  // Handle create community
  const handleCreateCommunity = async (data: CommunityCreateData, imageFile?: File) => {
    try {
      const result = await createCommunity(data, imageFile);
      if (result) {
        // Refresh all community lists to show the new community
        await Promise.all([
          refetch(),
          refetchMyCommunities()
        ]);
      }
    } catch (error) {
      // Error handling is done in the modal component
      throw error;
    }
  };

  // Helper function to determine if user is owner or member
  const getUserRelationship = (communityId: number) => {
    const isOwner = myCommunities?.some(c => c.id === communityId) || false;
    const isMember = joinedCommunities?.some(c => c.id === communityId) || false;
    
    return { isOwner, isMember };
  };

  // Filter communities based on search query
  const filterCommunities = (communityList: CommunityResponse[]) => {
    if (!communityList) return [];
    
    if (!searchQuery.trim()) {
      return communityList;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return communityList.filter(community => 
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query) ||
      community.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      // Use backend search API
      updateSearchParams({ query: query.trim() });
    } else {
      // Clear search results
      clearSearch();
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      // Use backend search API with debounce
      updateSearchParams({ query: query.trim() });
    } else {
      // Clear search results immediately when query is empty
      clearSearch();
    }
  };

  // Get the communities to display (search results or all communities)
  const getDisplayCommunities = (): CommunityResponse[] => {
    if (searchQuery.trim() && searchResults) {
      // Use backend search results
      return searchResults.content;
    } else if (!searchQuery.trim()) {
      // Use all communities when not searching
      return communities || [];
    } else {
      // Fallback to client-side filtering while searching
      return filterCommunities(communities || []);
    }
  };

  // Check if we're currently searching
  const isSearching = searchQuery.trim().length > 0;

  // Sort communities based on selected criteria
  const sortCommunities = (communityList: CommunityResponse[]) => {
    if (!communityList) return [];
    
    const sorted = [...communityList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      // Apply member count updates if available
      const aUpdatedCount = memberCountUpdates[a.id] ?? a.memberCount;
      const bUpdatedCount = memberCountUpdates[b.id] ?? b.memberCount;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'members':
          aValue = aUpdatedCount;
          bValue = bUpdatedCount;
          break;
        case 'posts':
          aValue = a.postCount;
          bValue = b.postCount;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        const numA = Number(aValue);
        const numB = Number(bValue);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
    
    return sorted;
  };

  // Combined loading state
  const isLoading = loading || (isSearching && searchLoading);
  
  // Combined error state
  const currentError = error || (isSearching ? searchError : null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[20%_1fr] grid-rows-[7%_1fr] h-screen bg-gray-50">
        <div className="row-start-2">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>
        
        {/* Main content */}
        <div className="col-span-2">
          <Header />
        </div>
        
        {/* Communities content area */}
        <div className="col-start-2 row-start-2 bg-[var(--bg)] p-6 overflow-auto pt-20">
          {/* Loading State */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-[var(--primary)]" size={24} />
              <h1 className="text-2xl font-bold text-[var(--main)]">Communities</h1>
            </div>
            <p className="text-[var(--dim)] text-sm mb-6">
              Discover and join communities that match your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="grid grid-cols-[20%_1fr] grid-rows-[7%_1fr] h-screen bg-gray-50">
        <div className="row-start-2">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>
        
        {/* Main content */}
        <div className="col-span-2">
          <Header />
        </div>
        
        {/* Error content area */}
        <div className="col-start-2 row-start-2 bg-[var(--bg)] flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[var(--main)] mb-2">
              {isSearching ? 'Error Searching Communities' : 'Error Loading Communities'}
            </h2>
            <p className="text-[var(--dim)] mb-2">{currentError}</p>
            {actionError && (
              <p className="text-red-500 text-sm mb-4">Action Error: {actionError}</p>
            )}
            <div className="text-xs text-[var(--dim)] mb-4">
              <p>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
              <p>API Base: http://localhost:8081/api</p>
            </div>
            <div className="flex gap-3 justify-center">
              {isSearching && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    clearSearch();
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
              <button 
                onClick={refetch}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[20%_1fr] grid-rows-[7%_1fr] h-screen bg-gray-50">
      <div className="row-start-2">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      
      {/* Main content */}
      <div className="col-span-2">
        <Header />
      </div>
      
      {/* Communities content area */}
      <div className="col-start-2 row-start-2 bg-[var(--bg)] p-6 overflow-auto pt-20">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--primary)]" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-[var(--main)]">Communities</h1>
                <p className="text-[var(--dim)] text-sm">
                  Discover and join communities that match your interests
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                placeholder="Search communities..."
                className="w-64"
              />
              
              {/* Create Community Button */}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-colors duration-200 whitespace-nowrap"
              >
                <Plus size={16} />
                Create Community
              </button>
            </div>
          </div>
        </div>

        {/* Communities Content */}
        {(() => {
          const displayCommunities = getDisplayCommunities();
          const hasAnyCommunities = communities && communities.length > 0;
          
          return hasAnyCommunities || (isSearching && searchResults) ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-[var(--dim)] text-sm">
                  {(() => {
                    if (isSearching && searchResults) {
                      const totalSearchResults = searchResults.totalElements;
                      return `Found ${displayCommunities.length} of ${totalSearchResults} communities${searchResults.totalPages > 1 ? ' (showing first page)' : ''}`;
                    } else if (isSearching) {
                      // Fallback to client-side filtering
                      const filteredCount = displayCommunities.length;
                      const totalCount = communities?.length || 0;
                      return `Found ${filteredCount} of ${totalCount} communities`;
                    } else {
                      const totalCount = communities?.length || 0;
                      return `Found ${totalCount} communities`;
                    }
                  })()}
                  {searchLoading && (
                    <span className="ml-2 text-[var(--primary)]">
                      <span className="animate-pulse">Searching...</span>
                    </span>
                  )}
                </p>
                <select 
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field as 'name' | 'members' | 'posts');
                    setSortDirection(direction as 'asc' | 'desc');
                  }}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                  <option value="members-desc">Sort by Members (High to Low)</option>
                  <option value="members-asc">Sort by Members (Low to High)</option>
                  <option value="posts-desc">Sort by Posts (High to Low)</option>
                  <option value="posts-asc">Sort by Posts (Low to High)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const sorted = sortCommunities(displayCommunities);
                  
                  if (displayCommunities.length === 0 && isSearching) {
                    return (
                      <div className="col-span-full text-center py-12">
                        <Users className="mx-auto text-[var(--dim)] mb-4" size={48} />
                        <h3 className="text-lg font-medium text-[var(--main)] mb-2">No communities found</h3>
                        <p className="text-[var(--dim)] mb-4">
                          Try adjusting your search terms or browse all communities
                        </p>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            clearSearch();
                          }}
                          className="px-4 py-2 text-[var(--primary)] border border-[var(--primary)] rounded-lg font-medium hover:bg-[var(--primary)] hover:text-white transition-colors duration-200"
                        >
                          Clear Search
                        </button>
                      </div>
                    );
                  }
                  
                  return sorted.map((community: CommunityResponse) => {
                    const { isOwner, isMember } = getUserRelationship(community.id);
                    
                    // Use updated member count if available from server response
                    const updatedMemberCount = memberCountUpdates[community.id];
                    const displayCommunity = updatedMemberCount !== undefined 
                      ? { ...community, memberCount: updatedMemberCount }
                      : community;
                    
                    return (
                      <CommunityCard
                        key={community.id}
                        community={displayCommunity}
                        onJoin={handleJoin}
                        onLeave={handleLeave}
                        onEdit={handleEdit}
                        onDeleteRequest={handleDeleteRequest}
                        onView={handleView}
                        showActions={true}
                        isOwner={isOwner}
                        isMember={isMember}
                        loading={loadingStates[community.id] || false}
                      />
                    );
                  });
                })()}
              </div>
            </>
          ) : (
          <div className="text-center py-12">
            <Users className="mx-auto text-[var(--dim)] mb-4" size={64} />
            <h3 className="text-xl font-semibold text-[var(--main)] mb-2">No Communities Found</h3>
            <p className="text-[var(--dim)] mb-6">
              Be the first to create a community and start building connections!
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-colors duration-200 mx-auto"
            >
              <Plus size={16} />
              Create First Community
            </button>
          </div>
        );
        })()}
      </div>
      
      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCommunity}
        loading={actionLoading}
      />

      {/* Edit Community Modal */}
      <EditCommunityModal
        isOpen={editModalState.isOpen}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        community={editModalState.community}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Community"
        message={`Are you sure you want to delete "${deleteModalState.community?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteModalState.loading}
      />
    </div>
  );
};

export default CommunitiesPage;