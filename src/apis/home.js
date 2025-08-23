import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;

export const fetchPopularPosts = async () => {
  const res = await axios.get(`${API_BASE}/posts/top-liked`);
  return res.data;
};

export const fetchLatestNews = async () => {
  const res = await axios.get(`${API_BASE}/news/latest-three`);
  return res.data;
};
