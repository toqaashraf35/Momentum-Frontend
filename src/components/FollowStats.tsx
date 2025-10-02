import { Users, UserPlus } from "lucide-react";

interface FollowStatsProps {
  followersCount: number;
  followingCount: number;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  isLoadingFollowers: boolean;
  isLoadingFollowing: boolean;
}

const FollowStats = ({
  followersCount,
  followingCount,
  onOpenFollowers,
  onOpenFollowing,
  isLoadingFollowers,
  isLoadingFollowing,
}: FollowStatsProps) => {
  return (
    <div className="flex justify-center sm:justify-start space-x-6 md:space-x-8 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
      {/* Followers - Clickable */}
      <button
        onClick={onOpenFollowers}
        disabled={isLoadingFollowers}
        className="text-center cursor-pointer flex flex-col items-center hover:bg-gray-50 p-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-1 mb-1">
          <Users size={16} className="text-[var(--primary)]" />
          <span className="block text-lg font-semibold text-[var(--main)]">
            {followersCount || 0}
          </span>
        </div>
        <span className="text-xs md:text-sm text-[var(--dim)]">Followers</span>
      </button>

      {/* Following - Clickable */}
      <button
        onClick={onOpenFollowing}
        disabled={isLoadingFollowing}
        className="text-center cursor-pointer flex flex-col items-center hover:bg-gray-50 p-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-1 mb-1">
          <UserPlus size={16} className="text-[var(--primary)]" />
          <span className="block text-lg font-semibold text-[var(--main)]">
            {followingCount || 0}
          </span>
        </div>
        <span className="text-xs md:text-sm text-[var(--dim)]">Following</span>
      </button>
    </div>
  );
};

export default FollowStats;
