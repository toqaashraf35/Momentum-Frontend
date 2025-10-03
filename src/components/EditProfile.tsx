import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useOptions } from "../hooks/useOptions";
import Avatar from "./Avatar";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    profile,
    formData,
    loading,
    message,
    handleInputChange,
    handleTagsChange,
    handleSubmit,
    handleAvatarUpload,
    setMessage,
  } = useProfile();

  const {
    countries,
    tags: availableTags,
    jobTitles,
    phoneCodes,
    universities,
    cities,
    loading: optionsLoading,
  } = useOptions(formData?.country);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);

    // Close modal on successful update
    if (message?.type === "success") {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  // Reset message when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen, setMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Alert Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="text-gray-500 hover:text-gray-700 ml-4"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={formData?.avatarURL}
                  name={formData?.name || "User"}
                  size="xl"
                  className="border-2 border-gray-300"
                />
                <input
                  type="file"
                  id="avatar-upload"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
                >
                  Change Photo
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG recommended. Max 5MB.
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData?.name || ""}
                onChange={handleInputChange}
                size="lg"
              />

              <Input
                id="username"
                name="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={formData?.username || ""}
                onChange={handleInputChange}
                size="lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                size="lg"
              />

              <Select
                id="tags"
                label="Skills & Tags"
                name="tags"
                value={formData?.tags || []}
                options={availableTags}
                onChange={(e) => {
                  const selectedTags = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value];
                  handleTagsChange(selectedTags);
                }}
                multiple={true}
                placeholder="Select your skills"
                size="lg"
                disabled={optionsLoading}
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="country"
                label="Country"
                name="country"
                value={formData?.country || ""}
                options={countries}
                onChange={handleInputChange}
                placeholder="Select your country"
                size="lg"
                disabled={optionsLoading}
              />

              <Select
                id="city"
                label="City"
                name="city"
                value={formData?.city || ""}
                options={cities}
                onChange={handleInputChange}
                placeholder="Select your city"
                size="lg"
                disabled={optionsLoading || !formData?.country}
              />
            </div>
            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData?.bio || ""}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your experience, and what you can offer..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="jobTitle"
                label="Job Title"
                name="jobTitle"
                value={formData?.jobTitle || ""}
                options={jobTitles}
                onChange={handleInputChange}
                placeholder="Select your job title"
                size="lg"
                disabled={optionsLoading}
              />

              <Select
                id="university"
                label="University"
                name="university"
                value={formData?.university || ""}
                options={universities}
                onChange={handleInputChange}
                placeholder="Select your university"
                size="lg"
                disabled={optionsLoading}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="phoneCode"
                label="Phone Code"
                name="phoneCode"
                value={formData?.phoneCode || ""}
                options={phoneCodes}
                onChange={handleInputChange}
                placeholder="Select code"
                size="lg"
                disabled={optionsLoading}
              />

              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                label="Phone Number"
                placeholder="1234567890"
                value={formData?.phoneNumber || ""}
                onChange={handleInputChange}
                size="lg"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="githubLink"
                name="githubLink"
                type="text"
                label="GitHub Profile"
                placeholder="https://github.com/username"
                value={formData?.githubLink || ""}
                onChange={handleInputChange}
                size="lg"
              />

              <Input
                id="linkedinLink"
                name="linkedinLink"
                type="text"
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/username"
                value={formData?.linkedinLink || ""}
                onChange={handleInputChange}
                size="lg"
              />
            </div>

            {/* Hourly Rate for Mentors */}
            {profile?.role === "MENTOR" && (
              <Input
                id="hourRate"
                name="hourRate"
                type="number"
                label="Hourly Rate ($)"
                placeholder="Enter your hourly rate"
                value={formData?.hourRate || ""}
                onChange={handleInputChange}
                size="lg"
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                color="primary"
                size="lg"
              >
                Save Changes
              </Button>

              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                color="secondary"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
