import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  LogOut,
  Users2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type SideMenuProps = {
  onLogoutClick: () => void;
};

export default function SideMenu({ onLogoutClick }: SideMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/mentors", icon: GraduationCap, label: "Mentors" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/communities", icon: Users2, label: "Communities" },
  ];

  const MenuContent = ({ showCloseButton = false }) => (
    <>
      {/* Header with Logo and Close Button (mobile only) */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--main)]">Momentum</h1>
        {showCloseButton && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Links */}
      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--main)] hover:bg-[var(--light)] hover:text-[var(--primary)] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-[var(--light)] text-[var(--primary)] font-semibold"
                    : ""
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 mt-auto ">
        <button
          className="flex w-full items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
          onClick={onLogoutClick}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Always visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-white shadow-lg flex-col justify-between z-30">
        <MenuContent />
      </div>

      {/* Sidebar for Mobile - Opens from left */}
      <div
        className={`lg:hidden fixed top-0 left-0  w-64 bg-white shadow-lg flex flex-col justify-between z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MenuContent showCloseButton={true} />
      </div>

      {/* Spacer for Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
