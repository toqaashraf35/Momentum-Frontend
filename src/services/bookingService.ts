// services/bookingService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface BookingRequestDTO {
  subject: string;
  startTime: string; // LocalDateTime from backend
  durationMinutes: number;
}

export interface BookingResponseDTO {
  id: number;
  mentorName: string;
  learnerName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  meetingLink: string;
  status: string;
  price: number;
}

export interface SessionRateRequestDTO {
  rating: number;
}

export interface StatusResponseDTO {
  status: string;
  message?: string;
}

export const bookingService = {
  // Create booking session
  createBooking: async (
    mentorId: number,
    request: BookingRequestDTO
  ): Promise<BookingResponseDTO> => {
    const token = localStorage.getItem("token");
    const res = await axios.post<BookingResponseDTO>(
      `${API_BASE}/bookings/${mentorId}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

   getMentorBookings: async (): Promise<BookingResponseDTO[]> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<BookingResponseDTO[]>(
      `${API_BASE}/bookings/mentor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Get learner bookings
  getLearnerBookings: async (): Promise<BookingResponseDTO[]> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<BookingResponseDTO[]>(
      `${API_BASE}/bookings/learner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE}/bookings/cancel/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Rate session
  rateSession: async (
    bookingId: number,
    rating: number
  ): Promise<StatusResponseDTO> => {
    const token = localStorage.getItem("token");
    const res = await axios.post<StatusResponseDTO>(
      `${API_BASE}/bookings/${bookingId}/rate`,
      { rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Get booking status
  getBookingStatus: async (bookingId: number): Promise<StatusResponseDTO> => {
    const token = localStorage.getItem("token");
    const res = await axios.get<StatusResponseDTO>(
      `${API_BASE}/bookings/status/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};
