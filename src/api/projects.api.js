import api from "./axios";

// -------------------- Projects APIs --------------------

// Get all projects for current user (superadmin or supervisor)
export const getMyProjects = () => api.get("/projects/my-projects");

// Get a project by ID
export const getProjectById = (id) => api.get(`/projects/${id}/`);

// Create a new project
// Data can include supervisor_ids & machine_ids
export const createProject = (data) => api.post("/projects/", data);

// Update an existing project by ID
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

// Delete a project by ID
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Note: Assign supervisor & machine is handled in updateProject
// So we remove the separate endpoints:
