import { useState, useEffect, useCallback } from 'react';
import communityService from '../services/communityService';
import type {
  CommunityResponse,
  CommunityCreateData,
  CommunityUpdateData,
  CommunitySearchParams,
  PaginatedCommunityResponse
} from '../services/communityService';

// Hook for managing all communities
export const useCommunities = () => {
  const [communities, setCommunities] = useState<CommunityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getAllCommunities();
      console.log('GET /api/community/all - Response:', data);
      setCommunities(data);
    } catch (err: any) {
      console.log('GET /api/community/all - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return { communities, loading, error, refetch: fetchCommunities };
};

// Hook for managing a single community
export const useCommunity = (id: number) => {
  const [community, setCommunity] = useState<CommunityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunity = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getCommunityById(id);
      setCommunity(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch community');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  return { community, loading, error, refetch: fetchCommunity };
};

// Hook for managing user's owned communities
export const useMyCommunities = () => {
  const [myCommunities, setMyCommunities] = useState<CommunityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getMyCommunities();
      console.log('GET /api/community/my-communities - Response:', data);
      setMyCommunities(data);
    } catch (err: any) {
      console.log('GET /api/community/my-communities - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch your communities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCommunities();
  }, [fetchMyCommunities]);

  return { myCommunities, loading, error, refetch: fetchMyCommunities };
};

// Hook for managing user's joined communities
export const useJoinedCommunities = () => {
  const [joinedCommunities, setJoinedCommunities] = useState<CommunityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoinedCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getJoinedCommunities();
      console.log('GET /api/community/joined - Response:', data);
      setJoinedCommunities(data);
    } catch (err: any) {
      console.log('GET /api/community/joined - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch joined communities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoinedCommunities();
  }, [fetchJoinedCommunities]);

  return { joinedCommunities, loading, error, refetch: fetchJoinedCommunities };
};

// Hook for community search with pagination
export const useCommunitySearch = (initialParams?: CommunitySearchParams) => {
  const [searchResults, setSearchResults] = useState<PaginatedCommunityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<CommunitySearchParams>(initialParams || {});

  const searchCommunities = useCallback(async (params?: CommunitySearchParams) => {
    setLoading(true);
    setError(null);
    const searchParamsToUse = params || searchParams;
    
    try {
      const data = await communityService.searchCommunities(searchParamsToUse);
      setSearchResults(data);
      if (params) {
        setSearchParams(params);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search communities');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const updateSearchParams = useCallback((newParams: Partial<CommunitySearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    searchCommunities(updatedParams);
  }, [searchParams, searchCommunities]);

  return {
    searchResults,
    loading,
    error,
    searchParams,
    searchCommunities,
    updateSearchParams
  };
};

// Hook for community actions (create, update, delete, join, leave)
export const useCommunityActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCommunity = useCallback(async (
    communityData: CommunityCreateData,
    imageFile?: File
  ): Promise<CommunityResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.createCommunity(communityData, imageFile);
      console.log('POST /api/community - Response:', data);
      return data;
    } catch (err: any) {
      console.log('POST /api/community - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to create community');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCommunity = useCallback(async (
    id: number,
    updateData: CommunityUpdateData,
    imageFile?: File
  ): Promise<CommunityResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.updateCommunity(id, updateData, imageFile);
      console.log('PUT /api/community/' + id + ' - Response:', data);
      return data;
    } catch (err: any) {
      console.log('PUT /api/community/' + id + ' - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update community');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCommunity = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await communityService.deleteCommunity(id);
      console.log('DELETE /api/community/' + id + ' - Response: Success');
      return true;
    } catch (err: any) {
      console.log('DELETE /api/community/' + id + ' - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to delete community');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinCommunity = useCallback(async (id: number): Promise<CommunityResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.joinCommunity(id);
      console.log('POST /api/community/' + id + '/join - Response:', data);
      return data;
    } catch (err: any) {
      console.log('POST /api/community/' + id + '/join - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to join community');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveCommunity = useCallback(async (id: number): Promise<CommunityResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.leaveCommunity(id);
      console.log('POST /api/community/' + id + '/leave - Response:', data);
      return data;
    } catch (err: any) {
      console.log('POST /api/community/' + id + '/leave - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to leave community');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity
  };
};