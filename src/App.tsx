import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import CompleteProfilePage from "./pages/CompleteProfilePage"

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/complete-profile" element={<CompleteProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
