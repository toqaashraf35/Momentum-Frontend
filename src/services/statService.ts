import axios from "axios";
import authService from "./authService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface StatisticsResponse {
  totalUsers: number;
  totalMentors: number;
  totalCommunities: number;
  usersGrowthRate: number;
  mentorsGrowthRate: number;
  communitiesGrowthRate: number;
  pendingApplications: number;
  submittedApplicationsThisMonth: number;
  applicationsGrowthRate: number;
}

const statService = {
  getStatistics: async (): Promise<StatisticsResponse> => {
    try {
      const response = await axios.get<StatisticsResponse>(
        `${API_BASE}/statistics`,
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
        throw new Error("Failed to fetch profile. Please try again.");
      }
    }
  },
};

export default statService;
