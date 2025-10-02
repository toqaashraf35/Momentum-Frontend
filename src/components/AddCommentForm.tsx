import React, { useState } from 'react';
import { Send, User, Loader } from 'lucide-react';
import { usePostComments } from '../hooks/useComment';
import { useUser } from '../hooks/useUser';

interface AddCommentFormProps {
  postId: number;
  onCommentAdded?: () => void;
  className?: string;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({
  postId,
  onCommentAdded,
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = usePostComments(postId);
  const { userProfile } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newComment = await addComment({ content: content.trim() });
      if (newComment) {
        setContent('');
        onCommentAdded?.();
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
          {userProfile?.avatarURL ? (
            <img
              src={userProfile.avatarURL}
              alt={userProfile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Comment Input */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          
          {/* Character Counter and Actions */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {content.length}/500
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Hint */}
          <p className="text-xs text-gray-400 mt-1">
            Press Enter to post, Shift+Enter for new line
          </p>
        </div>
      </div>
    </form>
  );
};