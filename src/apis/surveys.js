import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;

// ── 목록 (진행/만료 구분) ─────────────────────────────
// 예: GET /surveys/?status=ongoing  |  status=done

export const fetchSurveys = async (status = "ongoing") => {
    const { data } = await axios.get(`${API_BASE}/surveys`, { params: { status } });
    return data;
  };

// ── 상세 ──────────────────────────────────────────────
// GET /surveys/{id}/
export const fetchSurveyDetail = async (id) => {
    const { data } = await axios.get(`${API_BASE}/surveys${id}/`);
    return data;
  };

// ── 생성(관리자) ──────────────────────────────────────
// POST /surveys/   body: { title, content, start_at, end_at, org_code? }
export const createSurvey = async (payload) => {
    const { data } = await axios.post(`${API_BASE}/surveys`, payload);
    return data; // { id, ... }
  };
// ── 투표 ──────────────────────────────────────────────
// POST /surveys/{id}/vote/  body 예: { option_id } 또는 { choice }
//(백엔드 정의에 맞춰 key 이름만 바꿔주면 됨)
export const voteSurvey = async (id, body) => {
    const { data } = await axios.post(`${API_BASE}/surveys/${id}/vote`, body);
    return data;
  };

// ── 결과 ──────────────────────────────────────────────
// GET /surveys/{id}/results
export const fetchSurveyResults = async (id) => {
    const { data } = await axios.get(`${API_BASE}/surveys/${id}/results`);
    return data;
  };
