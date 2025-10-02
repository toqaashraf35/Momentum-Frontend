import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface NotificationResponseDTO {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  postId?: number;
  communityId?: number;
  applicationId?: number;
  metadata?: Record<string, any>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationService = {
  getMyNotifications: async (
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<NotificationResponseDTO>> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<PageResponse<NotificationResponseDTO>>(
      `${API_BASE}/notifications?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  getUnreadNotifications: async (): Promise<NotificationResponseDTO[]> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<NotificationResponseDTO[]>(
      `${API_BASE}/notifications/unread`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<UnreadCountResponse>(
      `${API_BASE}/notifications/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.count;
  },

  markAsRead: async (id: number): Promise<NotificationResponseDTO> => {
    const token = localStorage.getItem("token");
    const res = await axios.put<NotificationResponseDTO>(
      `${API_BASE}/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  markAllAsRead: async (): Promise<void> => {
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_BASE}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
