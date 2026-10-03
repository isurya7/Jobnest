import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import Feed from "./pages/Feed";
import JobDetail from "./pages/JobDetail";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/feed" /> : <Landing />} />
      <Route path="/auth" element={user ? <Navigate to="/feed" /> : <Auth />} />
      <Route path="/feed" element={user ? <Feed /> : <Navigate to="/auth" />} />
      <Route path="/jobs/:id" element={user ? <JobDetail /> : <Navigate to="/auth" />} />
      <Route path="/profile" element={user ? <ProfileSetup /> : <Navigate to="/auth" />} />
      <Route path="/saved" element={user ? <SavedJobs /> : <Navigate to="/auth" />} />
      <Route path="/applications" element={user ? <Applications /> : <Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;