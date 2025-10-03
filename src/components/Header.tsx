import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import {
  Home,
  Users,
  MessageCircle,
  Bot,
  Bell,
  Mail,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Menu,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import Avatar from "./Avatar";
import profileService from "../services/profileService";

type HeaderProps = {
  onLogoutClick: () => void;
};

const Header = ({ onLogoutClick }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: userProfile, loading } = useFetch(profileService.getMyProfile);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, link: "/" },
    { name: "Mentors", icon: Users, link: "/mentors" },
    { name: "Communities", icon: MessageCircle, link: "/communities" },
    { name: "Chatbot", icon: Bot, link: "/chatbot" },
  ];

  const isActiveLink = (link: string) => {
    return location.pathname === link;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full justify-between border-b border-[var(--border)] bg-white bg-opacity-95 backdrop-blur-sm z-50 py-3">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src={Logo}
                alt="Company Logo"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>

            <button
              className="md:hidden ml-4 p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-[var(--main)]" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-4 lg:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.link);
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.link)}
                    className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--light)]'
                        : 'text-[var(--main)] hover:text-[var(--primary)] hover:bg-[var(--light)]'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-[var(--border)] shadow-lg md:hidden">
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.link);
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.link);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'text-[var(--primary)] bg-[var(--light)]'
                          : 'text-[var(--main)] hover:text-[var(--primary)] hover:bg-[var(--light)]'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Profile dropdown and Notifications */}
          <div className="flex items-center">
            <button className="p-2 rounded-full text-[var(--main)] hover:text-[var(--primary)] hover:bg-[var(--light)]">
              <Bell className="h-5 w-5" />
            </button>

            <button className="ml-2 p-2 rounded-full text-[var(--main)] hover:text-[var(--primary)] hover:bg-[var(--light)]">
              <Mail className="h-5 w-5" />
            </button>

            <div className="ml-4 relative">
              <button
                className="flex items-center gap-2 px-3 py-1 border-none bg-transparent rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <Avatar
                    src={userProfile?.avatarUrl}
                    name={userProfile?.name}
                    size="sm"
                  />
                )}
                <span className="hidden md:inline text-sm font-medium text-[var(--main)]">
                  {loading ? "Loading..." : userProfile?.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 md:w-72 bg-white rounded-xl shadow-lg border border-[var(--border)] py-4 z-50">
                  <div className="flex items-center gap-3 px-4 md:px-5 pb-3">
                    <Avatar
                      src={userProfile?.avatarUrl}
                      name={userProfile?.name}
                      size="md"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold text-[var(--main)] text-sm">
                        {userProfile?.name}
                      </div>
                      <div className="text-[var(--dim)] text-xs">
                        @{userProfile?.username}
                      </div>
                      <div className="text-[var(--dim)] text-xs mt-1">
                        {userProfile?.role === "MENTOR" ? "Mentor" : "Learner"}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] my-2"></div>

                  <button
                    className="flex items-center gap-3 w-full px-4 md:px-5 py-2 text-sm hover:bg-gray-50 hover:text-[var(--primary)]"
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                  >
                    <UserIcon size={16} />
                    <span>View Profile</span>
                  </button>

                  <div className="border-t border-[var(--border)] my-2"></div>

                  <button
                    className="flex items-center gap-3 w-full px-4 md:px-5 py-2 text-sm hover:bg-gray-50 hover:text-[var(--primary)]"
                    onClick={onLogoutClick}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
