import api from "./axios";

export const getSupervisors = () =>
  api.get("/supervisors/");
