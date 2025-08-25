// src/pages/SurveyPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  Wrap,
  TopBar, TopBackBtn, TopTitle,
  SectionTop,
  Segmented,
  SegBtn,
  List,
  Item,
  Title,
  More,
  Divider,
  ListHeader,
} from "./survey.styled";

const API_BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

export default function SurveyPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("ongoing"); // 'ongoing' | 'done'
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // 목록 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        // ✅ 슬래시 제거: GET /surveys
        const { data } = await axios.get(`${API_BASE}/surveys/`);
        if (!alive) return;
        setSurveys(Array.isArray(data) ? data : (data?.results ?? []));
      } catch (e) {
        setErr("설문 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 진행/완료 분류
  const categorized = useMemo(() => {
    const now = new Date();
    const toTab = (s) => {
      if (s?.status === "ongoing") return "ongoing";
      if (s?.status === "done" || s?.status === "closed") return "done";
      if (s?.end_at) {
        return new Date(s.end_at) >= now ? "ongoing" : "done";
      }
      return "ongoing";
    };
    const ongoing = [];
    const done = [];
    for (const s of surveys) {
      (toTab(s) === "done" ? done : ongoing).push(s);
    }
    return { ongoing, done };
  }, [surveys]);

  const shown = tab === "ongoing" ? categorized.ongoing : categorized.done;
  const headerText = tab === "ongoing" ? "진행중인 설문" : "완료된 설문";

  const goDetail = (id) => {
    if (tab === "done") {
      navigate(`/survey/${id}`, { state: { mode: "result" } });
    } else {
      navigate(`/survey/${id}`);
    }
  };

  return (
    <Wrap>
      <TopBar>
        <TopBackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <FiChevronLeft />
        </TopBackBtn>
        <TopTitle>설문하기</TopTitle>
        <div style={{ width: 32 }} />
      </TopBar>

      <SectionTop>
        <Segmented>
          <SegBtn $active={tab === "ongoing"} onClick={() => setTab("ongoing")}>
            진행 중
          </SegBtn>
          <SegBtn $active={tab === "done"} onClick={() => setTab("done")}>
            완료
          </SegBtn>
        </Segmented>
      </SectionTop>

      <ListHeader>{headerText}</ListHeader>

      {loading && <div style={{ padding: 24, color: "#777" }}>불러오는 중…</div>}
      {err && <div style={{ padding: 24, color: "#c00" }}>{err}</div>}

      {!loading && !err && (
        <List>
          {shown.map((s, idx) => (
            <React.Fragment key={s.id}>
              <Item
                $disabled={false}
                onClick={() => goDetail(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goDetail(s.id);
                  }
                }}
              >
                <Title $disabled={false}>{s.title}</Title>
                <More
                  as="span"
                  $disabled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetail(s.id);
                  }}
                >
                  + 더보기
                </More>
              </Item>
              {idx !== shown.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {shown.length === 0 && (
            <div style={{ padding: 24, color: "#999" }}>표시할 설문이 없습니다.</div>
          )}
        </List>
      )}

      <button
        onClick={() => navigate("/write/admin")}
        style={{
          position: "fixed",
          left: "80%",
          transform: "translateX(-50%)",
          bottom: "100px",
          zIndex: 20,
          width: "110px",
          height: "44px",
          border: "none",
          borderRadius: "999px",
          background: "#2C917B",
          color: "#fff",
          fontWeight: 800,
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
      >
        설문 작성
      </button>
    </Wrap>
  );
}
