import styled from "styled-components";
import PostItem from "./PostItem";

const PostList = ({ posts }) => {
    if (!posts?.length) {
        return <Empty>게시글이 없습니다.</Empty>;
    }
    return (
        <List>
            {posts.map((p) => (
                <PostItem key={p.id} post={p} />
            ))}
        </List>
    );
};

export default PostList;

const List = styled.div`
  padding: 0 16px 80px 16px; /* 하단 네비 공간 여유 */
`;

const Empty = styled.div`
  padding: 40px 16px;
  color: #999;
  text-align: center;
`;
