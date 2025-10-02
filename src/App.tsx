import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/MyProfilePage";
// import SignupAsMentorPage from "./pages/SignupAsMentorPage";
import ChatbotPage from "./pages/ChatbotPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import { CommunityPostsPage } from "./pages/CommunityPostsPage";
import { PostDetailPage } from "./pages/PostDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/signup-mentor" element={<SignupAsMentorPage />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/community/:communityId/posts" element={<CommunityPostsPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
