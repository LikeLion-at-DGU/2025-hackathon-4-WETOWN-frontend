import styled, { keyframes } from "styled-components";

/* 디자인 토큰 */
export const colors = {
  brand: "#178F81",
  brandDark: "#0a8a6f",
  bg: "#ffffff",
  muted: "#8a8f98",
  text: "#1b1d22",
  card: "#ffffff",
  line: "#e9edf1",
  green: "#20b26b",
  red: "#e05b5b",
};
export const shadow = "0 8px 16px rgba(0,0,0,0.08)";
export const radius = "16px";

/* 스켈레톤 애니메이션 */
const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

/* 레이아웃 */
export const HomeWrap = styled.main`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: ${colors.bg};
  padding: 0px 16px;
  box-sizing: border-box;
  min-height: 100dvh;

  @media (min-width: 431px) {
    border-left: 1px solid #f2f4f6;
    border-right: 1px solid #f2f4f6;
  }
`;

export const Section = styled.section`
  margin-top: 14px;
`;

/* --- (1) 검색 영역 --- */
export const SearchBar = styled.form`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid ${colors.line};
  border-radius: 999px;
  padding: 12px 12px 12px 14px;
  box-shadow: ${shadow};
`;

export const SearchIcon = styled.span`
  font-size: 20px;
  color: ${colors.muted};
  display: grid;
  place-items: center;

  /* react-icons 크기 보정 */
  svg { width: 1em; height: 1em; }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  color: ${colors.text};
  background: transparent;
  width: 100%;

  &::placeholder { color: #adb3ba; }
`;

export const SearchSubmit = styled.button`
  border: none;
  background: ${colors.brand};
  color: #fff;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;

  &:active { transform: translateY(1px); }
`;

/* 액션 버튼 (제보/설문) */
export const ActionButtons = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const ActionCard = styled.button`
  position: relative;
  background: ${colors.brand};
  color: #fff;
  border: none;
  border-radius: 18px;
  min-height: 110px;
  box-shadow: 0 8px 16px rgba(10,163,130,0.25);
  padding: 12px;
  cursor: pointer;
`;

export const ActionEmoji = styled.span`
  position: absolute;
  /* 중앙을 기준으로 살짝 왼쪽 위에 배치 */
  top: 45%;
  left: 22%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  line-height: 1;

  svg { width: 1em; height: 1em; }
`;

export const ActionText = styled.span`
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 16px;
  font-weight: 700;
`;

/* --- (2) 인기 글 --- */
export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 16px;
  color: ${colors.text};
  margin-bottom: 8px;
  margin-left: 5px;

  .hot { font-size: 18px; }
`;

export const PopularList = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radius};
  background: ${colors.card};
  box-shadow: ${shadow};
  overflow: hidden;
`;

export const PopularItem = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 14px 12px;
  border-bottom: 1px solid ${colors.line};

  &:last-child { border-bottom: none; }
`;

export const ItemTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  margin: 0 0 6px 0;
  letter-spacing: -0.2px;
  cursor: pointer;
`;

export const ItemMeta = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.muted};
  letter-spacing: -0.2px;
  cursor: pointer;
`;

export const ItemRight = styled.div`
  display: flex;        /* 좋아요/댓글 가로 배치 */
  align-items: center;
  gap: 12px;
  padding-left: 8px;
`;

export const Vote = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 13px;

  &.upvote { color: ${colors.green}; }
  &.comment { color: ${colors.red}; }
`;

export const Thumb = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;

  svg { width: 1em; height: 1em; }
`;

/* --- (3) 최근 뉴스 --- */
export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 8px;
`;

export const NewsCard = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: #cfd6dd;
  border: 1px solid ${colors.line};
  box-shadow: ${shadow};
  cursor: pointer;

  &.skeleton {
    position: relative;
    background: linear-gradient(90deg, #d8dee5 25%, #eef1f4 37%, #d8dee5 63%);
    background-size: 400% 100%;
    animation: ${shimmer} 1.2s infinite;
  }
`;

// --- (검색 제안 패널) ---
export const SearchWrap = styled.div`
  position: relative;  /* 패널을 입력창 바로 아래에 고정하기 위해 */
`;

export const SuggestPanel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 10px);   /* 검색창 아래 여백 */
  background: ${colors.card};
  border: 1px solid ${colors.line};
  border-radius: 14px;
  box-shadow: ${shadow};
  padding: 14px 14px 16px;
  z-index: 20;
`;

export const SuggestTitle = styled.div`
  font-size: 12px;
  color: ${colors.muted};
  margin-bottom: 10px;
`;

export const ChipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 10px; /* row col */
`;

export const Chip = styled.button`
  border: 1px solid ${colors.line};
  background: #E5E5E5;
  color: ${colors.text};
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 10px;
  text-align: center;

  &:active { transform: translateY(1px); }
`;
