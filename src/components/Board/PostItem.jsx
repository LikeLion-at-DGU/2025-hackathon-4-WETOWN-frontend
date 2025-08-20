import styled from "styled-components";

const PostItem = ({ post }) => {
  const date = new Date(post.created_at).toLocaleDateString("ko-KR");
  return (
    <Item>
      <Left>
        <Meta>📍 {post.dong} · {post.category}</Meta>
        <Title>{post.title}</Title>
        <Info>{post.writer} · {date}</Info>
        <Excerpt>{post.content}</Excerpt>
      </Left>
      {post.image && <Thumb src={post.image} alt={post.title} />}
    </Item>
  );
};

export default PostItem;

const Item = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #777;
  margin-bottom: 6px;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0 0 6px 0;
  line-height: 1.3;
`;

const Info = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
`;

const Excerpt = styled.p`
  margin: 0;
  color: #333;
  font-size: 14px;
`;

const Thumb = styled.img`
  width: 96px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;
