import axios from "axios";
import authService from "./authService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface AvailabilityRequestDTO {
  type: string;
  specificDate?: string;
  daysOfWeek?: string[];
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponseDTO {
  id: number;
  type: string;
  specificDate?: string;
  daysOfWeek?: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
}

const AvailabilityService = {
  async addAvailability(
    availabilityData: AvailabilityRequestDTO
  ): Promise<AvailabilityResponseDTO[]> {
    try {
      const response = await axios.post<AvailabilityResponseDTO[]>(
        `${API_BASE}/availability/add`,
        availabilityData,
        authService.getAuthHeaders()
      );
      return response.data;
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        throw new Error((err.response.data as { message: string }).message);
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Failed to add availability. Please try again.");
      }
    }
  },

  // Add this method to the AvailabilityService class
  async getAvailabilities(
    mentorId: number
  ): Promise<AvailabilityResponseDTO[]> {
    try {
      const response = await axios.get<AvailabilityResponseDTO[]>(
        `${API_BASE}/availability/${mentorId}`,
        authService.getAuthHeaders()
      );
      return response.data;
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        throw new Error((err.response.data as { message: string }).message);
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Failed to fetch availabilities. Please try again.");
      }
    }
  },
};

export default AvailabilityService;
