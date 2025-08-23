import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../../components/Board/SearchBar";
import CategoryButtons2 from "../../components/CategoryButton2";
import AdBanner from "../../components/Board/AdBanner";
import PostList from "../../components/Board/PostList";

const BoardPage = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDong, setSelectedDong] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    // 백엔드에서 글 목록 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
                console.log("불러온 데이터:", res.data);
                setPosts(res.data); 
            } catch (err) {
                console.error("게시글 불러오기 실패:", err);
            }
        };
        fetchPosts();
    }, []);

    // 검색/필터링
    const filtered = posts.filter((p) => {
        const matchCategory = !selectedCategory || p.category === selectedCategory;
        const q = search.trim();
        const matchSearch =
            !q ||
            p.title.includes(q) ||
            p.content.includes(q) ||
            p.dong.includes(q) ||
            p.category.includes(q);
        const matchDong = !selectedDong || p.dong === selectedDong;

        const created = new Date(p.created_at).toISOString().slice(0, 10);
        const afterStart = !startDate || created >= startDate;
        const beforeEnd = !endDate || created <= endDate;

        return matchCategory && matchSearch && matchDong && afterStart && beforeEnd;
    });

    return (
        <Page>
            <SearchBar value={search} onChange={setSearch} onSearch={() => {}} />

            <div style={{ marginTop: "0px", marginBottom: "45px" }}>
                <CategoryButtons2
                    selectedCategory={selectedCategory}
                    onClick={setSelectedCategory}
                />
            </div>

            <Filters>
                <Select value={selectedDong} onChange={(e) => setSelectedDong(e.target.value)}>
                    <option value="">전체</option>
                    <option value="광희동">광희동</option>
                    <option value="다산동">다산동</option>
                    <option value="신당동">신당동</option>
                    <option value="약수동">약수동</option>
                    <option value="을지로동">을지로동</option>
                    <option value="황학동">황학동</option>
                    <option value="정릉3동">정릉3동</option>
                </Select>

                <Dates>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <span>~</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Dates>
            </Filters>

            <AdBanner />

            {/* 🔥 실제 데이터로 바뀐 PostList */}
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