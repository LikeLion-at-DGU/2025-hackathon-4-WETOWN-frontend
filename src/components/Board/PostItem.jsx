import styled from "styled-components";
import { FaThumbsUp, FaComment } from "react-icons/fa";

const PostItem = ({ post }) => {
  const formatDate = (s) => {
    if (!s) return "";
    const d = new Date(s);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <Item>
      <Card>
        {/* 왼쪽 텍스트 */}
        <TextArea>
          <Location>📍 위치 : {post?.dong ?? "없음X"}</Location>
          <Title>{post?.title ?? ""}</Title>
          <PostDate>{formatDate(post?.created_at)}</PostDate>
        </TextArea>

        {/* 오른쪽 썸네일 + 액션 */}
        <Right>
          {post?.image && <Thumb src={post.image} alt={post?.title || "thumbnail"} />}
          {!post?.image && <ThumbPlaceholder />}
          <Actions>
            <Like>
              <FaThumbsUp size={14} /> {post?.likes_count ?? 0}
            </Like>
            <Comment>
              <FaComment size={14} /> {post?.comments_cnt ?? 0}
            </Comment>
          </Actions>
        </Right>
      </Card>
    </Item>
  );
};

export default PostItem;

/* ───────── styles ───────── */

const Item = styled.div`
  border-top: 1px solid #e9ecef;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 96px;
  gap: 12px;
  padding: 6px 0;
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Location = styled.div`
  font-size: 12px;
  color: #9aa0a6;
  margin-bottom: 4px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const PostDate = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
`;

const ThumbPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 6px;
  border: 1px dashed #e5e7eb;
  background: #fafafa;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #22c55e;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #ef4444;
`;
