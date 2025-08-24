// src/apis/posts.js
import instance from "./instance";

// 게시글 관련 API …
export const getPosts = async () => {
    const res = await instance.get("/posts/");
    return res.data;
};

// 뉴스 관련 API …
export const getNewsList = async () => {
    const res = await instance.get("/news/");
    return res.data;
};

export const getNewsDetail = async (id) => {
    const res = await instance.get(`/news/${id}`);
    return res.data;
};



// 좋아요 토글 (POST /posts/{id}/like/)
export const toggleLike = async (postId) => {
    const res = await instance.post(`/posts/${postId}/like`, {});
    return res.data; // { likes_count, is_liked }
};






// 게시글 상세 조회 API 
export const getPostDetail = async (postId) => {
    const res = await instance.get(`/posts/${postId}`, {
        params: { _: Date.now() },
    });
    return res.data; // { likes_count, is_liked, ... }
};



// 댓글 목록 조회
export const getComments = async (postId) => {
    const res = await instance.get(`/posts/${postId}/comments/`);
    return Array.isArray(res.data) ? res.data : [];
};

// 댓글 작성
export const createComment = async (postId, content) => {
    const res = await instance.post(`/posts/${postId}/comments`, { content });
    return res.data; // {id, writer?, content, created_at, post, ...}
};