// src/layouts/RootLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Splash from "../components/Splash/Splash";

import BottomNav from "../components/BottomNav/BottomNav";
import Header from "../components/Header/Header";

export default function RootLayout() {
  // 탭(세션)에서 아직 스플래시를 안 봤으면 true

  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen")
  );


  // 스플래시 종료 시 1회 표시 완료로 기록

  const handleDone = useCallback(() => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  }, []);

  return (
    <>
      {/* 스플래시 오버레이 (2초 뒤 onDone 호출) */}
      {showSplash && <Splash onDone={handleDone} />}

      {/* 스플래시가 끝난 후에만 헤더 노출 */}
      {!showSplash && <Header />}

      {/* 페이지 콘텐츠는 항상 렌더 (옵션 B) */}
      <Outlet />

      {/* 스플래시가 끝난 후에만 네비 노출 */}
      {!showSplash && <BottomNav />}
    </>
  );

}

