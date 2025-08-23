// src/layouts/RootLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Splash from "../components/Splash/Splash";

import BottomNav from "../components/BottomNav/BottomNav";
import Header from "../components/Header/Header";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen")
  );

  const handleDone = useCallback(() => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  }, []);

  return (
    <Layout>
      {/* 스플래시 오버레이 */}
      {showSplash && <Splash onDone={handleDone} />}

      {/* 스플래시 끝난 뒤에만 헤더 & 네비 노출 */}
      {!showSplash && <Header />}

      <Content>
        <Outlet />  {/* 여기서 각 페이지가 바뀌면서 렌더링 */}
      </Content>

      {!showSplash && <BottomNav />}
    </Layout>
  );
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
