// hooks/useOptions.ts
import { useState, useEffect } from "react";
import { optionsService } from "../services/optionsService";

export function useOptions(countryId?: number) {
  const [countries, setCountries] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [phoneCodes, setPhoneCodes] = useState<string[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);

        const [
          countriesRes,
          phoneCodesRes,
          tagsRes,
          jobTitlesRes,
          universitiesRes,
        ] = await Promise.all([
          optionsService.getCountriesName(),
          optionsService.getCountriesPhoneCodes(),
          optionsService.getTags(),
          optionsService.getJobTitles(),
          optionsService.getUniversities(),
        ]);

        setCountries(countriesRes);
        setPhoneCodes(phoneCodesRes);
        setTags(tagsRes);
        setJobTitles(jobTitlesRes);
        setUniversities(universitiesRes);

        if (countryId) {
          const citiesRes = await optionsService.getCitiesByCountry(countryId);
          setCities(citiesRes);
        } else {
          setCities([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [countryId]);
  return {
    countries,
    tags,
    jobTitles,
    phoneCodes,
    universities,
    cities,
    loading,
    error,
  };
}

