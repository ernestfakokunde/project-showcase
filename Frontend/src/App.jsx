import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PublicLayout from "./layout/PublicLayout";
import Feed from "./pages/Feed";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import CollabRequests from "./pages/CollabRequests";
import PlaceholderPage from "./pages/PlaceholderPage";
import AppLayout from "./layout/AppLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PostProject from "./pages/PostProject";
import ProjectDetail from "./pages/ProjectDetail";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#09090e]" />;
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="feed" element={<Feed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="create" element={<PostProject />} />
        <Route path="post-project" element={<PostProject />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="requests" element={<CollabRequests />} />
        <Route path="trending" element={<PlaceholderPage />} />
        <Route path="saved" element={<PlaceholderPage />} />
        <Route path="my-projects" element={<PlaceholderPage />} />
        <Route path="messages" element={<PlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
