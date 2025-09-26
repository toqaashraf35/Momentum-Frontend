import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Tag, 
  User, 
  UserPlus, 
  UserMinus,
  Settings,
  Trash2,
  Eye
} from 'lucide-react';
import type { CommunityResponse } from '../types/community';
import { formatMemberCount, formatPostCount } from '../utils/communityUtils';

export interface CommunityCardProps {
  community: CommunityResponse;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  onEdit?: (community: CommunityResponse) => void;
  onDeleteRequest?: (community: CommunityResponse) => void;
  onView?: (id: number) => void;
  showActions?: boolean;
  isOwner?: boolean;
  isMember?: boolean;
  loading?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoin,
  onLeave,
  onEdit,
  onDeleteRequest,
  onView,
  showActions = true,
  isOwner = false,
  isMember = false,
  loading = false
}) => {
  const handleJoin = () => {
    if (onJoin && !loading) {
      onJoin(community.id);
    }
  };

  const handleLeave = () => {
    if (onLeave && !loading) {
      onLeave(community.id);
    }
  };

  const handleEdit = () => {
    if (onEdit && !loading) {
      onEdit(community);
    }
  };

  const handleDelete = () => {
    if (onDeleteRequest && !loading) {
      onDeleteRequest(community);
    }
  };

  const handleView = () => {
    if (onView && !loading) {
      onView(community.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Community Image */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] overflow-hidden">
        {community.imageUrl ? (
          <img 
            src={community.imageUrl} 
            alt={community.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MessageSquare size={48} className="text-white opacity-80" />
          </div>
        )}
        
        {/* View Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <button
            onClick={handleView}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200"
            disabled={loading}
          >
            <Eye size={20} className="text-[var(--primary)]" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Community Title */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-[var(--main)] mb-1 line-clamp-1">
            {community.name}
          </h3>
          <p className="text-[var(--dim)] text-sm flex items-center gap-1">
            <User size={14} />
            by {community.ownerName}
          </p>
        </div>

        {/* Community Description */}
        <p className="text-[var(--dim)] text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {community.description || 'No description available'}
        </p>

        {/* Community Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[var(--dim)]">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-[var(--primary)]" />
            <span>{formatMemberCount(community.memberCount)} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} className="text-[var(--primary)]" />
            <span>{formatPostCount(community.postCount)} posts</span>
          </div>
        </div>

        {/* Community Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {community.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--light)] text-[var(--primary)] text-xs rounded-full border"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              {community.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-[var(--dim)] text-xs rounded-full">
                  +{community.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            {/* Owner Actions */}
            {isOwner && (
              <>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[var(--light)] text-[var(--primary)] rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Settings size={16} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}

            {/* Member Actions */}
            {!isOwner && (
              <>
                {isMember ? (
                  <button
                    onClick={handleLeave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserMinus size={16} />
                    {loading ? 'Leaving...' : 'Leave'}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus size={16} />
                    {loading ? 'Joining...' : 'Join'}
                  </button>
                )}
              </>
            )}

            {/* View Button for all users */}
            <button
              onClick={handleView}
              disabled={loading}
              className="px-3 py-2 bg-gray-50 text-[var(--dim)] rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCard;