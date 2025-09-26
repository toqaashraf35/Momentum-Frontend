// // EditProfileModal.tsx
// import { useState, useRef, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import Avatar from "./Avatar";
// import Input from "./Input";
// import Button from "./Button";
// import Select from "./Select"
// import {
//   profileService,
//   type UpdateProfileRequest,
// } from "../services/profileService";
// import { useUser } from "../hooks/useUser";
// import { useOptions } from "../hooks/useOptions"

// interface EditProfileModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
//   const { userProfile, refetch } = useUser();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const { countries, phoneCodes,tags, jobTitles, loading } = useOptions();
  

//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     country: "",
//     bio: "",
//     hourRate: null as number | null,
//     github: "",
//     linkedin: "",
//     jobTitle: "",
//     university: "",
//     city: "",
//     phoneNumber: "",
//     tags: "",
//   });

//   // Fill form with user data
//   useEffect(() => {
//     if (userProfile) {
//       setFormData({
//         name: userProfile.name || "",
//         username: userProfile.username || "",
//         email: userProfile.email || "",
//         country: userProfile.country || "",
//         bio: userProfile.bio || "",
//         hourRate:
//           userProfile.hourRate && userProfile.hourRate > 0.0
//             ? userProfile.hourRate
//             : null,
//         github: userProfile.githubLink || "",
//         linkedin: userProfile.linkedinLink || "",
//         jobTitle: userProfile.jobTitle || "",
//         university: userProfile.university || "",
//         city: userProfile.city || "",
//         phoneNumber: userProfile.phoneNumber || "",
//         tags: userProfile.tags?.join(", ") || "",
//       });
//     }
//   }, [userProfile]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setAvatarPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // upload avatar if changed
//       if (avatarFile) {
//         await profileService.uploadAvatar(avatarFile);
//       }

//       const updateData: UpdateProfileRequest = {
//         name: formData.name.trim() || null,
//         username: formData.username.trim() || null,
//         country: formData.country.trim() || null,
//         email: formData.email.trim() || null,
//         bio: formData.bio.trim() || null,
//         githubLink: formData.github.trim() || null,
//         linkedinLink: formData.linkedin.trim() || null,
//         jobTitle: formData.jobTitle.trim() || null,
//         university: formData.university.trim() || null,
//         city: formData.city.trim() || null,
//         phoneNumber: formData.phoneNumber.trim() || null,
//         tags: formData.tags
//           .split(",")
//           .map((tag) => tag.trim())
//           .filter((tag) => tag),
//         hourRate: formData.hourRate ? formData.hourRate : null,
//       };

//       await profileService.updateProfile(updateData);

//       // refresh user data immediately
//       await refetch();

//       onClose();
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       alert(
//         error instanceof Error ? error.message : "Failed to update profile"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Avatar Upload */}
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               <Avatar
//                 src={avatarPreview || userProfile?.avatarURL}
//                 name={userProfile?.name}
//                 size="xl"
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full shadow-md hover:bg-[var(--secondary)] transition-colors"
//               >
//                 <Upload size={16} />
//               </button>
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarChange}
//               className="hidden"
//             />
//             <p className="text-sm text-gray-500 mt-2">
//               Click the icon to upload a new avatar
//             </p>
//           </div>

//           {/* Basic Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               id="name"
//               name="name"
//               label="Full Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Your full name"
//             />
//             <Input
//               id="username"
//               name="username"
//               label="Username"
//               value={formData.username}
//               onChange={handleInputChange}
//               placeholder="Your username"
//             />
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               label="Email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Your email"
//             />

//             {userProfile?.role !== "LEARNER" && (
//               <Input
//                 id="hourRate"
//                 name="hourRate"
//                 type="number"
//                 label="Price per hour ($)"
//                 value={formData.hourRate ?? ""}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 50"
//                 disabled={userProfile?.role === "Learner"}
//               />
//             )}
//           </div>

//           {userProfile?.role === "LEARNER" && (
//             <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//               <p className="text-sm text-blue-700">
//                 Price field is only available for mentors. As a learner, you
//                 don't need to set an hourly rate.
//               </p>
//             </div>
//           )}

//           {/* Bio */}
//           <Input
//             id="bio"
//             name="bio"
//             label="Bio"
//             value={formData.bio}
//             onChange={handleInputChange}
//             placeholder="Tell us about yourself"
//             size="2xl"
//           />

//           {/* Social Links */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               id="github"
//               name="github"
//               label="GitHub URL"
//               value={formData.github}
//               onChange={handleInputChange}
//               placeholder="https://github.com/username"
//             />
//             <Input
//               id="linkedin"
//               name="linkedin"
//               label="LinkedIn URL"
//               value={formData.linkedin}
//               onChange={handleInputChange}
//               placeholder="https://linkedin.com/in/username"
//             />
//           </div>

//           {/* Professional Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <Select
//                 id="JobTitles"
//                 label="Job Title"
//                 name="jobTitle"
//                 value={formData.jobTitle}
//                 onChange={(e) => setFieldValue("jobTitle", e.target.value)}
//                 options={jobTitles}
//               />
//             </div>

//             <Input
//               id="university"
//               name="university"
//               label="University"
//               value={formData.university}
//               onChange={handleInputChange}
//               placeholder="Your university"
//             />

//             <Input
//               id="city"
//               name="city"
//               label="City"
//               value={formData.city}
//               onChange={handleInputChange}
//               placeholder="Your city"
//             />

//             <Select
//               id="Tags"
//               label="Tags"
//               name="tags"
//               value={formData.tags}
//               onChange={(e) => setFieldValue("tags", e.target.value)}
//               options={tags}
//               multiple
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="grid grid-cols-1 gap-4">
//             <Select
//               id="PhoneCodes"
//               label="Phone Codes"
//               name="phoneCodes"
//               value={formData.jobTitle}
//               onChange={(e) => setFieldValue("jobTitle", e.target.value)}
//               options={jobTitles}
//             />
//             <Input
//               id="phoneNumber"
//               name="phoneNumber"
//               type="tel"
//               label="Phone Number"
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//               placeholder="Phone number"
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex gap-4 pt-4">
//             <Button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 text-gray-700 hover:bg-gray-400"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               isLoading={isLoading}
//               className="bg-[var(--primary)] hover:bg-[var(--secondary)]"
//             >
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfileModal;


// EditProfileModal.tsx
import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Avatar from "./Avatar";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";
import {
  profileService,
  type UpdateProfileRequest,
} from "../services/profileService";
import { useUser } from "../hooks/useUser";
import { useOptions } from "../hooks/useOptions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { userProfile, refetch } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { countries, phoneCodes, tags, jobTitles, universities } = useOptions();
  

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    country: "",
    bio: "",
    hourRate: null as number | null,
    github: "",
    linkedin: "",
    jobTitle: "",
    university: "",
    city: "",
    phoneNumber: "",
    tags: "",
  });

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
        phoneNumber: userProfile.phoneNumber || "",
        tags: userProfile.tags?.join(", ") || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // upload avatar if changed
      if (avatarFile) {
        await profileService.uploadAvatar(avatarFile);
      }

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
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        hourRate: formData.hourRate ? formData.hourRate : null,
      };

      await profileService.updateProfile(updateData);

      // refresh user data immediately
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
              onChange={handleInputChange}
              placeholder="Your full name"
            />
            <Input
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Your username"
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email"
            />
            <Select
              id="Country"
              label="Country"
              name="country"
              value={formData.country}
              onChange={(e) => setFieldValue("country", e.target.value)}
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
            onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="https://github.com/username"
            />
            <Input
              id="linkedin"
              name="linkedin"
              label="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleInputChange}
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
              onChange={handleSelectChange}
              options={jobTitles}
              size="md"
            />

            <Select
              id="University"
              label="University"
              name="university"
              value={formData.university}
              onChange={(e) => setFieldValue("university", e.target.value)}
              options={universities}
              size="md"
            />

            <Input
              id="city"
              name="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Your city"
            />

            <Select
              id="tags"
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleSelectChange}
              options={tags}
              multiple
              size="md"
            />
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="phoneCodes"
              label="Phone Codes"
              name="phoneCodes"
              value={formData.phoneNumber}
              onChange={handleSelectChange}
              options={phoneCodes}
              size="md"
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone number"
            />
            {userProfile?.role !== "LEARNER" && (
              <Input
                id="hourRate"
                name="hourRate"
                type="number"
                label="Price per hour ($)"
                value={formData.hourRate ?? ""}
                onChange={handleInputChange}
                placeholder="e.g., 50"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-[var(--primary)] hover:bg-[var(--secondary)]"
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