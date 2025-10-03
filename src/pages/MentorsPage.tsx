import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Title from "../components/Title";
import Alert from "../components/Alert";
import authService from "../services/authService";
import { useMentors } from "../hooks/useMentors";
import MentorsGrid from "../components/MentorsGrid";
import MentorsPagination from "../components/MentorsPagination";
import MentorsLoading from "../components/MentorsSkeleton";
import MentorsError from "../components/Error";
import MentorsEmpty from "../components/MentorsEmpty";
import { useState } from "react";

const MentorsPage = () => {
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const {
    currentPage,
    setCurrentPage,
    mentorsPage,
    loading,
    error,
    refetch,
    convertToMentorCardProps,
  } = useMentors();

  const handleBookSession = (mentorId: string) => {
    navigate(`/booking/${mentorId}`);
    console.log("Book session with mentor:", mentorId);
  };

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  const renderContent = () => {
    if (loading) {
      return <MentorsLoading />;
    }

    if (error) {
      return <MentorsError error={error} onRetry={refetch} />;
    }

    if (!mentorsPage?.content || mentorsPage.content.length === 0) {
      return <MentorsEmpty />;
    }

    const mentorCards = mentorsPage.content.map(convertToMentorCardProps);

    return (
      <>
        <MentorsGrid mentors={mentorCards} onBookSession={handleBookSession} />
        <MentorsPagination
          currentPage={currentPage}
          totalPages={mentorsPage.totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />

      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Title
            title="Mentors"
            subtitle={`Connect with experienced mentors ready to guide you`}
          />

          {renderContent()}
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
};

export default MentorsPage;
