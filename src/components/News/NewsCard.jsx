import styled from "styled-components";
import { Link } from "react-router-dom";

export default function NewsCard({ id, title, image_url }) {
    return (
        <Card>
            <StyledLink to={`/news/${id}`}>
                <Thumb>
                    {image_url ? (
                        <img src={image_url} alt={title} />
                    ) : (
                        <Placeholder />
                    )}
                    <Overlay>
                        <Title>{title}</Title>
                    </Overlay>
                </Thumb>
            </StyledLink>
        </Card>
    );
}

/* ---------- styles ---------- */
const Card = styled.div`
    border-radius: 1px;
    overflow: hidden;
    position: relative;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
`;

const Thumb = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1.3;  /* 정사각형 카드 */
    background: #f5f5f5;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px 3px;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.3) 60%,
        rgba(0, 0, 0, 0) 100%
    ); /* 아래쪽 그라데이션 */
    display: flex;
    align-items: flex-end;
`;

const Title = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    line-height: 1.4;

    /* 스페이스 기준 줄바꿈 */
    white-space: normal;
    word-break: keep-all;   /* 단어는 그대로, 공백에서만 줄바꿈 */
    overflow-wrap: anywhere; /* 너무 긴 URL 같은 경우만 예외적으로 끊음 */

    /* 오른쪽 여백 보장 */
    padding-right: 8px;
`;


const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        135deg,
        #f4f4f4,
        #f4f4f4 12px,
        #eee 12px,
        #eee 24px
    );
`;
