import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import Feed from "./pages/Feed";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/feed" /> : <Auth />} />
      <Route path="/feed" element={user ? <Feed /> : <Navigate to="/auth" />} />
      <Route path="/profile" element={user ? <ProfileSetup /> : <Navigate to="/auth" />} />
      <Route path="/" element={<Navigate to={user ? "/feed" : "/auth"} />} />
    </Routes>
  );
}

export default App;