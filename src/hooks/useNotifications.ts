// hooks/useNotifications.ts
import { useState, useCallback, useEffect } from "react";
import {
  notificationService,
  type NotificationResponseDTO,
  type PageResponse,
} from "../services/notificationsService";

export interface UseNotificationsReturn {
  notifications: NotificationResponseDTO[];
  unreadNotifications: NotificationResponseDTO[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;

  // Methods
  fetchNotifications: (page?: number, size?: number) => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    []
  );
  const [unreadNotifications, setUnreadNotifications] = useState<
    NotificationResponseDTO[]
  >([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchNotifications = useCallback(
    async (page: number = 0, size: number = 20): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: PageResponse<NotificationResponseDTO> =
          await notificationService.getMyNotifications(page, size);
        setNotifications(response.content);
        setCurrentPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch notifications";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUnreadNotifications = useCallback(async (): Promise<void> => {
    try {
      const unread = await notificationService.getUnreadNotifications();
      setUnreadNotifications(unread);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch unread notifications";
      setError(errorMessage);
    }
  }, []);

  const fetchUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch unread count";
      setError(errorMessage);
    }
  }, []);

  const markAsRead = useCallback(async (id: number): Promise<void> => {
    try {
      await notificationService.markAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read";
      setError(errorMessage);
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      setUnreadNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read";
      setError(errorMessage);
    }
  }, []);

  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([
      fetchNotifications(currentPage),
      fetchUnreadNotifications(),
      fetchUnreadCount(),
    ]);
  }, [
    currentPage,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchUnreadCount,
  ]);

  // Auto-fetch on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshAll,
  };
};
