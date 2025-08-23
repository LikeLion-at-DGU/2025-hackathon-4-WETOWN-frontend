// src/pages/DetailPage/DetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useDetailPage } from "../../hooks/DetailPage/useDetailPage";
import * as S from "./DetailPage.styled";
import { FiArrowLeft, FiMessageCircle, FiBookmark, FiSend } from "react-icons/fi";
import { AiOutlineLike } from "react-icons/ai";


const DetailPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { post, comments, loading } = useDetailPage(postId);

    if (loading) {
        return (
            <S.Wrap>
                <S.Header>
                    <S.Brand>WE:TOWN</S.Brand>
                </S.Header>
                <S.Loading>불러오는 중…</S.Loading>
            </S.Wrap>
        );
    }

    if (!post) {
        return (
            <S.Wrap>
                <S.Header>
                    <S.Brand>WE:TOWN</S.Brand>
                </S.Header>
                <S.Loading>게시글이 없습니다.</S.Loading>
            </S.Wrap>
        );
    }

    return (
        <S.Wrap>
            <S.Header>
                <S.BackBtn onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L13 19L14.4 17.5L7 10L14.4 2.5L13 1L4 10Z" fill="black"/>
                    </svg>
                </S.BackBtn>
            </S.Header>

            <S.Card>
                <S.AuthorRow>
                    <S.Avatar />
                    <div>
                        <S.Author>{post.writer ?? "익명"}</S.Author>
                        <S.DateText>{formatDate(post.createdAt)}</S.DateText>
                    </div>
                </S.AuthorRow>

                <S.TitleBox>
                    {post.category && <S.Chip>[ {post.category} ]</S.Chip>}
                    <S.Title>{post.title}</S.Title>
                    {post.content && <S.BodyText>{post.content}</S.BodyText>}
                </S.TitleBox>

                {post.image ? (
                    <S.ImageBox>
                        <img src={post.image} alt="post" />
                    </S.ImageBox>
                ) : (
                    <S.ImagePlaceholder />
                )}

                <S.MetaBar>
                    <S.MetaLeft>
                        <S.MetaItem highlight>
                            <AiOutlineLike />
                            <span>{post.likes_count ?? 0}</span>
                        </S.MetaItem>
                        <S.MetaItem>
                            <FiMessageCircle />
                            <span>{comments.length}</span>
                        </S.MetaItem>
                    </S.MetaLeft>
                    <S.MetaRight>
                        <S.IconBtn aria-label="bookmark">
                            <FiBookmark />
                        </S.IconBtn>
                    </S.MetaRight>
                </S.MetaBar>
            </S.Card>

            <S.CommentsWrap>
                {comments.map((c, idx) => (
                    <S.CommentItem key={c.id}>
                        <S.No>익명 {idx + 1}</S.No>
                        <S.Bubble>{c.content}</S.Bubble>
                    </S.CommentItem>
                ))}
            </S.CommentsWrap>

            <S.CommentBar>
                <S.Input placeholder="댓글을 입력하세요." />
                <S.SendBtn aria-label="send">
                    <FiSend size={18} />
                </S.SendBtn>
            </S.CommentBar>
        </S.Wrap>
    );
};

export default DetailPage;

function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${y} / ${m} / ${day}`;
}