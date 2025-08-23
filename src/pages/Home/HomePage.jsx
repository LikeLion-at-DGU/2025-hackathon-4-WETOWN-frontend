import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RiUserVoiceLine, RiMailOpenLine } from "react-icons/ri";
import { AiOutlineLike } from "react-icons/ai";
import { BiChat } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  HomeWrap, Section, SearchBar, SearchIcon, SearchInput, SearchSubmit,
  ActionButtons, ActionCard, ActionEmoji, ActionText, SectionTitle,
  PopularList, PopularItem, ItemTitle, ItemMeta, ItemRight, Vote, Thumb,
  NewsGrid, NewsCard, SearchWrap, SuggestPanel, SuggestTitle, ChipGrid, Chip,
} from "./styled";

const API_BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

export default function HomePage() {
  const navigate = useNavigate();

  // 데이터 상태
  const [popularPosts, setPopularPosts] = useState([]);
  const [newsList, setNewsList] = useState([]);

  // 섹션별 로딩/에러
  const [loading, setLoading] = useState({ posts: true, news: true });
  const [error, setError] = useState({ posts: "", news: "" });

  useEffect(() => {
    const ctrl = new AbortController();

    const loadPosts = async () => {
      try {
        setLoading((s) => ({ ...s, posts: true }));
        setError((e) => ({ ...e, posts: "" }));
        const res = await fetch(`${API_BASE}/posts/top-liked`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`인기 글 요청 실패 (${res.status})`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.results ?? [];
        setPopularPosts(arr.slice(0, 4));
      } catch (e) {
        // HMR 등으로 생기는 AbortError는 무시
        if (e?.name !== "AbortError") {
          setError((prev) => ({ ...prev, posts: e.message || "인기 글 불러오기 실패" }));
        }
      } finally {
        setLoading((s) => ({ ...s, posts: false }));
      }
    };

    const loadNews = async () => {
      try {
        setLoading((s) => ({ ...s, news: true }));
        setError((e) => ({ ...e, news: "" }));
        const res = await fetch(`${API_BASE}/news/latest-three`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`뉴스 요청 실패 (${res.status})`);
        const data = await res.json(); // [{ id, title, image_url, source_url, ... }]
        setNewsList(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setError((prev) => ({ ...prev, news: e.message || "뉴스 불러오기 실패" }));
        }
      } finally {
        setLoading((s) => ({ ...s, news: false }));
      }
    };

    // 병렬 로드
    loadPosts();
    loadNews();

    return () => ctrl.abort();
  }, []);

  // 검색/추천
  const [query, setQuery] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const blurTimer = useRef(null);

  const trending = ["가로등", "민생지원금", "음식물 쓰레기", "지역행정", "놀이터"];

  const handleReport = () => navigate("/post");
  const handleSurvey = () => navigate("/survey");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const onFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setOpenSuggest(true);
  };
  const onBlur = () => {
    blurTimer.current = setTimeout(() => setOpenSuggest(false), 120);
  };
  const onChipClick = (text) => {
    setQuery(text);
    setOpenSuggest(false);
  };

  return (
    <HomeWrap>
      {/* 1) 검색 & 액션 버튼 */}
      <Section>
        <SearchWrap>
          <SearchBar as="form" onSubmit={handleSearch}>
            <SearchIcon aria-hidden><FiSearch /></SearchIcon>
            <SearchInput
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="'충무로 민원'을 검색해보세요"
              aria-label="민원 검색"
            />
            <SearchSubmit type="submit" aria-label="검색">검색</SearchSubmit>
          </SearchBar>

          {openSuggest && (
            <SuggestPanel onMouseDown={(e) => e.preventDefault()}>
              <SuggestTitle>실시간 인기검색어</SuggestTitle>
              <ChipGrid>
                {trending.map((t, i) => (
                  <Chip key={i} type="button" onClick={() => onChipClick(t)}>#{t}</Chip>
                ))}
              </ChipGrid>
            </SuggestPanel>
          )}
        </SearchWrap>

        <ActionButtons>
          <ActionCard onClick={handleReport}>
            <ActionEmoji aria-hidden><RiUserVoiceLine /></ActionEmoji>
            <ActionText>제보하기</ActionText>
          </ActionCard>
          <ActionCard onClick={handleSurvey}>
            <ActionEmoji aria-hidden><RiMailOpenLine /></ActionEmoji>
            <ActionText>설문하기</ActionText>
          </ActionCard>
        </ActionButtons>
      </Section>

      {/* 2) 인기 글 */}
      <Section>
        <SectionTitle>
          <span>인기 글</span><span className="hot" aria-hidden>🔥</span>
        </SectionTitle>

        <PopularList>
          {(loading.posts ? Array.from({ length: 4 }) : popularPosts).map((post, idx) => {
            if (loading.posts) {
              return (
                <PopularItem key={idx} className="skeleton">
                  <div><ItemTitle>&nbsp;</ItemTitle><ItemMeta>&nbsp;</ItemMeta></div>
                  <ItemRight />
                </PopularItem>
              );
            }

            const title = post?.title ?? "";
            const category = post?.category ?? post?.tag ?? "";
            const location = post?.location ?? post?.area ?? "";
            const date = post?.date ?? (post?.created_at?.slice(0, 10) ?? "");
            const up = post?.up ?? post?.likes ?? 0;
            const down = post?.down ?? post?.comments ?? 0;

            return (
              <PopularItem key={post.id ?? idx}>
                <div>
                  <ItemTitle>“ {title} ”</ItemTitle>
                  <ItemMeta>[{category}] · {location} · {date}</ItemMeta>
                </div>
                <ItemRight>
                  <Vote className="upvote"><Thumb aria-hidden><AiOutlineLike /></Thumb><span className="count">{up}</span></Vote>
                  <Vote className="comment"><Thumb aria-hidden><BiChat /></Thumb><span className="count">{down}</span></Vote>
                </ItemRight>
              </PopularItem>
            );
          })}
        </PopularList>
        {error.posts && (
          <div style={{ color: "#d00", marginTop: 8, fontSize: 12 }}>{error.posts}</div>
        )}
      </Section>

      {/* 3) 최근 뉴스 */}
      <Section>
        <SectionTitle>최근 뉴스</SectionTitle>
        <NewsGrid>
          {loading.news
            ? [1, 2, 3].map((n) => <NewsCard className="skeleton" key={n} />)
            : newsList.map((n, i) => {
                const id = n?.id ?? i;
                const title = n?.title ?? n?.short_title ?? "";
                const img = n?.image_url ?? "";
                const url = n?.source_url ?? "#";
                return (
                  <NewsCard key={id}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {img && (
                        <img
                          src={img}
                          alt={title}
                          style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }}
                        />
                      )}
                      <div style={{ marginTop: 8 }}>
                        <div className="line-clamp-2" style={{ fontWeight: 600 }}>{title}</div>
                        {n?.source_name && (
                          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{n.source_name}</p>
                        )}
                      </div>
                    </a>
                  </NewsCard>
                );
              })}
        </NewsGrid>
        {error.news && (
          <div style={{ color: "#d00", marginTop: 8, fontSize: 12 }}>{error.news}</div>
        )}
      </Section>
    </HomeWrap>
  );
}
