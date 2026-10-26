import axios from "axios";

// The localhost fallback is for `npm run dev` only. A production build with no
// VITE_API_URL would otherwise silently call the visitor's own machine.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "");
if (!API_URL && !import.meta.env.DEV) {
  console.error("VITE_API_URL is not set — API requests will fail. Set it in the hosting platform before building.");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20000,
});

export const fetchProducts = (params = {}) => api.get("/products", { params }).then((r) => r.data);
export const fetchProductBySlug = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
export const fetchCategories = () => api.get("/categories").then((r) => r.data);
export const fetchApprovedReviews = () => api.get("/reviews").then((r) => r.data);
export const submitReview = (payload) => api.post("/reviews", payload).then((r) => r.data);
export const submitInquiry = (payload) => api.post("/inquiries", payload).then((r) => r.data);

export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const logout = () => api.post("/auth/logout").then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);

export const fetchAllProductsAdmin = () => api.get("/products/admin/all").then((r) => r.data);
export const fetchStats = () => api.get("/products/admin/stats").then((r) => r.data);
export const createProduct = (payload) => api.post("/products", payload).then((r) => r.data);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const toggleVisibility = (id) => api.patch(`/products/${id}/visibility`).then((r) => r.data);

export const createCategory = (payload) => api.post("/categories", payload).then((r) => r.data);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);
export const fetchCategoryUsage = () => api.get("/categories/usage").then((r) => r.data);

export const fetchAllReviewsAdmin = () => api.get("/reviews/admin/all").then((r) => r.data);
export const updateReviewStatus = (id, status) => api.patch(`/reviews/${id}/status`, { status }).then((r) => r.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);

export const uploadImages = (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return api
    .post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
      },
    })
    .then((r) => r.data);
};
export const deleteImage = (publicId) => api.delete(`/upload/${encodeURIComponent(publicId)}`).then((r) => r.data);

export default api;
