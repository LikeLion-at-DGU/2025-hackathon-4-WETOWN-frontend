import styled from "styled-components";

const BRAND = "#00B890";
const LINE = "#E9EDF1";
const TEXT = "#1B1D22";

export const Wrap = styled.main`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 12px 16px;
  padding-top: 70px;     /* 공통 헤더 */
  padding-bottom: 92px;  /* 하단 네비 */
  background: #fff;
  min-height: 100dvh;

  @media (min-width: 431px) {
    border-left: 1px solid #f2f4f6;
    border-right: 1px solid #f2f4f6;
  }
`;

export const Section = styled.section`
  display: grid;
  gap: 14px;
`;

export const LabelRow = styled.h3`
  margin: 6px 0 6px;
  font-size: 14px;
  color: ${TEXT};
  font-weight: 800;
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
`;

export const Chip = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  background: ${({ $active }) => ($active ? BRAND : "#F4F6F8")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  box-shadow: ${({ $active }) => ($active ? "0 6px 12px rgba(0,184,144,.25)" : "0 2px 6px rgba(0,0,0,.08)")};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
`;

export const SubNote = styled.div``;

export const AddressInput = styled.input`
  width: 93%;
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: #fff;
  &::placeholder { color: #a8afb7; }
`;

export const MapBox = styled.div`
  position: relative;
  height: 180px;
  border: 1px solid ${LINE};
  border-radius: 8px;
  background: #cfcfcf;
  overflow: hidden;

  .cross {
    position: absolute; inset: 0;
    background:
      linear-gradient( to bottom right, transparent 49%, rgba(0,0,0,.08) 50%, transparent 51% ),
      linear-gradient( to top right,    transparent 49%, rgba(0,0,0,.08) 50%, transparent 51% );
  }

  .addr{
    position: absolute;
    left: 8px; bottom: 8px;
    background: rgba(255,255,255,.9);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
  }
`;

export const MapPin = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  width: 32px; height: 32px;
  border-radius: 50%;
  display: grid; place-items: center;
  color: #fff; background: ${BRAND};
  box-shadow: 0 4px 10px rgba(0,0,0,.2);
  svg{ width: 18px; height: 18px; }
`;

export const NextFab = styled.button`
  position: fixed;
  right: calc(50% - 215px + 16px);
  bottom: calc(92px + 16px);
  width: 54px; height: 54px;
  border-radius: 50%;
  border: none;
  background: ${BRAND};
  color: #fff;
  display: grid; place-items: center;
  box-shadow: 0 8px 16px rgba(0,184,144,.3);
  cursor: pointer;
  transition: transform .06s ease, opacity .2s ease;

  &:active{ transform: translateY(1px); }
  &:disabled{ opacity: .4; cursor: not-allowed; }

  @media (max-width: 430px){
    right: 16px; /* 모바일에서 안전 위치 */
  }

  svg{ width: 26px; height: 26px; }
`;

/* ---------- 작성(step2) ---------- */
export const Field = styled.div`
  display: grid; gap: 8px;
  label{ font-size: 13px; font-weight: 800; color: ${TEXT}; }
  label .muted{ font-weight: 700; color: #888; }
`;

export const Input = styled.input`
  width: 93%;
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: #fff;
  &::placeholder { color: #a8afb7; }
`;

export const TextArea = styled.textarea`
  width: 93%;
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  background: #f6f8fa;
  resize: vertical;
  &::placeholder { color: #c2c7cd; }
`;

export const DangerNote = styled.span`
  margin: 0;
  color: red;
  font-size: 12px;
  font-weight: 700;
`;

export const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

export const UploadSlot = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 6px;
  border: 1px solid ${LINE};
  background: #e9edf1;
  overflow: hidden;
  display: grid;
  place-items: center;
  cursor: pointer;

  img{
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
`;

export const CameraBadge = styled.div`
  display: grid; place-items: center;
  color: ${BRAND};
  svg{ width: 24px; height: 24px; }
  span{ margin-top: 4px; font-size: 12px; color: #6b7280; }
`;

export const SuggestTitle = styled.h4`
  margin: 8px 0 4px;
  font-size: 13px; color: ${TEXT}; font-weight: 800;
`;

export const SuggestChips = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px 12px;
`;

export const SuggestChip = styled.button`
  border: none; background: #f4f6f8; color: #333;
  font-weight: 700; font-size: 13px;
  border-radius: 999px; padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
  cursor: pointer;
`;

export const RegisterBtn = styled.button`
  margin: 18px 0 0 auto;
  width: 120px; height: 44px;
  border: none; border-radius: 12px;
  background: ${BRAND}; color: #fff;
  font-weight: 800; font-size: 15px;
  box-shadow: 0 8px 16px rgba(0,184,144,.25);
  cursor: pointer;
  transition: transform .06s ease;
  &:active{ transform: translateY(1px); }
`;

/* ---------- 완료(step3) ---------- */
export const DoneWrap = styled.div`
  height: calc(100dvh - 70px - 92px);
  display: flex; 
  flex-direction: column;
  align-items: center;
  margin-top: 40%;
  text-align: center;
  gap: 12px; /* 아이콘과 텍스트 사이 간격 */
`;


export const DoneIcon = styled.div`
  position: relative;
  width: 180px; height: 180px; margin: 0 auto;
  display: grid; place-items: center;

  &::before {
    content: "";
    position: absolute; inset: 0; margin: auto;
    width: 160px; height: 160px; border-radius: 50%;
    background:
      radial-gradient(70px 70px at 50% 50%, rgba(0,184,144,.45), transparent 95%),
      radial-gradient(120px 120px at 50% 50%, rgba(0,184,144,.20), transparent 80%);
    filter: blur(.2px);
  }

  img {
    width: 100px; /* 필요시 조절 */
    height: auto;
  }
`;


export const DoneText = styled.p`
  margin: 0; color: ${TEXT};
  font-weight: 700; line-height: 1.6;
`;

// 작성 화면 상단의 인라인 뒤로가기 바
export const TopInline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid white;
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;

  svg { width: 18px; height: 18px; color: ${TEXT}; }
`;


// 작성된 글 보기 버튼
export const ViewPostBtn = styled.button`
  margin-top: 12px;
  padding: 0 18px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: #00B890;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  display: inline-grid;
  place-items: center;
  box-shadow: 0 8px 16px rgba(0, 184, 144, 0.25);
  cursor: pointer;
  transition: transform .05s ease;

  &:active { transform: translateY(1px); }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;


