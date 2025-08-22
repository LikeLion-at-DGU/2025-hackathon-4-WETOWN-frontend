// src/layouts/RootLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Splash from "../components/Splash/Splash";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";

export default function RootLayout() {
  // 세션(탭)당 1회만 스플래시 노출
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen")
  );

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
