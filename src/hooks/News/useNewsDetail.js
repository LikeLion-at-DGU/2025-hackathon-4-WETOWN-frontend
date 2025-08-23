import { useEffect, useState } from "react";
import { getNewsDetail } from "../../apis/posts";

export const useNewsDetail = (id) => {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getNewsDetail(id);
                setNews(data);
            } catch (err) {
                console.error("뉴스 상세 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    return { news, loading };
};
