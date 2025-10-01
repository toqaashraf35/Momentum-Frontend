import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Avatar from "./Avatar";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";
import profileService, {
  type UpdateProfileRequest,
} from "../services/profileService";
import { useFetch } from "../hooks/useFetch";
import { useOptions } from "../hooks/useOptions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  country: string;
  bio: string;
  hourRate: number | null;
  github: string;
  linkedin: string;
  jobTitle: string;
  university: string;
  city: string;
  phoneCode: string;
  phoneNumber: string;
  tags: string[];
  avatarURL: string;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    country: "",
    bio: "",
    hourRate: null,
    github: "",
    linkedin: "",
    jobTitle: "",
    university: "",
    city: "",
    phoneCode: "",
    phoneNumber: "",
    tags: [],
    avatarURL: "",
  });
  const { data: userProfile, refetch } = useFetch(profileService.getMyProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { countries, phoneCodes, tags, jobTitles, universities, cities } =
    useOptions(formData.country || undefined);

  // Fill form with user data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        country: userProfile.country || "",
        bio: userProfile.bio || "",
        hourRate:
          userProfile.hourRate && userProfile.hourRate > 0.0
            ? userProfile.hourRate
            : null,
        github: userProfile.githubLink || "",
        linkedin: userProfile.linkedinLink || "",
        jobTitle: userProfile.jobTitle || "",
        university: userProfile.university || "",
        city: userProfile.city || "",
        phoneCode: userProfile.phoneCode || "",
        phoneNumber: userProfile.phoneNumber || "",
        tags: Array.isArray(userProfile.tags) ? userProfile.tags : [],
        avatarURL: userProfile.avatarURL || "",
      });
      setAvatarPreview(userProfile.avatarURL || null);
    }
  }, [userProfile]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAvatarFile(null);
      setAvatarPreview(userProfile?.avatarURL || null);
    }
  }, [isOpen, userProfile]);

  // Unified handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourRate" ? (value ? Number(value) : null) : value,
      ...(name === "country" && { city: "" }), // Reset city when country changes
    }));
  };

  // Handle multiple select (tags)
  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, tags: selectedOptions }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload avatar first if there's a new file
      let avatarUrl = formData.avatarURL;
      if (avatarFile) {
        const avatarResponse = await profileService.uploadAvatar(avatarFile);
        avatarUrl = avatarResponse.avatarURL || "";
      }

      // Prepare update data - only send defined values and handle empty strings
      const updateData: UpdateProfileRequest = {
        name: formData.name.trim() || null,
        username: formData.username.trim() || null,
        country: formData.country.trim() || null,
        email: formData.email.trim() || null,
        bio: formData.bio.trim() || null,
        githubLink: formData.github.trim() || null,
        linkedinLink: formData.linkedin.trim() || null,
        jobTitle: formData.jobTitle.trim() || null,
        university: formData.university.trim() || null,
        city: formData.city.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        phoneCode: formData.phoneCode.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        hourRate: formData.hourRate || null,
        avatarURL: avatarUrl || null,
      };

      // Remove undefined properties
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof UpdateProfileRequest] === undefined) {
          delete updateData[key as keyof UpdateProfileRequest];
        }
      });

      await profileService.updateProfile(updateData);
      await refetch();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar
                src={avatarPreview || userProfile?.avatarURL}
                name={userProfile?.name}
                size="xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full shadow-md hover:bg-[var(--secondary)] transition-colors"
              >
                <Upload size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Click the icon to upload a new avatar
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <Input
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
            <Select
              id="country"
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              options={countries}
              size="md"
            />
          </div>

          {/* Bio */}
          <Input
            id="bio"
            name="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            size="2xl"
          />

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="github"
              name="github"
              label="GitHub URL"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
            <Input
              id="linkedin"
              name="linkedin"
              label="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="jobTitle"
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              options={jobTitles}
              size="md"
            />
            <Select
              id="university"
              label="University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              options={universities}
              size="md"
            />
            <Select
              id="city"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              options={cities}
              size="md"
            />

            <Select
              id="tags"
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleTagsChange}
              options={tags}
              multiple
              size="md"
            />
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="phoneCode"
              label="Phone Code"
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleChange}
              options={phoneCodes}
              size="md"
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          {/* Hourly Rate - Conditionally rendered */}
          {userProfile?.role !== "LEARNER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="hourRate"
                name="hourRate"
                type="number"
                label="Price per hour ($)"
                value={formData.hourRate ?? ""}
                onChange={handleChange}
                placeholder="e.g., 50"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-7 pt-4">
            <Button type="button" onClick={onClose} color="secondary" size="md">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              color="primary"
              size="md"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
