// src/pages/SurveyPage.jsx
import React, { useState } from "react";
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

const SurveyPage = () => {
    const navigate = useNavigate();
  // 기본값: 진행중
  const [tab, setTab] = useState("ongoing"); // 'ongoing' | 'done'
  // 상세 이동 함수 (탭에 따라 mode 달리)
  const goDetail = (id) => {
    if (tab === "done") {
      // 완료 탭 -> 결과 모드로 열기
      navigate(`/survey/${id}`, { state: { mode: "result" } });
    } else {
      // 진행중 탭 -> 기본(투표) 모드
      navigate(`/survey/${id}`);
    }
  };
  // 데모 데이터
  const ongoing = [
    { id: 1, title: "지역 주민 모임 지원 제도 개편" },
    { id: 2, title: "우리 동네 생활환경 만족도 조사" },
    { id: 3, title: "설문조사 제목" },
    { id: 4, title: "설문조사 제목" },
    { id: 5, title: "설문조사 제목" },
  ];

  const done = [
    { id: 101, title: "지역 주민 모임 지원 제도 개편" },
    { id: 102, title: "설문조사 제목" },
    { id: 103, title: "설문조사 제목" },
    { id: 104, title: "설문조사 제목" },
  ];

  // 현재 탭에 따라 표시할 목록/헤더 결정
  const shown = tab === "ongoing" ? ongoing : done;
  const headerText = tab === "ongoing" ? "진행중인 설문" : "완료된 설문";

  return (
    <Wrap>
        {/* 페이지 상단 바 */}
      <TopBar>
        <TopBackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <FiChevronLeft />
        </TopBackBtn>
        <TopTitle>설문하기</TopTitle>
        <div style={{ width: 32 }} />
      </TopBar>
      {/* 상단 토글 */}
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

      {/* 현재 탭 제목 */}
      <ListHeader>{headerText}</ListHeader>

      {/* 현재 탭 목록만 표시 */}
      <List>
      {shown.map((s, idx) => (
        <React.Fragment key={s.id}>
          <Item
            $disabled={false}                     // ✅ 완료 탭에서도 클릭 가능
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
                + 더보기</More>
            </Item>
            {idx !== shown.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {/* 플로팅: 설문 작성 */}
      <button
        onClick={() => navigate("/write/admin")}
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "200px",          // 하단 탭과 겹치지 않게
          zIndex: 20,
          width: "140px",
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
};

export default SurveyPage;
