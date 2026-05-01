import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PublicLayout from "./layout/PublicLayout";
import Feed from "./pages/Feed";
import DesignsFeed from "./pages/DesignsFeed";
import DesignDetail from "./pages/DesignDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import CollabRequests from "./pages/CollabRequests";
import Search from "./pages/Search";
import Trending from "./pages/Trending";
import Saved from "./pages/Saved";
import MyProjects from "./pages/MyProjects";
import Messages from "./pages/Messages";
import Opportunities from "./pages/Opportunities";
import AdminPanel from "./pages/AdminPanel";
import AppLayout from "./layout/AppLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectModal from "./components/modals/ProjectModal";
import DesignModal from "./components/modals/DesignModal";
import Toast from "./components/Toast";
import { useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppContext";

const ProtectedRoute = ({ children }) => {
  try {
    const auth = useAuth();
    
    if (!auth) {
      console.error("ProtectedRoute: useAuth() returned undefined - AuthProvider may not be wrapping this component");
      return <Navigate to="/login" replace />;
    }
    
    const { token, loading } = auth;
    
    if (loading) return <div className="min-h-screen bg-[#09090e]" />;
    
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    console.error("ProtectedRoute: Error in ProtectedRoute:", error);
    return <Navigate to="/login" replace />;
  }
};

const AdminRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#09090e]" />;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/feed" replace />;
  }

  return <AdminPanel />;
};

const MyProfileRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to={`/profile/${user.username}`} replace /> : <Navigate to="/feed" replace />;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-[#09090e]" />;
  
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  
  return <LandingPage />;
};

function App() {
  const { showProjectModal, showDesignModal } = useApp();

  return (
    <>
      {showProjectModal && <ProjectModal />}
      {showDesignModal && <DesignModal />}
      <Toast />
      <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<RootRedirect />} />
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
        <Route path="designs" element={<DesignsFeed />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="design/:id" element={<DesignDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<MyProfileRedirect />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="requests" element={<CollabRequests />} />
        <Route path="trending" element={<Trending />} />
        <Route path="saved" element={<Saved />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
