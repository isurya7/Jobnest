import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

function Feed() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-xl">Welcome, {user?.username}</h1>
      <button onClick={logout} className="text-blue-600 mt-2">Log out</button>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/feed" /> : <Auth />} />
      <Route path="/feed" element={user ? <Feed /> : <Navigate to="/auth" />} />
      <Route path="/" element={<Navigate to={user ? "/feed" : "/auth"} />} />
    </Routes>
  );
}

export default App;