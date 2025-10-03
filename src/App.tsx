import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/MyProfilePage";
import MentorsPage from "./pages/MentorsPage";
import ChatbotPage from "./pages/ChatbotPage";

import CommunitiesPage from "./pages/CommunitiesPage";
import { CommunityPostsPage } from "./pages/CommunityPostsPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AnotherProfilePage from "./pages/AnotherProfilePage";
import ReviewApplicationPage from "./pages/ReviewApplicationPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookSessionPage from "./pages/BookSessionPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />

        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/community/:communityId/posts" element={<CommunityPostsPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/profile/:id" element={<AnotherProfilePage />} />
        <Route
          path="/admin/application/:id"
          element={<ReviewApplicationPage />}
        />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/Booking/:profileId" element={<BookSessionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
