import { useState, useEffect } from "react";
import profileService, {
  type UserProfileRequestDto,
  type UserProfileResponseDto,
} from "../services/profileService";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfileResponseDto | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileRequestDto>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getMyProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        country: profileData.country,
        bio: profileData.bio,
        phoneCode: profileData.phoneCode,
        phoneNumber: profileData.phoneNumber,
        city: profileData.city,
        university: profileData.university,
        tags: profileData.tags,
        githubLink: profileData.githubLink,
        linkedinLink: profileData.linkedinLink,
        jobTitle: profileData.jobTitle,
        hourRate: profileData.hourRate,
        avatarURL: profileData.avatarUrl,
      });
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      if (
        !formData.name ||
        !formData.username ||
        !formData.email ||
        !formData.country
      ) {
        setMessage({ type: "error", text: "Please fill all required fields" });
        return;
      }

      const updatedProfile = await profileService.updateProfile(
        formData as UserProfileRequestDto
      );
      setProfile(updatedProfile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);
      const result = await profileService.uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatarURL: result.avatarUrl }));
      setMessage({ type: "success", text: "Avatar uploaded successfully!" });

      // Update profile after avatar upload
      const updatedProfile = await profileService.getMyProfile();
      setProfile(updatedProfile);
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    formData,
    loading,
    message,
    handleInputChange,
    handleTagsChange,
    handleSubmit,
    handleAvatarUpload,
    setMessage,
  };
};
