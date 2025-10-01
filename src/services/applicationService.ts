// services/mentorService.ts
import axios from "axios";
import authService from "./authService";

const API_BASE = "http://localhost:8081/api";

export interface MentorApplicationResponseDto {
  id: number;
  name: string;
  username: string;
  email: string;
  country: string;
  submittedDate: Date;
  jobTitle: string;
  tags: string[];
  hourRate: number;
  cvLink: string;
  status: string;
}

const applicationService = {
  getApplicationsByStatus: async (
    status: string
  ): Promise<MentorApplicationResponseDto[]> => {
    try {
      const response = await axios.get<MentorApplicationResponseDto[]>(
        `${API_BASE}/application?status=${status}`,
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
        throw new Error("Failed to fetch applications. Please try again.");
      }
    }
  },

  approveApplication: async (appId: number): Promise<void> => {
    try {
      await axios.post(
        `${API_BASE}/application/${appId}/approve`,
        {},
        authService.getAuthHeaders()
      );
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
        throw new Error("Failed to approve application. Please try again.");
      }
    }
  },

  rejectApplication: async (appId: number): Promise<void> => {
    try {
      await axios.post(
        `${API_BASE}/application/${appId}/reject`,
        {},
        authService.getAuthHeaders()
      );
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
        throw new Error("Failed to reject application. Please try again.");
      }
    }
  },

  getApplicationById: async (
    appId: number
  ): Promise<MentorApplicationResponseDto> => {
    try {
      const response = await axios.get<MentorApplicationResponseDto>(
        `${API_BASE}/application/${appId}`,
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
        throw new Error("Failed to fetch applications. Please try again.");
      }
    }
  },
};

export default applicationService;
