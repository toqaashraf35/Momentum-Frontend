// // components/EditProfileModal.tsx
// import React, { useState } from "react";
// import Input from "./Input";
// import Button from "./Button";
// import {
//   profileService,
//   type UserProfileResponseDto,
// } from "../services/profileService";

// type EditProfileModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: () => void; // هنستعمل refetch من useUser
//   initialData: UserProfileResponseDto;
// };

// export default function EditProfileModal({
//   isOpen,
//   onClose,
//   onSave,
//   initialData,
// }: EditProfileModalProps) {
//   const [formData, setFormData] = useState({
//     displayName: initialData.displayName || "",
//     bio: initialData.bio || "",
//     phoneNumber: initialData.phoneNumber || "",
//     jobTitle: initialData.jobTitle || "",
//     university: initialData.university || "",
//     tags: (initialData.tags || []).join(", "),
//     city: initialData.city || "",
//     linkedin: initialData.linkedin || "",
//     github: initialData.github || "",
//     avatarUrl: initialData.avatarUrl || "",
//     price: initialData.price?.toString() || "",
//   });
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       try {
//         setLoading(true);
//         const { avatarUrl } = await profileService.uploadAvatar(file);
//         setFormData((prev) => ({ ...prev, avatarUrl }));
//       } catch (err) {
//         console.error("Avatar upload failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await profileService.updateProfile({
//         displayName: formData.displayName,
//         bio: formData.bio,
//         phoneNumber: formData.phoneNumber,
//         jobTitle: formData.jobTitle,
//         university: formData.university,
//         tags: formData.tags.split(",").map((tag) => tag.trim()),
//         city: formData.city,
//         linkedin: formData.linkedin,
//         github: formData.github,
//         avatarUrl: formData.avatarUrl,
//         price: formData.price ? Number(formData.price) : undefined,
//       });
//       onSave(); // نعمل refetch
//       onClose();
//     } catch (err) {
//       console.error("Update profile failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Avatar */}
//           <div className="flex flex-col items-center gap-3">
//             {formData.avatarUrl && (
//               <img
//                 src={formData.avatarUrl}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover border"
//               />
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarChange}
//               disabled={loading}
//             />
//           </div>

//           {/* Inputs */}
//           <Input
//             id="displayName"
//             name="displayName"
//             label="Name"
//             value={formData.displayName}
//             onChange={handleChange}
//           />
//           <Input
//             id="email"
//             name="email"
//             label="Email"
//             value={initialData.user.email}
//             onChange={() => {}}
//             disabled
//           />
//           <Input
//             id="username"
//             name="username"
//             label="Username"
//             value={initialData.user.username}
//             onChange={() => {}}
//             disabled
//           />
//           <Input
//             id="bio"
//             name="bio"
//             label="Bio"
//             value={formData.bio}
//             onChange={handleChange}
//           />
//           <Input
//             id="country"
//             name="country"
//             label="Country"
//             value={initialData.user.country || ""}
//             onChange={() => {}}
//             disabled
//           />
//           <Input
//             id="city"
//             name="city"
//             label="City"
//             value={formData.city}
//             onChange={handleChange}
//           />
//           <Input
//             id="jobTitle"
//             name="jobTitle"
//             label="Job Title"
//             value={formData.jobTitle}
//             onChange={handleChange}
//           />
//           <Input
//             id="university"
//             name="university"
//             label="University"
//             value={formData.university}
//             onChange={handleChange}
//           />
//           <Input
//             id="phoneNumber"
//             name="phoneNumber"
//             label="Phone Number"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//           />
//           <Input
//             id="tags"
//             name="tags"
//             label="Tags (comma separated)"
//             value={formData.tags}
//             onChange={handleChange}
//           />
//           <Input
//             id="linkedin"
//             name="linkedin"
//             label="LinkedIn"
//             value={formData.linkedin}
//             onChange={handleChange}
//           />
//           <Input
//             id="github"
//             name="github"
//             label="GitHub"
//             value={formData.github}
//             onChange={handleChange}
//           />
//           {initialData.user.role === "MENTOR" && (
//             <Input
//               id="price"
//               name="price"
//               label="Price"
//               value={formData.price}
//               onChange={handleChange}
//             />
//           )}

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-6">
//             <Button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 text-black"
//             >
//               Cancel
//             </Button>
//             <Button type="submit" isLoading={loading}>
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
