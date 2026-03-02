import api from "./axios";

/* ================= GET BY PROJECT ================= */
export const getProjectExpenditures = async (projectId) => {
  const { data } = await api.get(`/expenditures/project/${projectId}`);
  return data;
};


/* ================= CREATE ================= */
export const createExpenditure = async (payload) => {
  const { data } = await api.post("/expenditures/", payload);
  return data;
};

/* ================= UPDATE ================= */
export const updateExpenditure = async (id, payload) => {
  const { data } = await api.put(`/expenditures/${id}`, payload);
  return data;
};

/* ================= DELETE ================= */
export const deleteExpenditure = async (id) => {
  const { data } = await api.delete(`/expenditures/${id}`);
  return data;
};

/* ================= TOTALS ================= */
export const getProjectTotals = async (projectId) => {
  const { data } = await api.get(
    `/expenditures/project/${projectId}/totals`
  );
  return data;
};

/* ================= DETAILED ================= */
export const getProjectDetailed = async (projectId) => {
  const { data } = await api.get(
    `/expenditures/project/${projectId}/detailed`
  );
  return data;
};

/* ================= AGGREGATED ALL PROJECTS ================= */
export const getAllProjectsExpendituresAggregated = async () => {
  const { data } = await api.get(
    "/expenditures/aggregated-all-projects"
  );
  return data;
};