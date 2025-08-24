import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryButtons from "../../components/CategoryButton";
import KakaoMap from "../../components/KakaoMap";
import SearchBar from "../../components/Board/SearchBar";
import { getPosts } from "../../apis/posts";
import styled from "styled-components";

const MapPage = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(null); // null = 미선택
    const [search, setSearch] = useState(""); // "" = 미입력
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // 마커 클릭 글

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data || []);
            } catch (err) {
                console.error("글 불러오기 실패:", err);
            }
        };
        fetchPosts();
    }, []);

    // 🔎 조합별 필터링
    const filteredPosts = useMemo(() => {
        const q = (search || "").trim().toLowerCase();
        const hasQuery = q.length > 0;
        const hasCategory = !!selectedCategory;

        // 0) 검색X & 카테고리X → 초기/비어있음: 마커 표시 안 함
        if (!hasQuery && !hasCategory) return [];

        return (posts || []).filter((p) => {
            const inCategory = hasCategory ? p.category === selectedCategory : true;

            const haystack = [
                p.title,
                p.content,
                p.address,  // 백엔드에 따라 address/location 중 실제 필드 사용
                p.location,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const inSearch = hasQuery ? haystack.includes(q) : true;

            // 1) 검색만: inSearch && (카테고리 무시)
            // 2) 카테고리만: inCategory && (검색 무시)
            // 3) 둘 다: inSearch && inCategory
            return inCategory && inSearch;
        });
    }, [posts, selectedCategory, search]);

    return (
        <div style={{ position: "relative", maxWidth: "420px", height: "100vh", margin: "0 auto"  }}>
            {/* 지도 - 필터링된 글만 마커로 */}
            <KakaoMap posts={filteredPosts} onMarkerClick={setSelectedPost} />

            {/* 검색창 */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "95%",
                    zIndex: 10,
                }}
            >
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onSearch={() => {/* 엔터/버튼 동작시 필요하면 유지 */ }}
                    placeholder="제목/내용/주소로 검색"
                />
            </div>

            {/* 카테고리 버튼 */}
            <CategoryButtons
                selectedCategory={selectedCategory}
                onClick={setSelectedCategory}
            />

            {/* 마커 클릭 시 하단 카드 */}
            {selectedPost && (
                <BottomCard>
                    <div className="meta">
                        <strong>{selectedPost.category}</strong>
                        <span>
                            {selectedPost.created_at
                                ? new Date(selectedPost.created_at).toLocaleDateString()
                                : ""}
                        </span>
                    </div>
                    <div className="meta2">
                        <div className="title">"{selectedPost.title}"</div>
                        <button onClick={() => navigate(`/detail/${selectedPost.id}`)}>
                            전체 글 보기
                        </button>
                    </div>
                </BottomCard>
            )}
        </div>
    );
};

export default MapPage;

/* ---------- styled ---------- */
const BottomCard = styled.div`
  position: absolute;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  padding: 14px;
  z-index: 20;

  .meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .meta2 {
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 13px;
    color: #333;
    margin-bottom: 4px;
  }

  button {
    background: #63b38f;
    border: none;
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
  }
`;
