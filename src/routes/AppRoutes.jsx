import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../store/context/AuthContext";
import { ROLES } from "../constants/roles";

import AdminRoutes from "./AdminRoutes";
// import SupervisorRoutes from "./SupervisorRoutes";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import Login from "../Pages/auth/login/Login";
import Unauthorized from "../Pages/error/Unauthorized/Unauthorized";
import NotFound from "../Pages/error/NotFound/NotFound";
import AcceptInvite from "../Pages/AcceptInvite/AcceptInvite";
import SupervisorRoutes from "./SupervisorRoutes";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Supervisor (later) */}
      <Route path="/supervisor/*" element={<SupervisorRoutes />} />

      {/* Errors */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            user.role === ROLES.SUPERADMIN ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/supervisor" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
