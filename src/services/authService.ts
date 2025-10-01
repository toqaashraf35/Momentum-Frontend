// services/authService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export interface LoginResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  country: string;
  token: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  country: string;
  role: string;
  token: string | null;
}

export interface SignupValues {
  name: string;
  username: string;
  email: string;
  password: string;
  country: string;
  role?: string; // LEARNER or MENTOR
  jobTitle?: string;
  tags?: string;
  hourRate?: number;
  cvFile?: File;
}

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const backendMessage =
        typeof err.response.data === "string"
          ? err.response.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          : (err.response.data as any).message || "Login failed";
      throw new Error(backendMessage);
    } else if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
};

const signup = async (data: SignupValues): Promise<RegisterResponse> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.append(key, value as any);
      }
    });

    const response = await axios.post<RegisterResponse>(
      `${API_BASE}/auth/register`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const backendMessage =
        typeof err.response.data === "string"
          ? err.response.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          : (err.response.data as any).message || "Signup failed";
      throw new Error(backendMessage);
    } else if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Signup failed. Please try again.");
    }
  }
};

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

const logout = (): void => {
  localStorage.removeItem("token");
};

export default { login, signup, getAuthToken, getAuthHeaders, logout };
