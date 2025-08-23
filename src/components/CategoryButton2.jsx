import React from "react";
import styled from "styled-components";

const categories = ["불편 / 민원", "동네 바람", "정보 공유", "자유 의견"];

const CategoryButtons2 = ({ selectedCategory, onClick }) => {
    return (
        <Wrapper $top={top}>
            {categories.map((category) => (
                <Button
                    key={category}
                    selected={selectedCategory === category}
                    onClick={() => onClick(category)}
                >
                    {category}
                </Button>
            ))}
        </Wrapper>
    );
};

export default CategoryButtons2;


const Wrapper = styled.div`
  position: absolute;
  top: 128px; 
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 10;
`;


const Button = styled.button`
    padding: 5px 13px;
    border: 1px solid #ccc;
    border-radius: 20px;
    cursor: pointer;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); */
    background: var(--bg1, #FFF);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    font-size: 12px;
    transition: 0.2s all;

    background: ${(props) => (props.selected ? "#00B890" : "#fff")};
    color: ${(props) => (props.selected ? "#fff" : "#333")};

    &:hover {
        background: ${(props) => (props.selected ? "#00B890" : "#f5f5f5")};
    }
`;
