import styled, { keyframes } from "styled-components";


/* --brand: 메인 민트/그린, --text: 회색 본문 */
const brand = "#2FA99B";
const text = "#666";

const fadeOut = keyframes`
  0%   { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
`;

export const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;

  /* 2초 뒤 사라지는 효과 */

  animation: ${fadeOut} 2s ease-out forwards;

  /* 스플래시 동안 뒤 콘텐츠 클릭 방지 */
  pointer-events: auto;
`;

export const Logo = styled.img`
  width: min(220px, 60vw);
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
`;

export const TextWrap = styled.div`
  text-align: center;
  line-height: 1.25;
`;

export const Line1 = styled.p`
  margin: 0;
  color: ${text};
  font-size: 18px;
  font-weight: 600;
`;

export const Line2 = styled.p`
  margin: 8px 0 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: ${brand};
`;
