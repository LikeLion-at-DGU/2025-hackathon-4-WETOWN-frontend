import { useState, useEffect } from "react";
import styled from "styled-components";

// svg 이미지들 import
import ad1 from "../assets/ad_1.svg";
import ad2 from "../assets/ad_2.svg";
import ad3 from "../assets/ad_3.svg";
import ad4 from "../assets/ad_4.svg";

const ads = [ad1, ad2, ad3, ad4]; // 광고 배열

const AdBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 4000); 

        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <BannerWrapper>
            <img src={ads[currentIndex]} alt="광고" />
        </BannerWrapper>
    );
};

export default AdBanner;

// 스타일
const BannerWrapper = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8f8f8;
    border-radius: 10px;
    margin: 10px 0;

    img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    }
`;
