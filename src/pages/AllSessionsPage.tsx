// pages/AllSessionsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Alert from "../components/Alert";
import authService from "../services/authService";
import Title from "../components/Title";
import Sessions from "../components/Sessions";

export default function AllSessionsPage() {
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  const handleRateMentor = (bookingId: number) => {
    console.log("Rate mentor for booking:", bookingId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Title title="All Sessions" />
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>

        <Sessions
          showRateButton={true}
          onRateMentor={handleRateMentor}
          showTabs={true} 
        />
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
