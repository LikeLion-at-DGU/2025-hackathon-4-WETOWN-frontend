// src/pages/DetailPage/useDetailPage.js
import { useEffect, useState } from "react";
import axios from "axios";

export function useDetailPage(postId) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        async function fetchOne() {
            try {
                setLoading(true);
                const url = `${import.meta.env.VITE_BASE_URL}/posts/${postId}`;
                const { data } = await axios.get(url);

                if (!alive) return;

                
                setPost({
                    id: data.id,
                    image: data.image, // null or url
                    likesCount: data.likes_count,
                    isLiked: data.is_liked,
                    writer: data.writer,
                    title: data.title,
                    content: data.content,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                    category: data.category,
                    dong: data.dong,
                    locationDetail: data.location_detail,
                });

                setComments(
                    (data.comments || []).map((c) => ({
                        id: c.id,
                        writer: c.writer,
                        content: c.content,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                        post: c.post,
                    }))
                );
            } finally {
                if (alive) setLoading(false);
            }
        }

        fetchOne();
        return () => {
            alive = false;
        };
    }, [postId]);

    return { post, comments, loading };
}
