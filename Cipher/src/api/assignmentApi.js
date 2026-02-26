import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getAssignments = () => API.get("/assignments");

export const getAssignmentById = (id) => API.get(`/assignments/${id}`);
