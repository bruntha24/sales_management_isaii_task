// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useUserStore();

  // Get user from localStorage as fallback (on page refresh)
  const storedUser = user || JSON.parse(localStorage.getItem("user"));

  // If no user, redirect to login
  if (!storedUser) return <Navigate to="/login" replace />;

  // Role-based access control (optional)
  if (roles.length > 0 && !roles.includes(storedUser.role)) {
    return <Navigate to="/" replace />; // redirect if user role not allowed
  }

  // User exists → render page
  return children;
};

export default ProtectedRoute;
