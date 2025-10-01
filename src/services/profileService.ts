import axios from "axios";
import authService from "./authService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface UserProfileResponseDto {
  id: number;
  name: string;
  username: string;
  role: string;
  country: string;
  email: string;
  bio?: string;
  phoneNumber?: string;
  phoneCode?: string;
  jobTitle?: string;
  university?: string;
  tags?: string[];
  followersCount?: number;
  followingCount?: number;
  city?: string;
  rating?: number;
  hourRate?: number;
  linkedinLink?: string;
  githubLink?: string;
  avatarURL?: string;
}

export interface UpdateProfileRequest {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  country?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  phoneCode?: string | null;
  jobTitle?: string | null;
  university?: string | null;
  tags?: string[] | null;
  city?: string | null;
  linkedinLink?: string | null;
  githubLink?: string | null;
  avatarURL?: string | null;
  hourRate?: number | null;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const profileService = {
  getMyProfile: async (): Promise<UserProfileResponseDto> => {
    try {
      const response = await axios.get<UserProfileResponseDto>(
        `${API_BASE}/profile/me`,
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

  getAnotherProfile: async (
    profileId: number
  ): Promise<UserProfileResponseDto> => {
    try {
      const response = await axios.get<UserProfileResponseDto>(
        `${API_BASE}/profile/${profileId}`,
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

  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<UserProfileResponseDto> => {
    try {
      // Clean the data - remove null/undefined values that might cause issues
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const response = await axios.patch<UserProfileResponseDto>(
        `${API_BASE}/profile/me`,
        cleanedData,
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
        throw new Error("Failed to update profile. Please try again.");
      }
    }
  },

  uploadAvatar: async (file: File): Promise<UserProfileResponseDto> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<UserProfileResponseDto>(
        `${API_BASE}/profile/me/avatar`,
        formData,
        {
          headers: {
            ...authService.getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        }
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
        throw new Error("Failed to upload avatar. Please try again.");
      }
    }
  },

  getTopRatedMentors: async (): Promise<UserProfileResponseDto[]> => {
    try {
      const response = await axios.get<UserProfileResponseDto[]>(
        `${API_BASE}/profile/top-rated`,
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
        throw new Error("Failed to fetch top rated mentors. Please try again.");
      }
    }
  },

  getMentors: async (
    page: number = 0
  ): Promise<PaginatedResponse<UserProfileResponseDto>> => {
    try {
      const response = await axios.get<
        PaginatedResponse<UserProfileResponseDto>
      >(
        `${API_BASE}/profile/mentors?page=${page}`,
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
        throw new Error("Failed to fetch mentors. Please try again.");
      }
    }
  },

  getLearners: async (): Promise<UserProfileResponseDto[]> => {
    try {
      const response = await axios.get<UserProfileResponseDto[]>(
        `${API_BASE}/profile/learners`,
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
        throw new Error("Failed to fetch learners. Please try again.");
      }
    }
  },

  followProfile: async (profileId: number): Promise<string> => {
    try {
      const response = await axios.post<string>(
        `${API_BASE}/profile/${profileId}/follow`,
        {},
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
        throw new Error("Failed to follow profile. Please try again.");
      }
    }
  },

  unfollowProfile: async (profileId: number): Promise<string> => {
    try {
      const response = await axios.delete<string>(
        `${API_BASE}/profile/${profileId}/unfollow`,
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
        throw new Error("Failed to unfollow profile. Please try again.");
      }
    }
  },

  getAllFollowers: async (): Promise<UserProfileResponseDto[]> => {
    try {
      const response = await axios.get<UserProfileResponseDto[]>(
        `${API_BASE}/profile/followers`,
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
        throw new Error("Failed to fetch followers. Please try again.");
      }
    }
  },

  getAllFollowing: async (): Promise<UserProfileResponseDto[]> => {
    try {
      const response = await axios.get<UserProfileResponseDto[]>(
        `${API_BASE}/profile/following`,
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
        throw new Error("Failed to fetch following. Please try again.");
      }
    }
  },
};

export default profileService;
