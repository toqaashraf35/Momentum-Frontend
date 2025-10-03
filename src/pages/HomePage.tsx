// pages/HomePage.tsx
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Alert from "../components/Alert";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import TopRatedMentorsSection from "../components/TopRatedMentorsSection";
import Title from "../components/Title";
import Sessions from "../components/Sessions";
import { useSessions } from "../hooks/useSessions";

export default function HomePage() {
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { bookings } = useSessions();
  const navigate = useNavigate();

  // Check if there are more than 2 sessions
  const hasMoreSessions = bookings.length > 2;

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="grid grid-rows-[10%_1fr] min-h-screen bg-gray-50">
      {/* Header */}
      <div className="row-start-1">
        <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
      </div>

      {/* Main Content with Sidebar */}
      <div className="row-start-2 grid grid-cols-[18%_1fr]">
        {/* Sidebar */}
        <div>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          {/* Sessions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Title title="My Sessions" />
              {hasMoreSessions && (
                <button
                  onClick={() => navigate("/sessions")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  See All ({bookings.length})
                </button>
              )}
            </div>

            <Sessions limit={2} />
          </div>

          {/* Top Rated Mentors Section */}
          <div className="space-y-4">
            <Title title="Top Rated Mentors" />
            <TopRatedMentorsSection />
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
