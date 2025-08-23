import { useEffect, useState } from "react";
import { getNewsList } from "../../apis/posts";

export const useNewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsList();
                setNews(data);
            } catch (err) {
                console.error("뉴스 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return { news, loading };
};
