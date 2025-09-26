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

  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<UserProfileResponseDto> => {
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
        throw new Error((err.response.data as { message: string }).message);
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Failed to update profile. Please try again.");
      }
    }
  },

  uploadAvatar: async (file: File): Promise<UserProfileResponseDto> => {
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
};

export default profileService;
