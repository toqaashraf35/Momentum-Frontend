import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api";

export const optionsService = {
  getCountries: async (): Promise<{ id: number; name: string }[]> => {
    const res = await axios.get<{ id: number; name: string }[]>(
      `${API_BASE}/countries`
    );
    return res.data;
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
    const res = await axios.get<{ id: number; name: string }[]>(
      `${API_BASE}/universities`
    );
    return res.data.map((u) => u.name);
  },

  getJobTitles: async (): Promise<string[]> => {
    const res = await axios.get<string[]>(`${API_BASE}/job-titles`);
    return res.data;
  },

  getCitiesByCountry: async (countryName: string): Promise<string[]> => {
    const res = await axios.get<{ id: number; name: string }[]>(
      `${API_BASE}/cities/${countryName}`
    );
    return res.data.map((c) => c.name);
  },
};
