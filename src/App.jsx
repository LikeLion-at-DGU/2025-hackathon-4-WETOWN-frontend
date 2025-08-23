import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import styled from "styled-components";


const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1; 
  overflow-y: auto;     /* 내용만 스크롤 */
  padding-top: 70px;    /* Header 높이만큼 띄우기 */
  padding-bottom: 92px; /* BottomNav 높이만큼 띄우기 */
`;


const App = () => {
  return (
    <Layout>
      <Header />
      <Content>
        <Outlet />   {/* 여기에 BoardPage, DetailPage 같은게 바뀌어 렌더링 */}
      </Content>
      <BottomNav />
    </Layout>
  );
};

export default App;
