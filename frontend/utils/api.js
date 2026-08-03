import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Interceptor to attach Authorization Bearer token header if present in localStorage
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API (Codix Style)
export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  if (data.token && typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await API.post("/auth/register", { name, email, password });
  if (data.token && typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }
  return data;
};

export const logoutUser = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  const { data } = await API.post("/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data.user || data;
};

// Books API
export const getBooks = async (status = "", search = "") => {
  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  const { data } = await API.get("/books", { params });
  return data;
};

export const createBook = async (bookData) => {
  const { data } = await API.post("/books", bookData);
  return data;
};

export const updateBook = async (id, bookData) => {
  const { data } = await API.put(`/books/${id}`, bookData);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await API.delete(`/books/${id}`);
  return data;
};

export default API;
