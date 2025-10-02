import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Alert from "../components/Alert";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener("openSidebar", handleOpenSidebar);

    return () => {
      window.removeEventListener("openSidebar", handleOpenSidebar);
    };
  }, []);

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="grid grid-cols-[20%_1fr] grid-rows-[7%_1fr] h-screen bg-gray-50">
      <div className="row-start-2">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content */}
      <div className="col-span-2">
        <Header onLogoutClick={() => setIsLogoutAlertOpen(true)} />
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
