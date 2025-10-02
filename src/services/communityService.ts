import api from "./api";

// Types based on backend DTOs
export interface CommunityCreateData {
  name: string;
  description?: string;
  tags?: string[];
}

export interface CommunityUpdateData {
  name?: string;
  description?: string;
  memberIds?: number[];
  tagIds?: number[];
}

export interface CommunityResponse {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  ownerName: string;
  tags: string[];
  memberCount: number;
}

export interface CommunitySearchParams {
  query?: string;
  tags?: string[];
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export interface PaginatedCommunityResponse {
  content: CommunityResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

class CommunityService {
  /**
   * Create a new community
   * @param communityData - Community data to create
   * @param imageFile - Optional image file for the community
   */
  async createCommunity(
    communityData: CommunityCreateData,
    imageFile?: File
  ): Promise<CommunityResponse> {
    try {
      const formData = new FormData();
      formData.append('communityData', JSON.stringify(communityData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post<CommunityResponse>('/community/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a community by ID
   * @param id - Community ID
   */
  async getCommunityById(id: number): Promise<CommunityResponse> {
    try {
      const response = await api.get<CommunityResponse>(`/community/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all communities
   */
  async getAllCommunities(): Promise<CommunityResponse[]> {
    try {
      const response = await api.get<CommunityResponse[]>('/community/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get communities owned by the current user
   */
  async getMyCommunities(): Promise<CommunityResponse[]> {
    try {
      const response = await api.get<CommunityResponse[]>('/community/my-communities');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get communities the current user has joined
   */
  async getJoinedCommunities(): Promise<CommunityResponse[]> {
    try {
      const response = await api.get<CommunityResponse[]>('/community/joined');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a community
   * @param id - Community ID
   * @param updateData - Data to update
   * @param imageFile - Optional new image file
   */
  async updateCommunity(
    id: number,
    updateData: CommunityUpdateData,
    imageFile?: File
  ): Promise<CommunityResponse> {
    try {
      const formData = new FormData();
      formData.append('communityData', JSON.stringify(updateData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put<CommunityResponse>(`/community/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a community
   * @param id - Community ID
   */
  async deleteCommunity(id: number): Promise<void> {
    try {
      await api.delete(`/community/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Join a community
   * @param id - Community ID
   */
  async joinCommunity(id: number): Promise<CommunityResponse> {
    try {
      const response = await api.post<CommunityResponse>(`/community/${id}/join`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Leave a community
   * @param id - Community ID
   */
  async leaveCommunity(id: number): Promise<CommunityResponse> {
    try {
      const response = await api.post<CommunityResponse>(`/community/${id}/leave`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search communities with pagination and filtering
   * @param searchParams - Search parameters
   */
  async searchCommunities(searchParams: CommunitySearchParams = {}): Promise<PaginatedCommunityResponse> {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.query) {
        params.append('query', searchParams.query);
      }
      
      if (searchParams.tags && searchParams.tags.length > 0) {
        searchParams.tags.forEach(tag => params.append('tags', tag));
      }
      
      if (searchParams.sortBy) {
        params.append('sortBy', searchParams.sortBy);
      }
      
      if (searchParams.sortDirection) {
        params.append('sortDirection', searchParams.sortDirection);
      }
      
      if (searchParams.page !== undefined) {
        params.append('page', searchParams.page.toString());
      }
      
      if (searchParams.size !== undefined) {
        params.append('size', searchParams.size.toString());
      }

      const response = await api.get<PaginatedCommunityResponse>(`/community/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const communityService = new CommunityService();
export default communityService;