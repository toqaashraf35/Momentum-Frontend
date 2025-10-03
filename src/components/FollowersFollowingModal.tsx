import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import type { UserProfileResponseDto } from "../services/profileService";

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
  users: UserProfileResponseDto[];
  title: string;
}

const FollowersFollowingModal = ({
  isOpen,
  onClose,
  type,
  users,
  title,
}: FollowersFollowingModalProps) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
    onClose(); // Close the modal after navigation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[var(--main)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-[var(--dim)]" />
          </button>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <X size={24} className="text-gray-400" />
              </div>
              <p className="text-[var(--dim)] text-lg font-medium">
                No {type} found
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {type === "followers"
                  ? "This user doesn't have any followers yet."
                  : "This user isn't following anyone yet."}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Avatar src={user.avatarUrl} name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--main)] truncate">
                      {user.name}
                    </h3>
                    <p className="text-[var(--dim)] text-sm truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;
