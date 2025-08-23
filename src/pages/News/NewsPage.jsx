import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import NewsCard from "../../components/News/NewsCard";
import { useNewsList } from "../../hooks/News/useNewsList";

export default function NewsPage() {
    const { news, loading } = useNewsList();

    if (loading) return <p>불러오는 중...</p>;

    return (
        <Wrap>
            <Grid>
            {news.map((n) => (
                <NewsCard
                key={n.id}
                id={n.id}
                title={n.short_title}
                image_url={n.image_url || "/default.jpg"}
                />
            ))}
            </Grid>
        </Wrap>
        );

}


/* ---------- styles ---------- */
const Wrap = styled.div`
    max-width: 420px; margin: 0 auto; padding: 12px;
`;  
const Loading = styled.div`padding: 60px 0; text-align: center; color:#777;`;
const Empty = styled(Loading)``;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);   /* 시안처럼 3열 */
    gap: 2px;
`;

