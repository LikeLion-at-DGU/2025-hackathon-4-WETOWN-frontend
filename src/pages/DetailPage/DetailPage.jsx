// src/pages/DetailPage/DetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./DetailPage.styled";
import { FiMessageCircle, FiBookmark, FiSend } from "react-icons/fi";
import { AiOutlineLike } from "react-icons/ai";
import { useDetailPage } from "../../hooks/DetailPage/useDetailPage";
import instance from "../../apis/instance";
import { createComment } from "../../apis/posts";
import { useCommentContext } from "../../components/Board/CommentContext";

const DetailPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { post, comments, loading, refetch } = useDetailPage(postId);

    // 좋아요 상태
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [liking, setLiking] = useState(false);

    // 댓글 상태
    const [localComments, setLocalComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Context로 관리되는 댓글 입력창 토글 상태
    const { showCommentInput, setShowCommentInput } = useCommentContext();

    // 훅에서 가져온 댓글 → 로컬 상태로 동기화
    useEffect(() => {
        setLocalComments(Array.isArray(comments) ? comments : []);
    }, [comments]);

    // 좋아요 초기화
    useEffect(() => {
        if (!post) return;
        setLikes(Number(post.likes_count ?? 0));
        setIsLiked(Boolean(post.is_liked));
    }, [post]);

    // 좋아요 토글
    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        try {
            let res;
            if (isLiked) {
                res = await instance.request({
                    url: `/posts/${postId}/like`,
                    method: "DELETE",
                    data: {},
                });
            } else {
                res = await instance.post(`/posts/${postId}/like`, {});
            }

            if (res?.data) {
                setLikes(Number(res.data.likes_count));
                setIsLiked(Boolean(res.data.is_liked));
            } else {
                const fresh = await refetch();
                setLikes(Number(fresh.likes_count ?? 0));
                setIsLiked(Boolean(fresh.is_liked));
            }
        } catch (e) {
            console.error("좋아요 요청 실패:", e);
        } finally {
            setLiking(false);
            setShowCommentInput(false);
        }
    };

    // 댓글 전송
    // 댓글 전송
    const submitComment = async (e) => {
        e.preventDefault();
        const text = commentInput.trim();
        if (!text || submitting) return;

        const tempId = `temp-${Date.now()}`;
        const optimistic = {
            id: tempId,
            content: text,
            created_at: new Date().toISOString(),
            post: Number(postId),
        };

        setLocalComments((prev) => [...prev, optimistic]);
        setCommentInput("");
        setSubmitting(true);

        try {
            const saved = await createComment(postId, text);
            setLocalComments((prev) =>
                prev.map((c) => (c.id === tempId ? saved : c))
            );
        } catch (err) {
            console.error("댓글 작성 실패:", err);
            setLocalComments((prev) => prev.filter((c) => c.id !== tempId));
        } finally {
            setSubmitting(false);
            setShowCommentInput(false); // ✅ 댓글 등록 후 입력창 닫기
        }
    };


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
                <S.BackBtn onClick={() => navigate("/board", { replace: true })} aria-label="뒤로가기">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L13 19L14.4 17.5L7 10L14.4 2.5L13 1L4 10Z" fill="black" />
                    </svg>
                </S.BackBtn>
            </S.Header>

            <S.Card>
                <S.AuthorRow>
                    <S.Avatar />
                    <div>
                        <S.Author>{post.writer ?? "익명"}</S.Author>
                        <S.DateText>{formatDate(post.created_at)}</S.DateText>
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
                        {/* 좋아요 버튼 */}
                        <S.MetaItem
                            highlight
                            onClick={handleLike}
                            style={{
                                cursor: liking ? "not-allowed" : "pointer",
                                opacity: liking ? 0.6 : 1,
                            }}
                            title={isLiked ? "좋아요 취소" : "좋아요"}
                            aria-pressed={isLiked}
                        >
                            <AiOutlineLike color={isLiked ? "#e11d48" : "#111"} />
                            <span>{likes}</span>
                        </S.MetaItem>

                        {/* 댓글 버튼 → 입력창 토글 */}
                        <S.MetaItem
                            title="댓글 달기"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowCommentInput((prev) => !prev)}
                        >
                            <FiMessageCircle />
                            <span>{localComments.length}</span>
                        </S.MetaItem>
                    </S.MetaLeft>

                </S.MetaBar>
            </S.Card>

            {/* 댓글 리스트 */}
            <S.CommentsWrap>
                {localComments.map((c, idx) => (
                    <S.CommentItem key={c.id ?? `c-${idx}`}>
                        <S.No>익명 {idx + 1}</S.No>
                        <S.Bubble>{c.content}</S.Bubble>
                    </S.CommentItem>
                ))}
                {localComments.length === 0 && (
                    <div style={{ color: "#666", padding: "12px 8px" }}>
                        첫 댓글을 남겨보세요!
                    </div>
                )}
            </S.CommentsWrap>

            {/* 댓글 입력칸 (탭바 대신 최하단 고정) */}
            {showCommentInput && (
                <S.CommentBar as="form" onSubmit={submitComment}>
                    <S.Input
                        placeholder="댓글을 입력하세요."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        disabled={submitting}
                    />
                    <S.SendBtn
                        aria-label="send"
                        type="submit"
                        disabled={submitting || !commentInput.trim()}
                    >
                        <FiSend size={18} />
                    </S.SendBtn>
                </S.CommentBar>
            )}
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
