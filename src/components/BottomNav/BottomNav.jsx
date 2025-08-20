import * as S from "./styled";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingMapButton from "./FloatingMapButton";
import { FaHome, FaComments, FaNewspaper, FaRobot } from "react-icons/fa";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <S.NavWrapper>
        <S.NavItem $active={currentPath === "/"} onClick={() => navigate("/")}>
          <FaHome size={20} />
          <span>홈</span>
        </S.NavItem>

        <S.NavItem
          $active={currentPath === "/news"}
          onClick={() => navigate("/news")}
        >
          <FaNewspaper size={20} />
          <span>뉴스</span>
        </S.NavItem>

        <div style={{ width: "64px" }} /> {/* 중앙 버튼 자리 */}

        <S.NavItem
          $active={currentPath === "/board"}
          onClick={() => navigate("/board")}
        >
          <FaComments size={20} />
          <span>게시판</span>
        </S.NavItem>

        <S.NavItem
          $active={currentPath === "/robot"}
          onClick={() => navigate("/robot")}
        >
          <FaRobot size={20} />
          <span>챗봇</span>
        </S.NavItem>
      </S.NavWrapper>

      <FloatingMapButton />
    </>
  );
};

export default BottomNav;
