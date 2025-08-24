import { useState, useEffect, useMemo } from "react";
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

            <WriteBtn onClick={() => navigate("/post")}>
                글쓰기
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7761 2.63333C16.3073 2.16466 15.6715 1.90137 15.0086 1.90137C14.3457 1.90137 13.7099 2.16466 13.2411 2.63333L12.6519 3.22333L16.7769 7.34833L17.3653 6.75917C17.5975 6.52701 17.7816 6.2514 17.9073 5.94806C18.033 5.64471 18.0976 5.31959 18.0976 4.99125C18.0976 4.66291 18.033 4.33779 17.9073 4.03444C17.7816 3.7311 17.5975 3.45549 17.3653 3.22333L16.7761 2.63333ZM15.5978 8.52667L11.4728 4.40167L3.89777 11.9775C3.732 12.1433 3.6162 12.3524 3.5636 12.5808L2.7061 16.2933C2.67415 16.4312 2.67781 16.5748 2.71675 16.7109C2.75568 16.8469 2.82861 16.9707 2.92865 17.0708C3.02869 17.1708 3.15255 17.2437 3.28857 17.2827C3.42459 17.3216 3.56827 17.3253 3.7061 17.2933L7.41943 16.4367C7.6476 16.3839 7.85637 16.2681 8.02193 16.1025L15.5978 8.52667Z" fill="white"/>
                </svg>
            </WriteBtn>
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
    height: 30px;
    padding: 0 8px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 13px;
    color: #333;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: border 0.2s, box-shadow 0.2s;

    &:hover {
        border-color: #aaa;
    }

    &:focus {
        outline: none;
        border-color: #2C917B;
        box-shadow: 0 0 0 3px rgba(44,145,123,0.15);
    }
`;



const Dates = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;

    & > input {
        width: 86px;
        height: 30px;
        padding: 0 10px;
        font-size: 13px;
        border-radius: 10px;
        border: 1px solid #ccc;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: border .2s, box-shadow .2s;

        &:hover {
            border-color: #aaa;
        }
        &:focus {
            outline: none;
            border-color: #2C917B;
            box-shadow: 0 0 0 3px rgba(44,145,123,.15);
        }

        &::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.7;
        }
    }

    & > span {
        color: #666;
        font-size: 14px;
        margin: 0 4px;
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