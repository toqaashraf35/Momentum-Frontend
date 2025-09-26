// services/mentorService.ts
import axios from "axios";
import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

const mentorService = {
  async submitApplication(applicationData: { hourlyRate: number; cv: File }) {
    const formData = new FormData();
    formData.append("hourlyRate", applicationData.hourlyRate.toString());
    formData.append("cv", applicationData.cv);

    const response = await axios.post(
      `${API_BASE_URL}/mentor/applications`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authService.getAuthToken()}`,
        },
      }
    );

    return response.data;
  },

//   async getMyApplication() {
//     const response = await axios.get(`${API_BASE_URL}/mentor-applications/me`, {
//       headers: {
//         Authorization: `Bearer ${api.getToken()}`,
//       },
//     });

//     return response.data;
//   },

//   async updateApplication(id: number, updateData: { hourlyRate?: number }) {
//     const response = await axios.put(
//       `${API_BASE_URL}/mentor-applications/${id}`,
//       updateData,
//       {
//         headers: {
//           Authorization: `Bearer ${api.getToken()}`,
//         },
//       }
//     );

//     return response.data;
//   },
};

export default mentorService;
