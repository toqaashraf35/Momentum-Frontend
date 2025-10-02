import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/MyProfilePage";
import MentorsPage from "./pages/MentorsPage";
import ChatbotPage from "./pages/ChatbotPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AnotherProfilePage from "./pages/AnotherProfilePage";
import ReviewApplicationPage from "./pages/ReviewApplicationPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookSessionPage from "./pages/BookSessionPage";
import NotificationsPage from "./pages/NotificationsPage";

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
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/profile/:id" element={<AnotherProfilePage />} />
        <Route
          path="/admin/application/:id"
          element={<ReviewApplicationPage />}
        />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/Booking/:profileId" element={<BookSessionPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
