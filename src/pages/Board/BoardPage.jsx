import { useState, useEffect,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../../components/Board/SearchBar";
import CategoryButtons2 from "../../components/CategoryButton2";
import AdBanner from "../../components/Board/AdBanner";
import PostList from "../../components/Board/PostList";

// 상단 import는 기존 그대로

const BoardPage = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // "" = 전체
    const [selectedDong, setSelectedDong] = useState("");         // "" = 전체
    const [startDate, setStartDate] = useState("");               // "YYYY-MM-DD" 또는 ""
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
                setPosts(res.data);
            } catch (err) {
                console.error("게시글 불러오기 실패:", err);
            }
        };
        fetchPosts();
    }, []);

    // 소문자/공백 정규화
    const normalize = (v) =>
        (v ?? "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "); // 공백/줄바꿈 모두 일반 스페이스로


    // ISO/Date 모두 안전하게 YYYY-MM-DD 뽑기
    const toYMD = (d) => {
        try {
            return new Date(d).toISOString().slice(0, 10);
        } catch { return ""; }
    };

    // ✅ 검색/필터링 (백엔드 스키마에 맞춤)
    const filtered = useMemo(() => {
        const q = normalize(search);

        return posts.filter((p) => {
            console.log("제목:", p.title, "본문:", p.content);
            const matchCategory =
                !selectedCategory || normalize(p.category) === normalize(selectedCategory);

            const matchDong =
                !selectedDong || normalize(p.dong) === normalize(selectedDong);

            // 검색어: 제목/작성자/상세위치/카테고리/행정동 (본문 필드는 백엔드 스키마에 없음)
            const haystack = [
                p.title,
                p.content,
            ].map(normalize).join(" ");

            const matchSearch = !q || haystack.includes(q);

            // 날짜 범위: created_at 기준
            const created = toYMD(p.created_at);
            const afterStart = !startDate || created >= startDate;
            const beforeEnd = !endDate || created <= endDate;

            console.log({
                title: p.title,
                category: p.category,
                selectedCategory,
                matchCategory,
                dong: p.dong,
                selectedDong,
                matchDong,
                searchQuery: q,
                haystack,
                matchSearch,
                created,
                startDate,
                endDate,
                afterStart,
                beforeEnd
            });

            return matchCategory && matchDong && matchSearch && afterStart && beforeEnd;
        });
    }, [posts, selectedCategory, selectedDong, search, startDate, endDate]);

    // (선택) 날짜 역전 방지: 시작 > 종료이면 스왑
    useEffect(() => {
        if (startDate && endDate && startDate > endDate) {
            setStartDate(endDate);
            setEndDate(startDate);
        }
    }, [startDate, endDate]);

    return (
        <Page>
            <SearchBar value={search} onChange={setSearch} onSearch={() => { }} />

            <div style={{ marginTop: 0, marginBottom: 45 }}>
                <CategoryButtons2
                    selectedCategory={selectedCategory}
                    onClick={setSelectedCategory}
                />
            </div>

            <Filters>
                {/* 🔸 백엔드 스키마의 'dong' 값과 동일하게 옵션 구성 */}
                <Select value={selectedDong} onChange={(e) => setSelectedDong(e.target.value)}>
                    <option value="">전체</option>
                    <option value="장충동">장충동</option>
                    <option value="명동">명동</option>
                    <option value="광희동">광희동</option>
                    <option value="약수동">약수동</option>
                    <option value="을지로동">을지로동</option>
                    <option value="필동">필동</option>
                    <option value="회현동">회현동</option>
                    <option value="청구동">청구동</option>
                    <option value="신당동">신당동</option>
                    <option value="황학동">황학동</option>
                </Select>


                <Dates>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <span>~</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Dates>
            </Filters>

            <AdBanner />
            <PostList posts={filtered} />

            <WriteBtn onClick={() => navigate("/post")}>글쓰기</WriteBtn>
        </Page>
    );
};


export default BoardPage;

/* ---------- styled ---------- */
const Page = styled.div`
    margin-top: 0; /* 헤더 높이 고려 */
`;

const Filters = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 0 15px 8px 15px;
`;

const Select = styled.select`
    padding: 4px 6px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fff;
`;

const Dates = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    & > input {
        width: 100px;  
        height: 20px;       
        padding: 2px 4px;     
        font-size: 12px;      
        border-radius: 6px;   
        border: 1px solid #ddd;
    }
`;


const WriteBtn = styled.button`
    position: fixed;
    bottom: 90px;   /* 탭바 위쪽에 띄우기 */
    right: 20px;
    background: #2C917B;
    color: #fff;
    border: none;
    border-radius: 15px;
    padding: 10px 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);

    display: flex;
    align-items: center;
    gap: 8px;   /* 텍스트와 아이콘 간격 */

    &:hover {
        background: #89c7b9;
    }
`;