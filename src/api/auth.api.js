// auth.api.js
import api from "./axios";

export const login = (data) => api.post("/users/login", data);

export const inviteUser = (data) => api.post("/users/invite", data);

export const acceptInvite = (data) => api.post("/users/accept-invite", data);

export const getUsersAdmin = () => api.get("/users/admin");

export const createUser = (data) => api.post("/users/", data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);
