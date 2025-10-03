import axios from "axios";
import authService from "./authService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface UserProfileRequestDto {
  name: string;
  username: string;
  email: string;
  country: string;
  bio?: string;
  phoneCode?: string;
  phoneNumber?: string;
  city?: string;
  university?: string;
  tags?: string[];
  githubLink?: string;
  linkedinLink?: string;
  avatarURL?: string;
  jobTitle?: string;
  hourRate?: number;
}

export interface UserProfileResponseDto {
  id: number;
  name: string;
  username: string;
  email: string;
  country: string;
  role: string;
  bio?: string;
  phoneCode?: string;
  phoneNumber?: string;
  city?: string;
  university?: string;
  tags: string[];
  githubLink?: string;
  linkedinLink?: string;
  avatarUrl?: string;
  jobTitle?: string;
  followingCount: number;
  followersCount: number;
  rating?: number;
  hourRate?: number;
}
interface ApiError {
  message: string;
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

  async updateProfile(
    profileData: UserProfileRequestDto
  ): Promise<UserProfileResponseDto> {
    try {
      const response = await axios.patch<UserProfileResponseDto>(
        `${API_BASE}/profile/me`,
        profileData,
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
        throw new Error((err.response.data as ApiError).message);
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
        throw new Error((err.response.data as ApiError).message);
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
        throw new Error((err.response.data as ApiError).message);
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Failed to fetch following. Please try again.");
      }
    }
  },
};

export default profileService;
