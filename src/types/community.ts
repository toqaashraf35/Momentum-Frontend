// Re-export types from service for convenience
export type {
  CommunityCreateData,
  CommunityUpdateData,
  CommunityResponse,
  CommunitySearchParams,
  PaginatedCommunityResponse
} from '../services/communityService';

// Import types for use within this file
import type {
  CommunityResponse,
  CommunitySearchParams,
  PaginatedCommunityResponse
} from '../services/communityService';

// Extended types for UI state management
export interface CommunityState {
  communities: CommunityResponse[];
  myCommunities: CommunityResponse[];
  joinedCommunities: CommunityResponse[];
  currentCommunity: CommunityResponse | null;
  searchResults: PaginatedCommunityResponse | null;
  loading: boolean;
  error: string | null;
}

// Form state types
export interface CommunityFormData {
  name: string;
  description: string;
  tags: string[];
  imageFile?: File;
}

export interface CommunityFormErrors {
  name?: string;
  description?: string;
  tags?: string;
  imageFile?: string;
}

export interface CommunityFormState {
  data: CommunityFormData;
  errors: CommunityFormErrors;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Filter and sort types
export interface CommunityFilters {
  search?: string;
  tags?: string[];
  sortBy?: 'name' | 'memberCount' | 'postCount';
  sortDirection?: 'asc' | 'desc';
}

// Action types for reducers
export type CommunityActionType = 
  | 'FETCH_START'
  | 'FETCH_SUCCESS'
  | 'FETCH_ERROR'
  | 'CREATE_SUCCESS'
  | 'UPDATE_SUCCESS'
  | 'DELETE_SUCCESS'
  | 'JOIN_SUCCESS'
  | 'LEAVE_SUCCESS'
  | 'CLEAR_ERROR'
  | 'SET_CURRENT_COMMUNITY'
  | 'CLEAR_CURRENT_COMMUNITY';

export interface CommunityAction {
  type: CommunityActionType;
  payload?: any;
}

// UI component prop types
export interface CommunityCardProps {
  community: CommunityResponse;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  onEdit?: (community: CommunityResponse) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  isOwner?: boolean;
  isMember?: boolean;
}

export interface CommunityListProps {
  communities: CommunityResponse[];
  loading?: boolean;
  error?: string | null;
  onCommunitySelect?: (community: CommunityResponse) => void;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface CommunitySearchProps {
  onSearch?: (params: CommunitySearchParams) => void;
  initialParams?: CommunitySearchParams;
  availableTags?: string[];
  loading?: boolean;
}

export interface CommunityFormProps {
  initialData?: Partial<CommunityFormData>;
  onSubmit: (data: CommunityFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  mode: 'create' | 'edit';
}

// Modal and dialog types
export interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface CommunityDeleteConfirmProps {
  isOpen: boolean;
  community: CommunityResponse;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

// Navigation and routing types
export interface CommunityRouteParams {
  id?: string;
  page?: string;
  search?: string;
  tags?: string;
}

// API response wrapper types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}