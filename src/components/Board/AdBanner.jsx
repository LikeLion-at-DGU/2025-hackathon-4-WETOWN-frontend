import styled from "styled-components";

const AdBanner = () => {
    return <Banner>📢 광고/배너 영역</Banner>;
};

export default AdBanner;

const Banner = styled.div`
  margin: 0 16px 12px 16px;
  height: 90px;
  background: linear-gradient(90deg, #4f5459, #575664);
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;
