import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Header from "../components/Header";
import PersonalInfoCard from "../components/PersonalInfoCard";
import ProfileCard from "../components/ProfileCard";
import { PostCard } from "../components/PostCard";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useState } from "react";
import authService from "../services/authService";
import { useMyPosts } from "../hooks/usePost";

export default function MyProfilePage() {
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const navigate = useNavigate();
  const { posts, loading: postsLoading, error: postsError, refetch } = useMyPosts();

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  const handleCommentClick = (post: any) => {
    navigate(`/post/${post.id}`);
  };
  return (
    <div className="bg-[var(--bg)] min-h-screen flex flex-col">
      <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />

      <div className="flex-1 flex flex-col pt-20">
        {/* Profile Section */}
        <div className="w-full">
          <ProfileCard />
        </div>

        {/* Content Section - Posts and Personal Info side by side */}
        <div className="w-full flex gap-4 px-4 mt-4">
          {/* Posts Section - Left Side */}
          <div className="flex-1">
            {postsLoading && (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            )}

            {postsError && (
              <div className="py-12">
                <Error error={postsError} onRetry={refetch} />
              </div>
            )}

            {!postsLoading && !postsError && posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't created any posts yet.</p>
                <p className="text-gray-400 mt-2">Start sharing your thoughts with the community!</p>
              </div>
            )}

            {!postsLoading && !postsError && posts.length > 0 && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={handleCommentClick}
                    showCommunityName={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Personal Info Card - Right Side */}
          <div className="w-full max-w-lg">
            <PersonalInfoCard />
          </div>
        </div>
      </div>
      {/* Logout Alert */}
      {isLogoutAlertOpen && (
        <Alert
          title="Confirm Logout"
          description="Are you sure you want to log out of your account?"
          confirmText="Logout"
          cancelText="Cancel"
          onCancel={() => setIsLogoutAlertOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
