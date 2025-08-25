import axios from "axios";
const API_BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");


/** 목록: GET /surveys/?status=ongoing|done */
export const fetchSurveys = async (status = "ongoing") => {
  const { data } = await axios.get(`${API_BASE}/surveys/`, { params: { status } });
  return data;
};

/** 상세: GET /surveys/{id}/  */
export const fetchSurveyDetail = async (id) => {
  const { data } = await axios.get(`${API_BASE}/surveys/${id}/`);
  return data;
};

/** 생성(관리자): POST /surveys/ */
export const createSurvey = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/surveys/`, payload);
  return data;
};

/** 투표: POST /surveys/{id}/vote/  (body: { option_id } 또는 { choice }) */
export const voteSurvey = async (id, body) => {
  const { data } = await axios.post(`${API_BASE}/surveys/${id}/vote/`, body);
  return data;
};

/** 결과: GET /surveys/{id}/results/  */
export const fetchSurveyResults = async (id) => {
  const { data } = await axios.get(`${API_BASE}/surveys/${id}/results/`);
  return data;
};
