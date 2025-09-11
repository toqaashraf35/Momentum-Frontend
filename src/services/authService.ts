// services/authService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

interface LoginResponse {
  token: string;
  userId: string;
  email: string;
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
      throw new Error("Login failed. Please try again.");
    }
  }
};

type SignupValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  country: string;
};

const signup = async (data: SignupValues): Promise<void> => {
  try {
    await axios.post(`${API_BASE}/auth/register`, data);
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
      throw new Error("Signup failed. Please try again.");
    }
  }
};


export default { login, signup };
