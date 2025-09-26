import { useState, useEffect, useCallback } from 'react';
import communityService from '../services/communityService';
import type { CommunitySearchParams, PaginatedCommunityResponse } from '../services/communityService';

// Custom hook for community search with debouncing
export const useCommunitySearch = (initialParams: CommunitySearchParams = {}) => {
  const [searchResults, setSearchResults] = useState<PaginatedCommunityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<CommunitySearchParams>(initialParams);

  // Debounced search function
  const performSearch = useCallback(async (params: CommunitySearchParams) => {
    if (!params.query || params.query.trim().length === 0) {
      setSearchResults(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await communityService.searchCommunities(params);
      console.log('GET /api/community/search - Response:', data);
      setSearchResults(data);
    } catch (err: any) {
      console.log('GET /api/community/search - Error Response:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to search communities');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search with 300ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchParams);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchParams, performSearch]);

  const updateSearchParams = useCallback((newParams: Partial<CommunitySearchParams>) => {
    setSearchParams(prevParams => ({ ...prevParams, ...newParams }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({});
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchParams,
    updateSearchParams,
    clearSearch,
    performSearch: () => performSearch(searchParams)
  };
};