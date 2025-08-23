// src/pages/DetailPage/DetailPage.styled.js
import styled from "styled-components";

export const Wrap = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding-bottom: 96px;
  background:rgb(255, 255, 255);
  min-height: 100vh;
`;

export const Header = styled.div`
  position: sticky;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0;
  background:rgb(255, 255, 255);
  color: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
`;

export const BackBtn = styled.button`
  border: 0;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

export const Brand = styled.div`
  font-weight: 700;
  letter-spacing: 0.5px;
`;

export const Card = styled.div`
  position: relative;
  background: #fff;
  margin: 8px 12px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const AuthorRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 14px 4px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e7f2ed;
  border: 1px solid #d7e9e2;
`;

export const Author = styled.div`
  font-weight: 600;
  color: #2b2b2b;
`;

export const DateText = styled.div`
  font-size: 12px;
  color: #7c7c7c;
  margin-top: 2px;
`;

export const TitleBox = styled.div`
  padding: 8px 14px 12px;
  border-bottom: 1px solid #f0f0f0;
`;

export const Chip = styled.span`
  display: inline-block;
  font-size: 12px;
  color: #3e6e5a;
  background: #eaf6f1;
  border-radius: 6px;
  padding: 3px 8px;
  margin-bottom: 6px;
`;

export const Title = styled.h1`
  font-size: 18px;
  line-height: 1.4;
  margin: 6px 0 8px;
  color: #1f1f1f;
`;

export const BodyText = styled.p`
  color: #444;
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 4px 0 10px;
`;

export const ImageBox = styled.div`
  width: 100%;
  background: #fafafa;

  img {
    width: 100%;
    display: block;
  }
`;

export const ImagePlaceholder = styled.div`
  height: 220px;
  margin: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: repeating-linear-gradient(
    135deg,
    #f5f5f5,
    #f5f5f5 12px,
    #f0f0f0 12px,
    #f0f0f0 24px
  );
`;

export const MetaBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fff;
`;

export const MetaLeft = styled.div`
  display: flex;
  gap: 14px;
`;

export const MetaRight = styled.div``;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;

  ${(p) => p.highlight && `
    color: #2aa36a;
    font-weight: 700;
  `}

  svg {
    position: relative;
    top: -0.5px;
  }
`;

export const IconBtn = styled.button`
  border: 0;
  background: transparent;
  color: #333;
  cursor: pointer;
  padding: 4px;
`;

export const CommentsWrap = styled.div`
  margin: 8px 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CommentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f3f3;
`;

export const No = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const Bubble = styled.div`
  flex: 1;
  font-size: 14px;
  color: #333;
`;



export const CommentBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 90px;
  max-width: 420px;
  margin: 0 auto 0;
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: #f7f7f7;
  border-top: 1px solid #e8e8e8;
  z-index: 1000;
`;

export const Input = styled.input`
  flex: 1;
  height: 42px;
  border: 0;
  border-radius: 10px;
  background: #ffffff;
  padding: 0 12px;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) inset;

  &:focus {
    outline: 2px solid #cfe9df;
  }
`;

export const SendBtn = styled.button`
  width: 44px;
  height: 42px;
  border: 0;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #57b08a;
  color: #fff;
`;

export const Loading = styled.div`
  padding: 80px 0;
  text-align: center;
  color: #777;
`;


