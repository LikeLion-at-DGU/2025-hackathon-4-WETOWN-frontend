// src/layouts/RootLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Splash from "../components/Splash/Splash";
import BottomNav from "../components/BottomNav/BottomNav";
import Header from "../components/Header/Header";
import { CommentProvider, useCommentContext } from "../components/Board/CommentContext";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen")
  );

  const handleDone = useCallback(() => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  }, []);

  return (
    <CommentProvider>
      <Layout>
        {/* ✅ 스플래시 */}
        {showSplash && <Splash onDone={handleDone} />}

        {/* ✅ 스플래시 끝난 뒤에만 헤더 & 네비 */}
        {!showSplash && <Header />}

        <Content>
          <Outlet />
        </Content>

        {/* ✅ BottomNav는 별도 컴포넌트로 분리해서 Context 안에서 제어 */}
        <BottomNavWrapper showSplash={showSplash} />
      </Layout>
    </CommentProvider>
  );
}

/* ---------- BottomNav 제어용 ---------- */
function BottomNavWrapper({ showSplash }) {
  const { showCommentInput } = useCommentContext();

  if (showSplash) return null;           // 스플래시 중이면 숨김
  if (showCommentInput) return null;     // 댓글 입력창 열리면 숨김
  return <BottomNav />;
}

/* ---------- styled ---------- */
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;

  /* Header / BottomNav 높이만큼 여백 */
  padding-top: 70px;
  padding-bottom: 92px;
`;
