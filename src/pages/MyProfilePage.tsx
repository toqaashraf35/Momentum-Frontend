import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Header from "../components/Header";
import PersonalInfoCard from "../components/PersonalInfoCard";
import ProfileCard from "../components/ProfileCard";
import { useState } from "react";
import authService from "../services/authService";

export default function MyProfilePage() {
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };
  return (
    <div className="bg-[var(--bg)] min-h-screen flex flex-col">
      <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />

      <div className="flex-1 flex flex-col pt-20">
        <div className="w-full">
          <ProfileCard />
        </div>

        <div className="w-full flex justify-end pr-4 mt-4">
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
