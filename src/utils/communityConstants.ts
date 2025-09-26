// Community pagination defaults
export const COMMUNITY_PAGE_SIZE = 10;
export const COMMUNITY_MAX_PAGE_SIZE = 50;

// Community validation limits
export const COMMUNITY_NAME_MAX_LENGTH = 100;
export const COMMUNITY_DESCRIPTION_MAX_LENGTH = 500;
export const COMMUNITY_MAX_TAGS = 10;

// Sort options for communities
export const COMMUNITY_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'memberCount', label: 'Members' },
  { value: 'postCount', label: 'Posts' }
] as const;

export const COMMUNITY_SORT_DIRECTIONS = [
  { value: 'ASC', label: 'Ascending' },
  { value: 'DESC', label: 'Descending' }
] as const;

// Community action types for state management
export const COMMUNITY_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CREATE_SUCCESS: 'CREATE_SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  JOIN_SUCCESS: 'JOIN_SUCCESS',
  LEAVE_SUCCESS: 'LEAVE_SUCCESS',
  CLEAR_ERROR: 'CLEAR_ERROR'
} as const;

// Default search parameters
export const DEFAULT_SEARCH_PARAMS = {
  page: 0,
  size: COMMUNITY_PAGE_SIZE,
  sortBy: 'name',
  sortDirection: 'ASC' as const
};

// Image upload constraints
export const COMMUNITY_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const COMMUNITY_IMAGE_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif'
];

// Error messages
export const COMMUNITY_ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch communities',
  CREATE_FAILED: 'Failed to create community',
  UPDATE_FAILED: 'Failed to update community',
  DELETE_FAILED: 'Failed to delete community',
  JOIN_FAILED: 'Failed to join community',
  LEAVE_FAILED: 'Failed to leave community',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Community not found',
  NAME_REQUIRED: 'Community name is required',
  NAME_TOO_LONG: `Community name must not exceed ${COMMUNITY_NAME_MAX_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description must not exceed ${COMMUNITY_DESCRIPTION_MAX_LENGTH} characters`,
  TOO_MANY_TAGS: `Maximum ${COMMUNITY_MAX_TAGS} tags are allowed`,
  IMAGE_TOO_LARGE: `Image size must not exceed ${COMMUNITY_IMAGE_MAX_SIZE / 1024 / 1024}MB`,
  IMAGE_INVALID_TYPE: 'Only JPEG, PNG, and GIF images are allowed'
} as const;