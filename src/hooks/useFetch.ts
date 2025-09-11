// hooks/useFetch.ts
import { useState, useEffect } from "react";
import  axios, {type AxiosRequestConfig } from "axios";

export function useFetch<T>(url: string, config?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get<T>(url, config);
        if (isMounted) setData(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.message || "Error fetching data");
        } else {
          setError("Error fetching data");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, config]);

  return { data, isLoading, error };
}
