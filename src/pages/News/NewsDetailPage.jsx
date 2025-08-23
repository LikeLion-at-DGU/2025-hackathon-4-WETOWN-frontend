import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNewsDetail } from "../../hooks/News/useNewsDetail";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShare2 } from "react-icons/fi";


export default function NewsDetailPage() {
    const { id } = useParams();
    const { news, loading } = useNewsDetail(id);
    const navigate = useNavigate();

    if (loading) return <p>불러오는 중...</p>;
    if (!news) return <p>뉴스를 찾을 수 없습니다.</p>;

    return (
    <Wrap>
        <Header>
            <Back onClick={() => navigate("/news")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L13 19L14.4 17.5L7 10L14.4 2.5L13 1L4 10Z" fill="black"/>
                </svg>
            </Back>
            <Brand>WE:TOWN</Brand>
            <IconBtn><FiShare2 /></IconBtn>
        </Header>

        <Card>
        {news.image_url ? (
            <Hero>
            <img src={news.image_url} alt={news.title} />
            </Hero>
        ) : (
            <HeroPlaceholder />
        )}

        <MetaTop>
            <Source>{news.author}</Source>
            <DateText>{formatDate(news.created_at)}</DateText>
        </MetaTop>

        <Title>{news.title}</Title>

        <Body dangerouslySetInnerHTML={{ __html: nl2br(news.summary) }} />

        {news.source_url && (
            <SourceLink href={news.source_url} target="_blank">자세히 보기</SourceLink>
        )}
        </Card>
    </Wrap>
    );

}

/* ---------- utils ---------- */
function formatDate(d) {
    if (!d) return "";
    const x = new Date(d);
    if (isNaN(x)) return "";
    const y = x.getFullYear();
    const m = `${x.getMonth() + 1}`.padStart(2, "0");
    const day = `${x.getDate()}`.padStart(2, "0");
    return `${y}. ${m}. ${day}.`;
}
function nl2br(text) {
    // 백엔드가 plain text면 줄바꿈 처리, 이미 HTML이면 그대로 사용
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);
    return isHtml ? text : text.replace(/\n/g, "<br/>");
}

/* ---------- styles ---------- */

const Wrap = styled.div`
  max-width: 420px;
  margin: 0 auto;
  background: #f7f7f7;
  min-height: 100vh;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
  background: #ffffff;
  color: #fff;
`;

const Back = styled.button`
  border: 0;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
`;

const Brand = styled.div`
  font-weight: 700;
  font-size: 20px;
  flex:1;
  color: #000000;
`;

const IconBtn = styled.button`
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #000000;
  font-size: 20px;
  cursor: pointer;
`;

const Card = styled.div`
  background: #fff;
  margin: 10px 12px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .05);
  padding: 12px 12px 16px;
`;

const MetaTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6b7280;
  font-size: 12px;
`;

const Source = styled.div``;

const DateText = styled.div``;

const Title = styled.h1`
  margin: 8px 0 10px;
  font-size: 18px;
  line-height: 1.4;
  color: #1f1f1f;
`;

const Hero = styled.div`
  margin: 0 -12px 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fafafa;

  img {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }
`;

const HeroPlaceholder = styled.div`
  height: 200px;
  margin: 0 -12px 10px;
  background: repeating-linear-gradient(
    135deg,
    #f4f4f4,
    #f4f4f4 12px,
    #eee 12px,
    #eee 24px
  );
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const Body = styled.div`
  color: #333;
  line-height: 1.7;
  font-size: 14px;
`;

const SourceLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
`;

const Loading = styled.div`
  padding: 80px 0;
  text-align: center;
  color: #777;
`;
