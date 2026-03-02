import api from "./axios";

/* ===============================
   DAILY EXECUTION REPORTS API
   =============================== */

// CREATE
export const createDailyReport = (data) => api.post("/daily-execution", data);
  
  

// GET ALL (SUPERADMIN → all, SUPERVISOR → assigned only)
export const getAllDailyReports = ({
  page = 1,
  limit = 20,
  projectId,
  reportDate,
} = {}) => {
  const params = { page, limit };

  if (projectId) params.project_id = projectId;
  if (reportDate) params.report_date = reportDate;

  return api.get("/daily-execution/", { params });
};

// GET PROJECT REPORTS
export const getProjectReports = (projectId) =>
  api.get(`/daily-execution/project/${projectId}`);

// GET BY ID
export const getDailyReportById = (id) =>
  api.get(`/daily-execution/${id}`);



// UPDATE
export const updateDailyReport = (id, data) =>
  api.put(`/daily-execution/${id}`, data);

// DELETE (SUPERADMIN only OR creator – backend enforced)
export const deleteDailyReport = (id) =>
  api.delete(`/daily-execution/${id}`);

// PENDING REPORTS (SUPERADMIN)
export const getPendingReports = () =>
  api.get("/daily-execution/pending");
