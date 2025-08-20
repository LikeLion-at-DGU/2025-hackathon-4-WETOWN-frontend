import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrap, Section, LabelRow, UploadGrid, UploadSlot, RegisterBtn } from "./write.styled";

const PostPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const post = state?.post;

  useEffect(() => {
    if (!post) navigate("/post"); // 직접 접근 시 보호
  }, [post, navigate]);

  if (!post) return null;

  return (
    <Wrap>
      <Section>
        <LabelRow>작성된 글</LabelRow>
        <div><b>분류</b> : {post.category}</div>
        <div><b>지역</b> : {post.area}{post.addr ? ` (${post.addr})` : ""}</div>
        <div><b>작성자</b> : {post.author || "익명"}</div>
        <div style={{ marginTop: 10 }}><b>제목</b><br />{post.title}</div>
        <div style={{ marginTop: 10 }}><b>내용</b><br />{post.body}</div>

        {!!post.images?.length && (
          <>
            <LabelRow style={{ marginTop: 16 }}>첨부 이미지</LabelRow>
            <UploadGrid>
              {post.images.map((src, i) => (
                <UploadSlot key={i}>
                  <img src={src} alt={`첨부${i + 1}`} />
                </UploadSlot>
              ))}
            </UploadGrid>
          </>
        )}

        <RegisterBtn type="button" onClick={() => navigate("/board")}>
          게시판으로
        </RegisterBtn>
      </Section>
    </Wrap>
  );
};

export default PostPreview;
