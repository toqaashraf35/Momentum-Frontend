import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import Title from "../components/Title";
import { useFetch } from "../hooks/useFetch";
import ApplicationsTable from "../layouts/ApplicationsTable";
import SideMenu from "../layouts/SideMenu";
import statService, { type StatisticsResponse } from "../services/statService";
import { Users, Users2, FileUser, GraduationCap } from "lucide-react";
import authService from "../services/authService";
import Alert from "../components/Alert";
import { useState } from "react";

export default function AdminDashboardPage() {
  const {
    data: stats,
    error,
  } = useFetch<StatisticsResponse>(statService.getStatistics);
 const navigate = useNavigate();
   const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
 
  
  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!stats) return null;

  return (
    <div className="bg-[var(--bg)] grid grid-cols-[18%_1fr] min-h-screen">
      {/* Sidebar */}
      <aside className="h-full">
        <SideMenu onLogoutClick={() => setIsLogoutAlertOpen(true)} />
      </aside>

      {/* Main content */}
      <main className="grid grid-rows-[auto_auto_1fr]">
        {/* Page Title */}
        <header className="p-4">
          <Title
            title="Dashboard"
            subtitle="Overview of platform statistics, growth, and applications"
          />
        </header>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          <StatCard
            title="Users"
            icon={<Users className="w-6 h-6" />}
            count={stats.totalUsers}
            growthRate={stats.usersGrowthRate}
          />
          <StatCard
            title="Mentors"
            icon={<GraduationCap className="w-6 h-6" />}
            count={stats.totalMentors}
            growthRate={stats.mentorsGrowthRate}
          />
          <StatCard
            title="Communities"
            icon={<Users2 className="w-6 h-6" />}
            count={stats.totalCommunities}
            growthRate={stats.communitiesGrowthRate}
          />
          <StatCard
            title="Submitted Applications"
            icon={<FileUser className="w-6 h-6" />}
            count={stats.submittedApplicationsThisMonth}
            growthRate={stats.applicationsGrowthRate}
          />
        </section>

        {/* Applications Table */}
        <section className="p-4 ">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
             Applications
          </h2>
          <div className="h-full">
            <ApplicationsTable />
          </div>
        </section>
      </main>
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
