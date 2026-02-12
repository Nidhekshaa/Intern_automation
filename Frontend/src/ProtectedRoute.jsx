import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
}

export default ProtectedRoute;
