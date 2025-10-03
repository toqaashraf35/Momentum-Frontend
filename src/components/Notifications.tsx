// components/Notifications.tsx
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import Title from "./Title";

type TabType = "all" | "read" | "unread";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    currentPage,
    totalPages,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const readCount = notifications.length - unreadCount;
  const allCount = notifications.length;

  const displayedNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
      ? unreadNotifications
      : notifications.filter((notification) => notification.isRead);

  const handleNotificationClick = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "POST_LIKED":
        return "❤️";
      case "POST_COMMENTED":
        return "💬";
      case "MENTOR_APPLICATION_APPROVED":
        return "✅";
      case "MENTOR_APPLICATION_REJECTED":
        return "❌";
      case "USER_FOLLOWED":
        return "👥"; 
      case "SESSION_BOOKED":
        return "📅"; 
      case "SESSION_REMINDER_24H":
        return "⏰"; 
      default:
        return "🔔";
    }

  };

  const getTabCount = (tab: TabType) => {
    switch (tab) {
      case "all":
        return allCount;
      case "unread":
        return unreadCount;
      case "read":
        return readCount;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <Title title="Notifications" />
              <p className="text-gray-600 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-6 flex space-x-8">
            {(["all", "unread", "read"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center text-red-600">
              <p className="mb-4">{error}</p>
              <button
                onClick={() => fetchNotifications()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && displayedNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-lg">
                {activeTab === "all"
                  ? "No notifications yet"
                  : activeTab === "unread"
                  ? "No unread notifications"
                  : "No read notifications"}
              </p>
              <p className="text-sm mt-2">
                {activeTab === "all"
                  ? "We'll notify you when something happens"
                  : "You're all caught up!"}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-base leading-6">
                      {notification.message}
                    </p>

                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>

                      {/* Context badges */}
                      <div className="flex space-x-2">
                        {notification.postId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Post
                          </span>
                        )}
                        {notification.communityId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Community
                          </span>
                        )}
                        {notification.applicationId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Application
                          </span>
                        )}
                        {notification.followerId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Follow
                          </span>
                        )}
                        {notification.sessionId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Session
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination - Show only for "all" tab */}
        {activeTab === "all" && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={() => fetchNotifications(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => fetchNotifications(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
