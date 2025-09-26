// services/optionsService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export const optionsService = {
  getCountriesName: async (): Promise<string[]> => {
    const res = await axios.get<{ id: number, name: string }[]>(`${API_BASE}/countries`);
    return res.data.map((c) => c.name);
  },

  getCountriesPhoneCodes: async (): Promise<string[]> => {
    const res = await axios.get<{ phoneCode: string }[]>(
      `${API_BASE}/countries`
    );
    return res.data.map((c) => c.phoneCode);
  },

  getTags: async (): Promise<string[]> => {
    const res = await axios.get<string[]>(`${API_BASE}/tags`);
    return res.data;
  },

  getUniversities: async (): Promise<string[]> => {
    const res = await axios.get<string[]>(`${API_BASE}/universities`);
    return res.data;
  },

  getJobTitles: async (): Promise<string[]> => {
    const res = await axios.get<string[]>(`${API_BASE}/job-titles`);
    return res.data;
  },

  getCitiesByCountry: async (countryId: number): Promise<string[]> => {
    const res = await axios.get<{ id: number; name: string }[]>(
      `${API_BASE}/cities/${countryId}`
    );
    return res.data.map((c) => c.name); 
  },
};
