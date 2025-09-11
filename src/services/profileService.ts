import axios from "axios";


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface UserProfileResponseDto {
  id: number;
  name: string;
  username: string;
  role: string;
  userCountry: string;
  userEmail: string;
  displayName: string;
  bio?: string;
  phoneNumber?: string;
  jobTitle?: string;
  university?: string;
  tags?: string[];
  followers?: number;
  following?: number;
  city?: string;
  rating?: number;
  price?: number;
  linkedin?: string;
  github?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  name?: string; 
  username?: string;
  bio?: string;
  phoneNumber?: string;
  jobTitle?: string;
  university?: string;
  tags?: string[];
  city?: string;
  linkedin?: string;
  github?: string;
  avatarUrl?: string;
  price?: number;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const profileService = {
  getMyProfile: async (): Promise<UserProfileResponseDto> => {
    try {
      const response = await axios.get<UserProfileResponseDto>(
        `${API_BASE}/profile/me`,
        getAuthHeaders()
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
        `${API_BASE}/profile`,
        profileData,
        getAuthHeaders()
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
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
