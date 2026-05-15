import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default RoleProtectedRoute;