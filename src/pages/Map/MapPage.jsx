// src/pages/Map/MapPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryButtons from "../../components/CategoryButton";
import KakaoMap from "../../components/KakaoMap";
import SearchBar from "../../components/Board/SearchBar";
import { getPosts } from "../../apis/posts";
import styled from "styled-components";

const MapPage = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // ✅ 마커 클릭한 글


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                console.error("글 불러오기 실패:", err);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {/* 지도 */}
            <KakaoMap posts={posts} onMarkerClick={setSelectedPost} />

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
                    onSearch={() => console.log("검색:", search)}
                />
            </div>

            {/* 카테고리 버튼 */}
            <CategoryButtons
                selectedCategory={selectedCategory}
                onClick={setSelectedCategory}
            />

            {/* ✅ 마커 클릭 시 하단 카드 띄우기 */}
            {selectedPost && (
                <BottomCard>
                    <div className="meta">
                        <strong>{selectedPost.category}</strong>
                        <span>
                            {new Date(selectedPost.created_at).toLocaleDateString()}
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
  bottom: 150px; /* 하단 탭바 위로 띄움 */
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