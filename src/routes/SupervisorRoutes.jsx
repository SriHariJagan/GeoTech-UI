import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import SupervisorLayout from "../layouts/SupervisorLayout";

// Pages
import NotFound from "../Pages/error/NotFound/NotFound";
import { ROLES } from "../constants/roles";
import Projects from "../Pages/common/Projects/Projects";
import DER from "../Pages/common/DER/DER";

export default function SupervisorRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} />
        }
      >
        <Route element={<SupervisorLayout />}>
          {/* Supervisor dashboard can also be added here if you have one */}
          <Route index element={<Projects />} /> 

          {/* Pages accessible to supervisors */}
          <Route path="my-projects" element={<Projects />} />
          <Route path="daily-execution-report" element={<DER />} />

          {/* fallback for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
