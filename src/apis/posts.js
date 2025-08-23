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
