import { useState } from "react";
import Header from "../components/Header";
import Chat from "../components/Chat";
import Alert from "../components/Alert";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };
  return (
    <>
      <div className="grid grid-rows-[18%_1fr]">
        <div>
          <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
        </div>
        <div>
          <Chat />
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
    </>
  );
}
