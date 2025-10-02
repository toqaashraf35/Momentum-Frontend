import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader } from 'lucide-react';
import { usePostActions } from '../hooks/usePost';
import Button from './Button';
import Input from './Input';
import type { PostResponseDTO, ProjectPostResponseDTO } from '../services/postService';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostResponseDTO | ProjectPostResponseDTO | null;
  onPostUpdated?: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostUpdated
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['']);
  const [newSkill, setNewSkill] = useState('');
  
  const { updateRegularPost, updateProjectPost, loading, error } = usePostActions();

  const isProjectPost = post?.postType === 'PROJECT';
  const projectPost = isProjectPost ? post as ProjectPostResponseDTO : null;

  // Populate form when post changes
  useEffect(() => {
    if (post) {
      setContent(post.content);
      
      if (isProjectPost && projectPost) {
        setTitle(projectPost.title || '');
        setTeamSize(projectPost.teamSize || 1);
        setRequiredSkills(projectPost.requiredSkills && projectPost.requiredSkills.length > 0 
          ? [...projectPost.requiredSkills, ''] 
          : ['']
        );
      }
    }
  }, [post, isProjectPost, projectPost]);

  const resetForm = () => {
    setContent('');
    setTitle('');
    setTeamSize(1);
    setRequiredSkills(['']);
    setNewSkill('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills(prev => [...prev.filter(skill => skill.trim() !== ''), newSkill.trim(), '']);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setRequiredSkills(prev => prev.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    setRequiredSkills(prev => prev.map((skill, i) => i === index ? value : skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post || !content.trim()) return;

    let result = null;
    
    if (isProjectPost) {
      if (!title.trim()) return;
      
      const validSkills = requiredSkills.filter(skill => skill.trim() !== '');
      result = await updateProjectPost(post.id, {
        content: content.trim(),
        communityId: post.communityId,
        title: title.trim(),
        teamSize,
        requiredSkills: validSkills.length > 0 ? validSkills : undefined
      });
    } else {
      result = await updateRegularPost(post.id, {
        content: content.trim(),
        communityId: post.communityId
      });
    }

    if (result) {
      handleClose();
      onPostUpdated?.();
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Post Type Display */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Post Type:</span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                isProjectPost 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isProjectPost ? 'Project Post' : 'Regular Post'}
              </span>
            </div>
          </div>

          {/* Project Title (only for project posts) */}
          {isProjectPost && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter your project title..."
              />
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isProjectPost 
                ? "Describe your project, what you're building, and what help you need..."
                : "What's on your mind? Share your thoughts with the community..."
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              maxLength={1000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/1000
            </div>
          </div>

          {/* Project-specific fields */}
          {isProjectPost && (
            <>
              {/* Team Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setTeamSize(prev => Math.max(1, prev - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {teamSize}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTeamSize(prev => Math.min(20, prev + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500">members</span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="space-y-2">
                  {requiredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        id={`skill-${index}`}
                        name={`skill-${index}`}
                        value={skill}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSkill(index, e.target.value)}
                        placeholder="e.g., React, Python, UI/UX Design"
                      />
                      {requiredSkills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input
                      id="new-skill"
                      name="new-skill"
                      value={newSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                      placeholder="Add another skill"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim() || (isProjectPost && !title.trim())}
              className="min-w-[120px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};