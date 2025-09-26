import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Edit } from 'lucide-react';
import type { CommunityResponse, CommunityUpdateData } from '../types/community';

export interface EditCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: CommunityUpdateData, imageFile?: File) => Promise<void>;
  community: CommunityResponse | null;
  loading?: boolean;
}

const EditCommunityModal: React.FC<EditCommunityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  community,
  loading = false
}) => {
  const [formData, setFormData] = useState<CommunityUpdateData>({
    name: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form with community data when modal opens
  useEffect(() => {
    if (isOpen && community) {
      setFormData({
        name: community.name,
        description: community.description || ''
      });
      setImagePreview(community.imageUrl || null);
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, community]);

  // Handle form field changes
  const handleInputChange = (field: keyof CommunityUpdateData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(community?.imageUrl || null);
    // Clear file input
    const fileInput = document.getElementById('edit-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Community name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Community name must be less than 50 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!community || !validateForm()) {
      return;
    }
    
    try {
      await onSubmit(community.id, formData, imageFile || undefined);
      onClose();
    } catch (error) {
      console.error('Error updating community:', error);
      setErrors({ submit: 'Failed to update community. Please try again.' });
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !community) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)] text-white rounded-lg">
              <Edit size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--main)]">Edit Community</h2>
              <p className="text-sm text-[var(--dim)]">Update your community details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-[var(--dim)] hover:text-[var(--main)] hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Community Image */}
          <div>
            <label className="block text-sm font-medium text-[var(--main)] mb-2">
              Community Image
            </label>
            <div className="flex items-start gap-4">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* File Input */}
              <div className="flex-1 space-y-2">
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-[var(--dim)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--light)] file:text-[var(--primary)] hover:file:bg-blue-100"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                <p className="text-xs text-[var(--dim)]">
                  Upload an image to represent your community. Max size: 5MB
                </p>
              </div>
            </div>
            {errors.image && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.image}</span>
              </div>
            )}
          </div>

          {/* Community Name */}
          <div>
            <label htmlFor="edit-community-name" className="block text-sm font-medium text-[var(--main)] mb-2">
              Community Name *
            </label>
            <input
              id="edit-community-name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter community name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
              maxLength={50}
            />
            {errors.name && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.name}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-[var(--dim)]">
              {formData.name ? `${formData.name.length}/50` : '0/50'} characters
            </p>
          </div>

          {/* Community Description */}
          <div>
            <label htmlFor="edit-community-description" className="block text-sm font-medium text-[var(--main)] mb-2">
              Description
            </label>
            <textarea
              id="edit-community-description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your community, its purpose, and what members can expect..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 resize-vertical ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
              maxLength={500}
            />
            {errors.description && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.description}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-[var(--dim)]">
              {formData.description ? `${formData.description.length}/500` : '0/500'} characters
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-[var(--dim)] rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Edit size={16} />
                  <span>Update Community</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommunityModal;