import { useState } from "react";
import styled from "styled-components";
import SearchBar from "../../components/Board/SearchBar";
import CategoryButtons2 from "../../components/CategoryButton2";
import AdBanner from "../../components/Board/AdBanner";
import PostList from "../../components/Board/PostList";
// 정적 목데이터 (UI 확인용)
const MOCK_POSTS = [
    {
        id: 1,
        writer: "홍길동",
        title: "정릉3동 가로등 고장",
        content: "밤에 너무 어두워요.",
        created_at: "2025-08-14T11:32:10.123Z",
        category: "치안/안전",
        dong: "정릉3동",
        image: null,
    },
    {
        id: 2,
        writer: "김철수",
        title: "쓰레기 무단 투기",
        content: "길모퉁이에 쓰레기가 쌓여있어요.",
        created_at: "2025-08-15T09:20:00.000Z",
        category: "환경/청결",
        dong: "광희동",
        image: null,
    },
];

const BoardPage = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDong, setSelectedDong] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 정적 UI 단계에서는 화면 표시만. (로컬 필터만 간단 적용)
    const filtered = MOCK_POSTS.filter((p) => {
        const matchCategory = !selectedCategory || p.category === selectedCategory;
        const q = search.trim();
        const matchSearch =
            !q ||
            p.title.includes(q) ||
            p.content.includes(q) ||
            p.dong.includes(q) ||
            p.category.includes(q);
        const matchDong = !selectedDong || p.dong === selectedDong;

        // 날짜 필터 
        const created = new Date(p.created_at).toISOString().slice(0, 10);
        const afterStart = !startDate || created >= startDate;
        const beforeEnd = !endDate || created <= endDate;

        return matchCategory && matchSearch && matchDong && afterStart && beforeEnd;
    });

    return (
        <Page>
            <SearchBar value={search} onChange={setSearch} onSearch={() => { /* 정적 단계: 동작 없음 */ }} />
            <div style={{ marginTop: "0px" , marginBottom: "45px"}}>
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

            <PostList posts={filtered} />
        </Page>
    );
};

export default BoardPage;

/* ---------- styled ---------- */
const Page = styled.div`
    margin-top: 70px; /* 헤더 높이 고려 */
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
