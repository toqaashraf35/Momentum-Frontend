import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Header from "../layouts/Header";
import Alert from "../components/Alert";
import BookSessionForm from "../components/BookSessionForm";

export default function BookSessionPage() {
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
            <BookSessionForm />
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
