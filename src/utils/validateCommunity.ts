// Validation rules for community forms
export const validateCommunityName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Community name is required';
  }
  if (name.length > 100) {
    return 'Community name must not exceed 100 characters';
  }
  return null;
};

export const validateCommunityDescription = (description?: string): string | null => {
  if (description && description.length > 500) {
    return 'Description must not exceed 500 characters';
  }
  return null;
};

export const validateCommunityTags = (tags?: string[]): string | null => {
  if (tags && tags.length > 10) {
    return 'Maximum 10 tags are allowed';
  }
  return null;
};

// Form validation for community creation
export const validateCommunityForm = (data: {
  name: string;
  description?: string;
  tags?: string[];
}) => {
  const errors: { [key: string]: string } = {};

  const nameError = validateCommunityName(data.name);
  if (nameError) errors.name = nameError;

  const descriptionError = validateCommunityDescription(data.description);
  if (descriptionError) errors.description = descriptionError;

  const tagsError = validateCommunityTags(data.tags);
  if (tagsError) errors.tags = tagsError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};