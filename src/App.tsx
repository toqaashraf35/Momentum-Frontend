import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/MyProfilePage";
// import SignupAsMentorPage from "./pages/SignupAsMentorPage";
import ChatbotPage from "./pages/ChatbotPage";

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
      </Routes>
    </Router>
  );
}

export default App;
