// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { profileService } from "../services/profileService";
// import Button from "./Button";
// import Input from "./Input";
// import type { UserProfile} from "../types/api";
// // import {useFetch} from "../hooks/useFetch"

// export default function ProfileCompletion() {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [tags, setTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState("");

//   const [formData, setFormData] = useState<UserProfile>({
//     bio: "",
//     phoneNumber: "",
//     countryCode: "+20",
//     university: "",
//     jobTitle: "",
//     city: "",
//     linkedin: "",
//     github: "",
//   });


//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const addTag = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags((prev) => [...prev, newTag.trim()]);
//       setNewTag("");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await profileService.updateProfile({
//         ...formData,
//         tags: tags.length > 0 ? tags : undefined,
//       });

//       alert("Profile updated successfully!");
//       navigate("/");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error("Error updating profile:", error.message);
//         alert(error.message || "Failed to update profile. Please try again.");
//       } else {
//         console.error("Error updating profile:", error);
//         alert("Failed to update profile. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSkip = () => {
//     navigate("/");
//   };


//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Complete Your Profile
//           </h1>
//           <p className="text-gray-600">
//             Add some details to help others get to know you better. All fields
//             are optional.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Bio */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               value={formData.bio || ""}
//               onChange={handleInputChange}
//               placeholder="Tell us about yourself..."
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//             />
//           </div>

//           {/* Contact Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex gap-2">

//               <Input
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 type="tel"
//                 placeholder="Phone number"
//                 value={formData.phoneNumber || ""}
//                 onChange={handleInputChange}
//                 label="Phone Number"
//               />
//             </div>

//             <Input
//               id="city"
//               name="city"
//               placeholder="City"
//               value={formData.city || ""}
//               onChange={handleInputChange}
//               label="City"
//             />
//           </div>

//           {/* Professional Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="university"
//               name="university"
//               placeholder="University"
//               value={formData.university || ""}
//               onChange={handleInputChange}
//               label="University"
//             />

//             <Input
//               id="jobTitle"
//               name="jobTitle"
//               placeholder="Job Title"
//               value={formData.jobTitle || ""}
//               onChange={handleInputChange}
//               label="Job Title"
//             />
//           </div>

//           {/* Social Links */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="linkedIn"
//               name="linkedin"
//               placeholder="LinkedIn URL"
//               value={formData.linkedin || ""}
//               onChange={handleInputChange}
//               type="url"
//               label="LinkedIn Link"
//             />

//             <Input
//               id="github"
//               name="github"
//               placeholder="GitHub URL"
//               value={formData.github || ""}
//               onChange={handleInputChange}
//               type="url"
//               label="GitHub Link"
//             />
//           </div>

//           {/* Tags */}
//           <div className="flex gap-15 mb-3">
//             <Input
//               id="addTag"
//               name="addTag"
//               placeholder="Add a tag"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               label="Skills & Intersets"
//               // onKeyPress={handleTagKeyPress}
//             />
//             <Button
//               type="button"
//               text="Add"
//               onClick={addTag}
//               disabled={!newTag.trim()}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6">
//             <Button
//               type="submit"
//               text={isLoading ? "Saving..." : "Save Profile"}
//               isLoading={isLoading}
//               disabled={isLoading}
//             />

//             <Button
//               type="button"
//               text="Skip for Now"
//               //   variant="outline"
//               onClick={handleSkip}
//               disabled={isLoading}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
