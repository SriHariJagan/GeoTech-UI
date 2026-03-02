import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import NotFound from "../Pages/error/NotFound/NotFound";
import Projects from "../Pages/common/Projects/Projects";
import Machinery from "../Pages/admin/Machinery/Machinery";
import Vendors from "../Pages/admin/Vendors/Vendors";
import Supervisors from "../Pages/admin/Supervisors/Supervisors";
import DER from "../Pages/common/DER/DER";
import Users from "../Pages/Users/Users";
import ProjectDetails from "../components/ProjectDetails/ProjectDetails";
import DailyReportDetails from "../components/DailyReportDetails/DailyReportDetails";
import Expenditures from "../Pages/common/Expenditures/Expenditures";
import ExpenditureDetailed from "../Pages/common/Expenditures/Expen_Admin/ExpenditureDetailed/ExpenditureDetailed";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* /admin */}
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="machines" element={<Machinery />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="supervisors" element={<Supervisors />} />
        <Route path="daily-execution-report" element={<DER />} />
        <Route path="daily-execution-report/:id" element={<DailyReportDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="expenditures" element={<Expenditures />} />
        <Route path="expenditures/:projectId" element={<ExpenditureDetailed />} />


        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
