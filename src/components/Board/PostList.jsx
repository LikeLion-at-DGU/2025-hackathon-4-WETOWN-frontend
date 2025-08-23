import { Link } from "react-router-dom";
import styled from "styled-components";
import PostItem from "./PostItem";

const PostList = ({ posts }) => {
    if (!posts?.length) return <Empty>게시글이 없습니다.</Empty>;

    return (
        <List>
            {posts.map((p) => (
                <Link
                  key={p.id}
                  to={`/detail/${p.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <PostItem post={p} />
                </Link>
            ))}
        </List>
    );
};

export default PostList;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 15px;
`;

const Empty = styled.div`
  padding: 24px;
  color: #888;
  text-align: center;
`;
